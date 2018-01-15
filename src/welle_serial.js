var serialport = require('serialport');

function welleSerial(decoder, msgCallback){
	this.decoder = decoder || null;
	this.msgCallback = msgCallback || null;
	this.connectedPort = null;
	this.reconnectTask = null;
};

welleSerial.prototype.isConnected = function(){
	if (this.connectedPort){
		return true;
	}
	else {
		return false;
	}
}

welleSerial.prototype.connectToDevice = function(openClb, closeClb, errorClb){
	var self = this;
	serialport.list(function (err, ports) {
        for (var i = 0; i < ports.length; i++) {
            var port = ports[i];
            var portManufacturer = port.manufacturer;
            var portName = port.comName;
            // console.log(JSON.stringify(port))
            if (portManufacturer && portManufacturer.indexOf("STMicroelectronics") >= 0 ) {
                var myPort = new serialport(portName, {
                    baudrate: 115200,
                    buffersize: 4096 * 10
                });
                self.registerPortFunctionality(myPort, openClb, closeClb, errorClb);
                return;
            }
        }
    });
}

welleSerial.prototype.registerPortFunctionality = function(port, openClb, closeClb, errorClb){
    var self = this;
    this.connectedPort = port;

    clearInterval(this.reconnectTask);
    this.reconnectTask = null;

    port.on('data', function(data) {
        console.log('Recieving: ', self.toArrayBuffer(data));
        var ret = self.decoder.decode(data);
        if (ret){
            self.msgCallback && self.msgCallback(ret);
        }
    });

    port.on('open', function(){
    	self.flush();
    	if (openClb){
            openClb()
        }
        else {
            console.log('Port Open!');
        }
    });
    port.on('close', function(){
    	self.connectedPort = null;
    	self.periodicConnect(openClb, closeClb, errorClb);
    	if (closeClb){
            closeClb();
        }
        else {
            console.log('Port Close!');
        }
    });
    port.on('error', function(){
    	self.connectedPort = null;
    	self.periodicConnect(openClb, closeClb, errorClb);
    	if (errorClb){
            errorClb();
        }
        else {
            console.log('Port Close!');
        }
    });

}

welleSerial.prototype.periodicConnect = function(openClb, closeClb, errorClb){
	var self = this;
	if(!this.reconnectTask) {
		this.reconnectTask = setInterval(function(){
			self.connectToDevice(openClb, closeClb, errorClb);
			console.log("Search Welle COM Ports");
		}, 3000);
	}
}

welleSerial.prototype.flush = function(){
	if (this.connectedPort){
		this.connectedPort.flush(function() {
	        // console.log('Port flushed!');
	    });
	}
	else {
		console.log('No available port')
	}
	
}

welleSerial.prototype.write = function(data){
	if (this.connectedPort){
        this.connectedPort.write(data, function(){
            console.log('Writing: ', data);
        })
    }
    else {
        console.log('No available port');
    }
}

welleSerial.prototype.toArrayBuffer = function(buf) {
    // var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(buf.length);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return view;
}

module.exports =  welleSerial;