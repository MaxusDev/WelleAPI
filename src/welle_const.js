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

module.exports = Object.freeze({
    //------------MSG_TYPE-------------
	// Get and Get command response
	'MSG_TYPE' : {
		'wGET' : 0x1001,
		'wGET_RESP' : 0x1002,
		// Set and Set command response
		'wSET' : 0x2001,
		'wSET_RESP' : 0x2002,
		// Dataflow Start and response
		'wDATAFLOW' : 0x3001,
		'wDATAFLOW_RESP' : 0x3002,
		// System command and response
		'wSYSCMD' : 0x4001,
		'wSYSCMD_RESP' : 0x4002,
		// Notification for Async Data: Battery, Gesture and letter recognition
  		'wNOTIFICATION' : 0x5001,
		// reserved for future use
		'wRESERVED' : 0xFFF1,
		'wRESERVED_RESP' : 0xFFF2
	},

	'SYSTEM_PARA' : {
		// GET & SET allowed parameters
		// Refresh rate
		'wREFRESH_RATE' : 0x0001,
		// Base update parameter
		'wPOWER_STABLE_LENGTH' : 0x0002,
		'wPOWER_STABLE_VAR' : 0x0003,
		'wPEAK_STABLE_LENGTH' : 0x0004,
		'wPEAK_STABLE_VAR' : 0x0005,
		// Kalman filter parameter
		'wKALMAN_1D_CV' : 0x0006,
		'wKALMAN_1D_CA' : 0x0007,
		'wKALMAN_2D_CV' : 0x0008,
		'wKALMAN_2D_CA' : 0x0009,
		
		'wKALMAN_1D_P_VAR' : 0x0010,
		'wKALMAN_1D_Q_VAR' : 0x0011,
		'wKALMAN_2D_P_VAR' : 0x0012,
		'wKALMAN_2D_Q_VAR' : 0x0013,
		// PDAF chi dist gamma
		'wCHIDISTGAMMA' :0x0014,
		'wTRACKER_STATE_FRAMES' : 0x0015,
		'wAVERAGE_FILTER_SIZE' :0x0016,
		
		// Signal Threshold
		'wTHRESHOLD' : 0x0017,
		'wXYZ_STABLE_SIZE' : 0x0019,
		'wXYZ_STABLE_VAR' : 0x0020,
		
		// Reconizing algorithm setting
		'wRECOGNIZING' : 0x0021,

		//-------SET allowed parameters---------
		// BLE connection interval time
		'wBLE_CONNECTION_INTERVAL' : 0x0100,
		// BLE advertising time
		'wBLE_ADV_INTERVAL' : 0x0101,
		// BLE Restart
		'wBLE_RESET' : 0x0102,
		// LEDs
		'wLED_1' : 0xFF01,
		'wLED_2' : 0xFF02,
		'wLED_ALL' : 0xFF03,
		//-------SET allowed parameters---------
		
		//-------GET allowed parameters---------
		'wDEVICE_INFO' : 0x0200
	},

	'SYSCMD_PARA' : {
		//---------------------------------
		//-----------SYSCMD_PARA-----------
		'wRESET_BOOT' : 0x0001,
		'wRESET_APP' : 0x0002,
		'wRESTART' :0x0004,
		'wRECAL' : 0x0008
		//-----------SYSCMD_PARA-----------
		//---------------------------------
	},

	'DATAFLOW_PARA' : {
		//---------------------------------
		//----------DATAFLOW_PARA----------
		//dataflow control byte
		'wSTART' : 0x1000,
		'wSTOP' : 0x2000,
		'wCONFIG' : 0x4000,
		//dataflow output to device byte
		'wOUTPUT_BLE' : 0x0100,
		'wOUTPUT_USB' : 0x0200,
		//dataflow output type bytes
		'wPEAK_RAW' : 0x0002,
		'wPEAK_FILTERED' : 0x0004,
		'wPOSITION_RAW' : 0x0008,
		'wPOSITION_FILTERED' : 0x0010,
		'wENVELOPE' : 0x0020,
		'wRAW' : 0x0001
		// 'wOUTPUT_USB_DEFAULT' : 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0200,
		// 'wOUTPUT_BLE_DEFAULT' : 0x0010 | 0x0100
		//----------DATAFLOW_PARA----------
		//---------------------------------
	},

	'NOTIFICATION_PARA' : {
		'wBATTERY' : 0x0001,
		'wGESTURE' : 0x0002
	},

	'STATUS' : {
		//---------------------------------
		//----------WELLE_STATUS-----------
		'wSUCCESS' : 0x0000,
		'wERR' : 0x0001, // General error
		'wERR_INVALID_PARAMETER' : 0x0002,
		'wERR_OUT_OF_RANGE' : 0x0002, 	//A provided parameter value was out of its allowed range.
		'wERR_READONLY_PARAMETER' : 0x0003, 	//General Welle error.
		'wERR_INVALID_DATALENGTH' : 0x0004		//Invalid Datalength
		//----------WELLE_STATUS-----------
		//---------------------------------
	},

	'WELLE_GESTURE' : {
		'wNONE' : 0xFF,
		'wUNKNOWN' : 0xFE,
		'wLEFT_RIGHT' : 0x01,
		'wRIGHT_LEFT' :  0x02,
		'wUP_DOWN' : 0x03,
		'wDOWN_UP' : 0x04,
		'wCLOCKWISE' : 0x05,
		'wANTI_CLOCKWISE' : 0x06,
		'wA' : 0x07,
		'wB' : 0x08,
		'wC' : 0x09,
		'wD' : 0x0A,
		'wE' : 0x0B,
		'wF' : 0x0C,
		'wG' : 0x0D,
		'wH' : 0x0E,
		'wI' : 0x0F,
		'wJ' : 0x10,
		'wK' : 0x11,
		'wL' : 0x12,
		'wM' : 0x13,
		'wN' : 0x14,
		'wO' : 0x15,
		'wP' : 0x16,
		'wQ' : 0x17,
		'wR' : 0x18,
		'wS' : 0x19,
		'wT' : 0x1A,
		'wU' : 0x1B,
		'wV' : 0x1C,
		'wW' : 0x1D,
		'wX' : 0x1E,
		'wY' : 0x1F,
		'wZ' : 0x20,
		'wINVL' : 0x21,
		'wHOLD' : 0x22
	},

	'BATTERY_STATUS' : {
	 	'wNOTCHARGING' : 0x00,
	    'wCHARGING' : 0x01
	},

	'LED_MODE' : {
		'wLED_OFF' : 0x00,
		'wLED_ON' : 0x01,
		'wLED_FLICK_SLOW' : 0x02,
		'wLED_FLICK_FAST' : 0x03
	},

	'BLE_INTERVAL' : {
		'w20MS' : 0x00,
		'w30MS' : 0x01,
		'w50MS' : 0x02, 
		'w100MS' : 0x03,
		'w200MS' : 0x04,
		'w300MS' : 0x05,
		'w400MS' : 0x06,
		'w500MS' : 0x07,
		'w1000MS' : 0x08,
		'w1500MS' : 0x09,
		'w2000MS' : 0x0A,
		'w2500MS' : 0x0B,
		'w3000MS' : 0x0C,
		'w4000MS' : 0x0D,
		'w5000MS' : 0x0E
	}
});