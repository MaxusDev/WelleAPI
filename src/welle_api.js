var WELLE_CONST = require('./welle_const.js');
var welleDecoder = require('./welle_decoder.js');
var welleSerial = require('./welle_serial.js');

function welle(){
	this.welleSerial = new welleSerial(welleDecoder, this.msgCallback.bind(this));
	this.messagesQueue = [];
	this.sendTimer = null;
	this.messageRate = 50;
	this.recievingTimeout = 200;
	this.emitterEventListeners = {};
	this.commandCallbackPairs = [];
	this.currentCommandCallbackPair = null;
}

welle.prototype.setDebug = function(flag){
	this.welleSerial.setDebug(flag);
}

welle.prototype.connectAny = function(openClb, closeClb, errorClb){
	this.welleSerial.periodicConnect(openClb, closeClb, errorClb);
}

welle.prototype.startDataflow = function(success, error){
	var msg_type = WELLE_CONST.MSG_TYPE.wDATAFLOW;
	var param = WELLE_CONST.DATAFLOW_PARA.wSTART;
    var cmd = welleDecoder.packRequestData({msg_type : msg_type, param : param, data : undefined});
    this.send(cmd, {command:"startDataflow", successCallback:success, errorCallback:error, msg_type : msg_type, param : param});
}

welle.prototype.stopDataflow = function(success, error){
	var msg_type = WELLE_CONST.MSG_TYPE.wDATAFLOW;
	var param = WELLE_CONST.DATAFLOW_PARA.wSTOP;
	var cmd = welleDecoder.packRequestData({msg_type : msg_type, param : param, data : undefined});
	this.send(cmd, {command:"stopDataflow", successCallback:success, errorCallback:error, msg_type : msg_type, param : param})
}

welle.prototype.enableGestureOutput = function(success, error){
	var msg_type = WELLE_CONST.MSG_TYPE.wSET;
	var param = WELLE_CONST.SYSTEM_PARA.wRECOGNIZING;
    var cmd = welleDecoder.packRequestData({msg_type : msg_type, param : param, data : 1});
    this.send(cmd, {command:"enableGestureOutput", successCallback:success, errorCallback:error, msg_type : msg_type, param : param});
}

welle.prototype.disableGestureOutput = function(success, error){
	var msg_type = WELLE_CONST.MSG_TYPE.wSET;
	var param = WELLE_CONST.SYSTEM_PARA.wRECOGNIZING;
	var cmd = welleDecoder.packRequestData({msg_type : msg_type, param : param, data : 0});
	this.send(cmd, {command:"disableGestureOutput", successCallback:success, errorCallback:error, msg_type : msg_type, param : param});
}

welle.prototype.configOutputAllData = function(success, error){
	var msg_type = WELLE_CONST.MSG_TYPE.wDATAFLOW;
	var param =   WELLE_CONST.DATAFLOW_PARA.wCONFIG | WELLE_CONST.DATAFLOW_PARA.wRAW 
				| WELLE_CONST.DATAFLOW_PARA.wPEAK_RAW | WELLE_CONST.DATAFLOW_PARA.wPEAK_FILTERED 
				| WELLE_CONST.DATAFLOW_PARA.wPOSITION_RAW | WELLE_CONST.DATAFLOW_PARA.wPOSITION_FILTERED 
				| WELLE_CONST.DATAFLOW_PARA.wENVELOPE;

    var cmd = welleDecoder.packRequestData({msg_type : msg_type, param : param, data : undefined});
    this.send(cmd, {command:"configOutputAllData", successCallback:success, errorCallback:error, msg_type : msg_type, param : param});
}

welle.prototype.configOutputData = function(config, success, error){
	var msg_type = WELLE_CONST.MSG_TYPE.wDATAFLOW;
	var param = WELLE_CONST.DATAFLOW_PARA.wCONFIG;

	for (p in config){
		if (WELLE_CONST.DATAFLOW_PARA[config[p]]){
			param |= WELLE_CONST.DATAFLOW_PARA[config[p]];
		}
		else {
			console.log('Invalid Parameter: ' + config[p]);
			error && error();
			return;
		}
	}

    var cmd =  welleDecoder.packRequestData({msg_type : msg_type, param : param, data : undefined});
    this.send(cmd, {command:"configOutputData", successCallback:success, errorCallback:error, msg_type : msg_type, param : param});
}

welle.prototype.getDeviceInfo = function(success, error){
	var msg_type = WELLE_CONST.MSG_TYPE.wGET;
	var param = WELLE_CONST.SYSTEM_PARA.wDEVICE_INFO;
	var cmd = welleDecoder.packRequestData({msg_type : msg_type, param : param, data : undefined});
	this.send(cmd, {command:"getDeviceInfo", successCallback:success, errorCallback:error, msg_type : msg_type, param : param});
}

welle.prototype.setLedMode = function(led, mode, success, error){
	var led_name = ['wLED_1', 'wLED_2', 'wLED_ALL'];
	var led_mode = ['wLED_OFF', 'wLED_ON', 'wLED_FLICK_SLOW', 'wLED_FLICK_FAST'];
	var msg_type = WELLE_CONST.MSG_TYPE.wSET;
	var param;
	var data;

	if (led_name.indexOf(led) >= 0 && WELLE_CONST.SYSTEM_PARA[led]){
		param = WELLE_CONST.SYSTEM_PARA[led];
	}
	else {
		console.log('Invalid Parameter: ' + led);
		return;
	}

	if (led_mode.indexOf(mode) >= 0 && WELLE_CONST.LED_MODE[mode]){
		data = WELLE_CONST.LED_MODE[mode]
	}
	else {
		console.log('Invalid Led Mode: ' + mode);
		return;
	}

	var cmd = welleDecoder.packRequestData({msg_type : msg_type, param : param, data : data});
	this.send(cmd, {command:"setLedMode", successCallback:success, errorCallback:error, msg_type : msg_type, param : param});
}

welle.prototype.recalibrate = function(success, error){
	var msg_type = WELLE_CONST.MSG_TYPE.wSYSCMD;
	var param = WELLE_CONST.SYSCMD_PARA.wRECAL;
	var cmd = welleDecoder.packRequestData({msg_type : msg_type, param : param, data : 0});
	this.send(cmd, {command:"recalibrate", successCallback:success, errorCallback:error, msg_type : msg_type, param : param});
}

welle.prototype.msgCallback = function(msg){
	var self = this;
	// console.log('msg: ', msg)
	if (msg.response.msg_type == 'wDATAFLOW_RESP' && msg.response.dataLen){
		this.emit('onData', msg.response.data);
	}
	else if (msg.response.msg_type == 'wNOTIFICATION' && msg.response.param == 'wGESTURE'){
		this.emit('onGesture', msg.message);
	}

	this.checkRecievingCommand(msg);
}

welle.prototype.send = function(cmd, commandCallbackPair){
	this.messagesQueue.unshift(cmd);
	this.commandCallbackPairs.unshift(commandCallbackPair);
	this.startSendingProcess();
}

welle.prototype.checkRecievingCommand = function(msg){
	var correct_response = false; 
	if (this.currentCommandCallbackPair != null){
		if (WELLE_CONST.MSG_TYPE[msg.response.msg_type] == this.currentCommandCallbackPair.msg_type + 1){
			if (msg.response.msg_type == 'wDATAFLOW_RESP'){
				var param = msg.response.param.split(' ');
				var paramCode = 0;
				for (var p in param){
					if ( WELLE_CONST.DATAFLOW_PARA[param[p]]){
						paramCode |= WELLE_CONST.DATAFLOW_PARA[param[p]];
					}
				}
				if (paramCode == this.currentCommandCallbackPair.param){
					correct_response = true;
				}
			}
			else if (msg.response.msg_type == 'wSYSCMD_RESP'){
				var param = msg.response.param.split(' ');
				for (var p in param){
					if (WELLE_CONST.SYSCMD_PARA[param[p]] == this.currentCommandCallbackPair.param){
						correct_response = true;
					}
				}
			}
			else if (msg.response.msg_type == 'wGET_RESP' || msg.response.msg_type == 'wSET_RESP'){
				var param = msg.response.param.split(' ');
				for (var p in param){
					if (WELLE_CONST.SYSTEM_PARA[param[p]] == this.currentCommandCallbackPair.param){
						correct_response = true;
					}
				}
			}
		}
	}
	if (correct_response){
		this.currentCommandCallbackPair.successCallback && this.currentCommandCallbackPair.successCallback(msg);
		this.currentCommandCallbackPair = null;
	}
}

welle.prototype.setRecievingProcessTimeout = function(){
	var self = this;
	setTimeout(function(){
		if (self.currentCommandCallbackPair){
			self.currentCommandCallbackPair.errorCallback && self.currentCommandCallbackPair.errorCallback(self.currentCommandCallbackPair.command + ' Timeout, No Response!');
			self.currentCommandCallbackPair = null;
		}
	}, self.recievingTimeout)
}

welle.prototype.sendingProcess = function(){
	if (!this.welleSerial.isConnected()){
		this.stopSendingProcess();
		console.log('Welle is not connected!');
		return;
	}

	if (!this.currentCommandCallbackPair && this.messagesQueue.length > 0){
		var msg = this.messagesQueue.pop();
		this.currentCommandCallbackPair = this.commandCallbackPairs.pop();
		this.welleSerial.write(msg);
		console.log('Sending '+ this.currentCommandCallbackPair.command + ' Message')
		this.setRecievingProcessTimeout();
	}
	else if (!this.messagesQueue.length){
		this.stopSendingProcess();
	}
}

welle.prototype.stopSendingProcess = function(){
	if (this.sendTimer !== null) {
		clearInterval(this.sendTimer);
		this.sendTimer = null;
	}
}

welle.prototype.startSendingProcess = function(){
	if (this.sendTimer === null) {
		this.sendTimer = setInterval(this.sendingProcess.bind(this), this.messageRate);
	}
}

welle.prototype.normalizeEventName = function(eventName) {
	if (eventName.indexOf('on') !== 0) {
	  if (eventName[0] !== eventName[0].toUpperCase()) {
	    eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
	  } else {
	    eventName = 'on' + eventName;
	  }
	}
	return eventName;
}

welle.prototype.emit = function(eventName, data) {
    var i;
    if (this.emitterEventListeners[eventName]) {
      for (i = 0; i < this.emitterEventListeners[eventName].length; i++) {
        this.emitterEventListeners[eventName][i](data);
      }
    }
}

welle.prototype.on = function(eventName, handler) {
    eventName = this.normalizeEventName(eventName);
    if (!this.emitterEventListeners[eventName]) {
      this.emitterEventListeners[eventName] = [];
    }
    this.emitterEventListeners[eventName].push(handler);
    return;
}

welle.prototype.off = function(eventName, handler) {
    var i;
    eventName = this.normalizeEventName(eventName);
    if (typeof handler === 'undefined') {
        this.emitterEventListeners[eventName] = [];
        return;
    }
    if (!this.emitterEventListeners[eventName] || this.emitterEventListeners[eventName].length === 0) return;
    for (i = 0; i < this.emitterEventListeners[eventName].length; i++) {
        if(this.emitterEventListeners[eventName][i] === handler) this.emitterEventListeners[eventName].splice(i, 1);
    }
    return;
}

 welle.prototype.once = function(eventName, handler) {
    var self = this;
    eventName = this.normalizeEventName(eventName);
    var _handler = function () {
      handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
      self.off(eventName, _handler);
    };
    this.on(eventName, _handler);
    return;
}

module.exports = new welle();