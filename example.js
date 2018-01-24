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

var welleAPI = require('./src/welle_api.js');

welleAPI.connectAny(
	// Port Open Callback
    function(){

    	console.log('Port Open!')

        welleAPI.enableGestureOutput(
	        function(){
	        	console.log('enableGestureOutput success');
	        }, 
	        function(){
	        	console.log('enableGestureOutput fail');
	        }
        );

        welleAPI.configOutputAllData(
	        function(){
	        	console.log('configOutputAllData success');
	        }, 
	        function(){
	        	console.log('configOutputAllData fail');
	        }
        );

		welleAPI.configOutputData(
	    	['wPEAK_RAW', 'wPOSITION_FILTERED'], 
	    	function(){
	        	console.log('configOutputData success');
	        }, 
	        function(){
	        	console.log('configOutputData fail');
	        }
	    );

        welleAPI.setLedMode('wLED_1', 'wLED_FLICK_FAST',
        	function(){
	        	console.log('setLedMode success');
	        }, 
	        function(){
	        	console.log('setLedMode fail');
	        }
        )

        welleAPI.getDeviceInfo(
        	function(deviceInfo){
	        	console.log('getDeviceInfo success');
	        	console.log(deviceInfo.message);
	        }, 
	        function(){
	        	console.log('getDeviceInfo fail');
	        }
        )

        // welleAPI.recalibrate(
        // 	function(){
	       //  	console.log('recalibrate success');
	       //  }, 
	       //  function(){
	       //  	console.log('recalibrate fail');
	       //  }
        // )

        // welleAPI.startDataflow(
        // 	function(){
	       //  	console.log('startDataflow success');
	       //  }, 
	       //  function(){
	       //  	console.log('startDataflow fail');
	       //  }
        // )

    },
    // Port Close! Callback
    function(){
        console.log('Port Close!')
    },
    // Port Error! Callback
    function(){
    	console.log('Port Error!')
    }
);

welleAPI.on('data', function(data){
	console.log('onData: ', data);
});

welleAPI.on('gesture', function(gesture){
	console.log('onGesture: ', gesture);
});

// Make Sure to Stop Dataflow when Program Exit.
process.on('SIGINT', function() {
	welleAPI.stopDataflow();
	welleAPI.stopDataflow();
	setTimeout(function(){
	    process.exit();
	}, 1000); 
});

