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

