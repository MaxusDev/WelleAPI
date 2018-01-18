var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var welleAPI = require('../src/welle_api.js');

// Static
app.use(express.static('assets'))

// Router
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

// HTTP Server
server.listen(port, function() {
    console.log('Server listening at port %d', port);
})

// Socket IO
io.on('connection', function(socket) {

    console.log('a user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('recalibrate', function(flag){
    	if (flag){
    		welleAPI.recalibrate();
    	}
    })
});

// Disable debug message
welleAPI.setDebug(false);

// Welle Connect any available device
welleAPI.connectAny(
	// Port Open Callback
    function(){

    	console.log('Port Open!')

        welleAPI.configOutputAllData(
	        function(){
	        	console.log('configOutputAllData success');
	        }, 
	        function(){
	        	console.log('configOutputAllData fail');
	        }
        );

        welleAPI.startDataflow(
        	function(){
	        	console.log('startDataflow success');
	        }, 
	        function(){
	        	console.log('startDataflow fail');
	        }
        )

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

// Register 'Data' event handler
welleAPI.on('data', function(data){
	// console.log('onData: ', data);
	io.sockets.emit('onData', data);
});

// Make Sure to Stop Dataflow when Program Exit.
process.on('SIGINT', function() {
	welleAPI.stopDataflow();
	welleAPI.stopDataflow();
	setTimeout(function(){
	    process.exit();
	}, 1000); 
});

