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

