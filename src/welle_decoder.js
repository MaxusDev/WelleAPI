/*
*    Welle Api for developer to create their own gesture controlled applications
*    Copyright (C) 2015 - 2017 Maxustech Technologies Inc.
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*    See www.maxustech.com for more details. 
*    All requests should be sent to info@maxustech.com.
*/

var WELLE_CONST = require('./welle_const.js')

var defaultSettings = {
    int16Bytes 		: 2,
	float32Bytes 	: 4, 
    headerLen 		: 6,
    reservedLen 	: 6, 
    peakRawLen 		: 2,
    peakFilteredLen : 2,
    posRawLen 		: 3,
	posFilteredLen 	: 3,
	signalLen 		: 1200, 
	dataHeader 		: 35,
	dataflowLen 	: 5
};

var DECODERSTATE = {
    unknown 	: -1,
    header 		: 1,
    dataLength 	: 2,
    message 	: 3,
    dataflow 	: 4
};

var welleDecoder = {
	settings 			: defaultSettings,
    decodeState 		: DECODERSTATE.header,
    byteCount 			: 0,
    headerCount 		: 0,
	bufferData 			: [],
	messageLen 			: 0,
	previousDataByte 	: null
};

welleDecoder.resetBuffer = function(){
	this.bufferData = [];
};

welleDecoder.decode = function(data){
	var ret = null;
	for(var i = 0; i < data.length; i++){
		var dataByte = data[i];
        var decodeState = this.decodeHeader(dataByte);

        if(decodeState){
        	this.decodeState = decodeState;
        	continue;
        }

        if(this.decodeState == DECODERSTATE.dataflow){
        	var ret = this.decodeDataflow(dataByte);
        	if(ret != undefined){
        		continue;
        	}
        }
        else if(this.decodeState == DECODERSTATE.dataLength){
            this.decodeDataLength(dataByte);
        }
        else if(this.decodeState == DECODERSTATE.message){
            ret = this.decodeDataMessage(dataByte);
            if(ret != undefined){
            	return ret;
            }
        }
	}
	return ret;
};

welleDecoder.resetDecodeState = function(){
	this.byteCount = 0;
	this.bufferData = [];
	this.previousDataByte = null;
	this.decodeState = DECODERSTATE.header;
};

welleDecoder.decodeHeader = function(dataByte){
	var decodeState = null;
	if(dataByte == this.settings.dataHeader){
        this.headerCount++;
        if(this.headerCount == this.settings.headerLen) {
            this.headerCount = 0;
            this.resetBuffer();
            decodeState = DECODERSTATE.dataLength;
        }
    }
    else{
    	this.headerCount = 0;
    }

    if(this.previousDataByte == 33 && dataByte == 33){
    	decodeState = DECODERSTATE.dataflow;
    	this.headerCount = 0;
    }

    this.previousDataByte = dataByte;
    return decodeState;
};

welleDecoder.decodeDataflow = function(dataByte){
	this.bufferData.push(dataByte);
	this.byteCount++;
	if(this.byteCount == this.settings.dataflowLen){
		var data_x = this.convert2Int16(this.bufferData, 0);
        var data_y = this.convert2Int16(this.bufferData, 3);		

		this.resetDecodeState();
		if(Math.abs(data_x) <= 500 && Math.abs(data_y) < 500)
			return {x:data_x, y:data_y};
	}
};

welleDecoder.decodeDataLength = function(dataByte){
	this.bufferData.push(dataByte);
    this.byteCount++;
    if(this.byteCount == 2){
        this.messageLen = (this.bufferData[1] << 8) + this.bufferData[0] - 2;
        this.byteCount = 0;
        this.decodeState = DECODERSTATE.message;
    }
};

welleDecoder.decodeDataMessage = function(dataByte){
	this.bufferData.push(dataByte);
    this.byteCount++;
    if(this.byteCount == this.messageLen){
    	var response = this.decodePackBodyMessage(this.reverseByte(this.bufferData));
    	var message = null;
    	if(response.param == 'wBATTERY'){
    		message = this.decodeBatteryInfo(response.rawDataBytes);
    	}
    	else if(response.param == 'wPROFILE'){
    		message = this.decodeDeviceProfile(response.rawDataBytes);
    	}
    	else if(response.param == 'wDEVICE_INFO'){
    		message = this.decodeDeviceInfo(response.rawDataBytes);
    	}
    	else if(response.param == 'wGESTURE'){
    		message = this.decodeGesture(response.rawDataBytes);
    	}
    	this.resetDecodeState();
    	return {response : response, message: message};
    }
};

welleDecoder.convert2Int16 = function(msg, index){
	var u8array = new Uint8Array([Number(msg[index]), Number(msg[index+1])]);
	var view = new DataView(u8array.buffer);
	return view.getInt16(0);
};

welleDecoder.reverseByte = function(data){
	var data_copy = [];
    for(i = 0; i < data.length; i+=2){
        data_copy[i] = data[i+1];
        data_copy[i+1] = data[i];
    }
    return data_copy;
};

welleDecoder.decodePackBodyMessage = function(msg){
	var decodeMsg = {
		dataLen : 0,
		msg_type: WELLE_CONST.MSG_TYPE.wRESERVED,
		param 	: WELLE_CONST.SYSTEM_PARA.wREFRESH_RATE,
		status 	: WELLE_CONST.STATUS.wERR,
		data 	: {},
		valid 	: false,
		rawDataBytes : []
	}
	var msgLen = (msg[0]<<8) + msg[1];
	if (msgLen == msg.length){
		decodeMsg.valid  = true;
	}
	else{
		return decodeMsg;
	}

	decodeMsg.dataLen  = (msgLen - 8) / 2;
	decodeMsg.msg_type = (msg[2]<<8) + msg[3];
	decodeMsg.param    = (msg[4]<<8) + msg[5];
	decodeMsg.status   = (msg[6]<<8) + msg[7];

	if((decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wGET_RESP || decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wSET_RESP || decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wNOTIFICATION) && decodeMsg.dataLen){
		var msg_index = 8;
		var temp = [];
		for(var i = 0; i < decodeMsg.dataLen; i++){
			decodeMsg.data[i] = this.convert2Int16(msg, msg_index);
			msg_index += 2;
		}
		for(var i = 8; i < msg.length; i++){
			decodeMsg.rawDataBytes.push(msg[i]);
		}
	}

	if(decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wDATAFLOW_RESP){

		if(decodeMsg.dataLen){
			 var availableData = {
				'wPEAK_RAW'			: {flag : WELLE_CONST.DATAFLOW_PARA.wPEAK_RAW, dataLen : 2}, 
				'wPEAK_FILTERED'		: {flag : WELLE_CONST.DATAFLOW_PARA.wPEAK_FILTERED, dataLen : 2}, 
				'wPOSITION_RAW'		: {flag : WELLE_CONST.DATAFLOW_PARA.wPOSITION_RAW, dataLen : 3}, 
				'wPOSITION_FILTERED'	: {flag : WELLE_CONST.DATAFLOW_PARA.wPOSITION_FILTERED, dataLen : 3},
				'wENVELOPE'				: {flag : WELLE_CONST.DATAFLOW_PARA.wENVELOPE, dataLen : 1200},
				'wRAW'					: {flag : WELLE_CONST.DATAFLOW_PARA.wRAW, dataLen: (1360) * 2}
			};
			var msg_index = 8;
			for (type in availableData){
				if(decodeMsg.param & availableData[type].flag){
					var temp = [];
					for(var i = 0; i < availableData[type].dataLen; i++){
						temp[i] = this.convert2Int16(msg, msg_index);
						msg_index += 2;
					}
					decodeMsg.data[type] = temp;
				}
			}

			if (decodeMsg.data['wRAW']){
				var rearrangeData = new Array(decodeMsg.data['wRAW'].length);
				for (var i = 0; i < decodeMsg.data['wRAW'].length / 2; i++){
					rearrangeData[i] = decodeMsg.data['wRAW'][i * 2];
					rearrangeData[i + decodeMsg.data['wRAW'].length / 2] = decodeMsg.data['wRAW'][i * 2 + 1];
				}
				decodeMsg.data['wRAW'] = rearrangeData;
			}
		}
		var paramMsg = '';
		for( param in WELLE_CONST.DATAFLOW_PARA){
			if(decodeMsg.param & WELLE_CONST.DATAFLOW_PARA[param]){
				paramMsg += ' ' + param;
			}
		}
		decodeMsg.param = paramMsg;
	}
	else if(decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wGET_RESP || decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wSET_RESP){
		for( param in WELLE_CONST.SYSTEM_PARA){
			if(decodeMsg.param == WELLE_CONST.SYSTEM_PARA[param]){
				decodeMsg.param = param;
			}
		}
	}
	else if(decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wSYSCMD_RESP){
		for( param in WELLE_CONST.SYSCMD_PARA){
			if(decodeMsg.param == WELLE_CONST.SYSCMD_PARA[param]){
				decodeMsg.param = param;
			}
		}
	}
	else if(decodeMsg.msg_type == WELLE_CONST.MSG_TYPE.wNOTIFICATION){
		for( param in WELLE_CONST.NOTIFICATION_PARA){
			if(decodeMsg.param == WELLE_CONST.NOTIFICATION_PARA[param]){
				decodeMsg.param = param;
			}
		}
	}
	
	// decode response msg type
	for( msg_type in WELLE_CONST.MSG_TYPE){
		if(decodeMsg.msg_type == WELLE_CONST.MSG_TYPE[msg_type]){
			decodeMsg.msg_type = msg_type;
		}
	}
	// decode response status 
	for( status in WELLE_CONST.STATUS){
		if(decodeMsg.status == WELLE_CONST.STATUS[status]){
			decodeMsg.status = status;
		}
	}
	return decodeMsg;
};

welleDecoder.decodeBatteryInfo = function(data){
	var charging_ind = data[0];
	var charging_result = "";
	var battery_level = data[1];
	for(item in WELLE_CONST.BATTERY_STATUS){
		if(charging_ind == WELLE_CONST.BATTERY_STATUS[item]){
			charging_result = item;
		}
	}

	return {status: charging_result, percentage: battery_level};

};

welleDecoder.decodeDeviceInfo = function(data){
	var temp_UUID = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
	var UUID = temp_UUID.toString(16).toUpperCase();
	if(UUID.length < 8){
		UUID = "00" + UUID;
	}
	var version = String.fromCharCode(data[4]) + String.fromCharCode(data[5]) + String.fromCharCode(data[6]) + String.fromCharCode(data[7]);
	var batteryInfo = this.decodeBatteryInfo(data.slice(8,10));
	var deviceProfile = this.decodeDeviceProfile(data.slice(10));
	return {UUID:UUID, version: version, batteryInfo:batteryInfo, deviceProfile:deviceProfile};
};

welleDecoder.decodeDeviceProfile = function(data){
	var controlled_led_ind = (data[0] << 8) | data[1];
	var controlled_led = "";
	var shortcuts = [];
	for(item in WELLE_CONST.SYSTEM_PARA){
		if(controlled_led_ind == WELLE_CONST.SYSTEM_PARA[item]){
			controlled_led = item;
		}
	}

	for(item in WELLE_CONST.WELLE_GESTURE){
		if(data[2] == WELLE_CONST.WELLE_GESTURE[item]){
			shortcuts[0] = item;
		}

		if(data[3] == WELLE_CONST.WELLE_GESTURE[item]){
			shortcuts[1] = item;
		}
	}

	return {controlled_led : controlled_led, shortcuts: shortcuts};
};

welleDecoder.decodeGesture = function(data){
	var gesture;
    var led;

    if (data.length >= 2){
      gesture = data[0] << 8 | data[1];
      if (data.length == 4){
        led = data[2] << 8 | data[3];
      }
    }

    for (var item in WELLE_CONST.WELLE_GESTURE){
      if(gesture == WELLE_CONST.WELLE_GESTURE[item]){
        for (var l in WELLE_CONST.SYSTEM_PARA){
          if (led == WELLE_CONST.SYSTEM_PARA[l]){
            return {'gesture_code' : gesture, 'gesture' : item, 'led' : l, 'led_code' : led};
          }
        }
        return {'gesture_code' : gesture, 'gesture' : item, 'led' : null, 'led_code' : null};
      }
    }
}

welleDecoder.packRequestData = function(ReqDataObj)
{
	var msg_type = ReqDataObj.msg_type;
	var param = ReqDataObj.param;
	var data = ReqDataObj.data;

	var len = 6;
	if(typeof(data) == 'object' && data && data.length){
		len = 6 + data.length;
	}
	else if(typeof(data) == 'number'){
		len = 10;
	} 
	var msgBuf = new Uint8Array(len+6);
	for(var i = 0; i < 6; i++){
		msgBuf[i] = 0x23;
	}

	msgBuf[6] = (len & 0xFF00)>>8;
	msgBuf[7] = len & 0x00FF;

	msgBuf[8] = (msg_type & 0xFF00)>>8;
	msgBuf[9] = msg_type & 0x00FF;

	msgBuf[10] = (param & 0xFF00)>>8;
	msgBuf[11] = param & 0x00FF;

	if(typeof(data) == 'object' && data &&data.length){
		for(var i = 0; i < data.length; i++){
			msgBuf[12 + i] = data[i];
		}
	}
	else if(typeof(data) == 'number'){

		var float32HEX = new Uint8ClampedArray(new Float32Array([data]).buffer);
		float32HEX = Array.prototype.slice.call(float32HEX).reverse();

		for (var i = 0; i < float32HEX.length; i++){
			msgBuf[12 + i] = float32HEX[i];
		}
	}
	return msgBuf;
}

module.exports = welleDecoder;