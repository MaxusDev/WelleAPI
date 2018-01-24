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

// gui
var visible = true;
var ratio = 2;
var gui;
var canvas;
var paths_raw = [];
var paths_filtered = [];
var ch1_envelope_data 		= new Array(600);
var ch2_envelope_data 		= new Array(600);
var ch1_raw_Data  			= new Array(1360);
var ch2_raw_Data  			= new Array(1360);
var position_raw_data 		= new Array(3);
var position_filtered_data 	= new Array(3);
var peak_filtered_data 		= new Array(2);
var peak_raw_data 			= new Array(2);

var ch1_envelope 			= false;
var ch2_envelope 			= false;
var ch1_raw					= true;
var ch2_raw					= true;
var position_raw			= false;
var position_filtered 		= true;
var peak_filtered 			= false;
var peak_raw				= false;

function setup() {
  canvas = createCanvas(window.innerWidth/ratio, window.innerHeight/ratio);
  canvas.position(0, 0);
  canvas.style('width', '100%');
  canvas.style('height', '100%');

  // Create Layout GUI
  gui = createGui('Maxutech', width * ratio - 220, 20);
  gui.addGlobals('ch1_raw', 'ch2_raw', 'ch1_envelope', 'ch2_envelope', 'peak_raw', 'peak_filtered', 'position_raw', 'position_filtered');

  gui.addButton('Recalibrate', function(){
  	socket.emit('recalibrate', true);
  })
}

function draw() {
	rectMode(CENTER);
    fill(0x19,0x26,0x31);
    noStroke();
    rectMode(CENTER);
    rect(width/2, height/2, width, height);
	app.draw();
}

function windowResized() {
  resizeCanvas(window.innerWidth/ratio, window.innerHeight/ratio);
  canvas.position(0, 0);
  canvas.style('width', '100%');
  canvas.style('height', '100%');
}

var app = {};

app.draw = function(){
	this.drawRaw(ch1_raw_Data, width * 0.1, height * 0.15, color('#0E85C9'), width * 0.8, height * 0.2, 'Raw_Ch1', color(255, 255, 255), ch1_raw)
	this.drawRaw(ch2_raw_Data, width * 0.1, height * 0.40, color('#1CD182'), width * 0.8, height * 0.2, 'Raw_Ch2', color(255, 255, 255), ch2_raw)

	this.drawEnvelope(ch1_envelope_data, width * 0.1, height * 0.65, color('#0E85C9'), width*0.39, height*0.2, 'Envelope_Ch1', color(255, 255, 255), ch1_envelope,
		peak_raw, peak_filtered, peak_raw_data[0], peak_filtered_data[0]);
	this.drawEnvelope(ch2_envelope_data, width * 0.1, height * 0.90, color('#1CD182'), width*0.39, height*0.2, 'Envelope_Ch2', color(255, 255, 255), ch2_envelope, 
		peak_raw, peak_filtered, peak_raw_data[1], peak_filtered_data[1]);
	
	this.drawPosition(width * 0.51, height * 0.55, width * 0.39, height * 0.5);

}

app.drawPosition = function(translateX, translateY, width, height) {
	push();
    translate(translateX, translateY);
    rectMode(CORNER);
    fill(0x22, 0x33, 0x3F);
    noStroke();
    rect(0, 0, width, height);
    displayText('Position', 0, 0, 10, color(255), 'ARIAL', LEFT, BOTTOM)
    
    var offset = 0;
    var text_offset = 0;
    if (position_raw){
    	offset += 10 * 3.8 + 10;
	    fill('#FC4750')
	    ellipse(width - offset, -5, 10, 10);
	    displayText('Raw Pos', width, 0, 10, color(255), "ARIAL", RIGHT, BOTTOM);
    }

    if (position_filtered){
    	if (offset != 0){
	    	text_offset = offset + 10;
	    	offset += 10 * 5.1 + 20;
	    }
	    else {
	    	offset += 10 * 5.1 + 10;
	    }
	    
	    fill('#71E2E0')
	    ellipse(width - offset, -5, 10, 10);
	    displayText('Filtered Pos', width - text_offset, 0, 10, color(255), "ARIAL", RIGHT, BOTTOM);
    }

    pop();
    for (var i = paths_raw.length - 1; i >= 0; i--) {
        var c = paths_raw[i];
        if (!c.isDead()) {
            c.update();
            c.display(translateX, translateY, width, height);
        } else {
            paths_raw.splice(i, 1);
        }
    }

    for (var i = paths_filtered.length - 1; i >= 0; i--) {
        var c = paths_filtered[i];
        if (!c.isDead()) {
            c.update();
            c.display(translateX, translateY, width, height);
        } else {
            paths_filtered.splice(i, 1);
        }
    }
}

app.drawEnvelope = function(plot, plotX, plotY, color, width, height, text, text_color, drawFlag, peakRawFlag, peakFilteredFlag, peakRaw, peakFiltered) {
    var plotWidth = width;
    var plotHeight = height;
    ratio = (plot.length) / plotWidth;
    var magnitude = 4000;
    var shift = plotX;

    rectMode(CENTER);
    fill(0x22, 0x33, 0x3F);
    // fill(81, 93, 108);
    noStroke();
    rect(plotWidth/2 + shift, plotY, plotWidth, plotHeight);


    displayText(text, plotX, plotY - plotHeight / 2, 10, text_color, "ARIAL", LEFT, BOTTOM);

    if (drawFlag){
    	stroke(color);
	    strokeWeight(2);

	    for (var i = 1; i < plotWidth - 10; i++){
	    	var yp = -this.calcY(plot[int((i + 1) * ratio)], plotHeight, magnitude) + plotY;
	        var yc = -this.calcY(plot[int(i * ratio)], plotHeight, magnitude) + plotY;
	        line(i + 1 + shift, yp, i + shift, yc);
	    }
    }

    var offset = 0;
    var text_offset = 0;
    if (drawFlag && peakRawFlag){
    	stroke('#FC4750');
	    strokeWeight(2);
	    var x = peakRaw / 600 * plotWidth + shift;
	    line(x, plotY - plotHeight / 2, x, plotY + plotHeight / 2)

	    offset += 10 * 4.5 + 10;
	    fill('#FC4750')
	    ellipse(plotX + plotWidth - offset, plotY - plotHeight / 2 - 5, 10, 10);
	    displayText('Raw Peak', plotX + plotWidth, plotY - plotHeight / 2, 10, text_color, "ARIAL", RIGHT, BOTTOM);
    }

    if (drawFlag && peakFilteredFlag){
    	stroke('#71E2E0');
	    strokeWeight(2);
	    var x = peakFiltered / 600 * plotWidth + shift;
	    line(x, plotY - plotHeight / 2, x, plotY + plotHeight / 2)

	    if (offset != 0){
	    	text_offset = offset + 10;
	    	offset += 10 * 5.8 + 20;
	    }
	    else {
	    	offset += 10 * 5.8 + 10;
	    }
	    
	    fill('#71E2E0')
	    ellipse(plotX + plotWidth - offset, plotY - plotHeight / 2 - 5, 10, 10);
	    displayText('Filtered Peak', plotX + plotWidth - text_offset, plotY - plotHeight / 2, 10, text_color, "ARIAL", RIGHT, BOTTOM);
    }
}

app.drawRaw = function(plot, plotX, plotY, color, width, height, text, text_color, drawFlag) {
    var plotWidth = width;
    var plotHeight = height;
    var ratio = (plot.length) / plotWidth;
    var magnitude = 4096;
    var shift = plotX;

    rectMode(CENTER);
    fill(0x22, 0x33, 0x3F);
    // fill(81, 93, 108);
    noStroke();
    rect(plotWidth/2 + shift, plotY, plotWidth, plotHeight);

    displayText(text, plotX, plotY - plotHeight / 2, 10, text_color, "ARIAL", LEFT, BOTTOM);

	if (drawFlag){
		stroke(color);
	    strokeWeight(2);

	    for (var i = 0; i < plotWidth; i++){
	    	var yp = -this.calcY(plot[int((i + 1) * ratio)], plotHeight, magnitude) + plotY + height / 2;
	        var yc = -this.calcY(plot[int(i * ratio)], plotHeight, magnitude) + plotY + height / 2;
	        line(i + 1 + shift, yp, i + shift, yc);
	    }
	}
}

app.calcY = function(i, plotHeight, magnitude){
    return (i * plotHeight) / magnitude;
}

function pushData(data) {
	if ( data.wENVELOPE ){
		ch1_envelope_data = data.wENVELOPE.slice(0, data.wENVELOPE.length / 2);
	    ch2_envelope_data = data.wENVELOPE.slice(data.wENVELOPE.length / 2, data.wENVELOPE.length);	
	}

	if (data.wRAW ){
		ch1_raw_Data = data.wRAW.slice(0, data.wRAW.length / 2);
		ch2_raw_Data = data.wRAW.slice(data.wRAW.length / 2, data.wRAW.length);
	}

	if (data.wPOSITION_RAW && position_raw){
		if((data.wPOSITION_RAW[0] != 0 || data.wPOSITION_RAW[1] != 0) && abs(data.wPOSITION_RAW[0]) < 150 && abs(data.wPOSITION_RAW[1] < 300)){
			paths_raw.push(new circle(createVector(data.wPOSITION_RAW[0], data.wPOSITION_RAW[1]), 0.012*width, color('#FC4750')));
		}
	}

	if (data.wPOSITION_FILTERED && position_filtered){
		if((data.wPOSITION_FILTERED[0] != 0 || data.wPOSITION_FILTERED[1] != 0)  && abs(data.wPOSITION_FILTERED[0]) < 150 && abs(data.wPOSITION_FILTERED[1] < 300)){
			paths_filtered.push(new circle(createVector(data.wPOSITION_FILTERED[0], data.wPOSITION_FILTERED[1]), 0.012*width, color('#71E2E0')));
		}
	}

	if (data.wPEAK_FILTERED && peak_filtered){
		peak_filtered_data = data.wPEAK_FILTERED;
	}

	if (data.wPEAK_RAW && peak_raw){
		peak_raw_data = data.wPEAK_RAW;
	}
}

// check for keyboard events
function keyPressed() {
  switch(key) {
    // type [F1] to hide / show the GUI
    case 'p':
      visible = !visible;
      if(visible) gui.show(); else gui.hide();
      break;
  }
}

function displayText(content, x, y, size, color, font, verticalAlign, horizontalAlign) {
    fill(color);
    noStroke();
    textFont("ARIAL");
    textStyle(NORMAL);
    textSize(size);
    textAlign(verticalAlign, horizontalAlign);
    text(content, x, y);
}

function circle(pos, r, color) {
    this.pos = pos;
    this.opac = 255;
    this.decr = 8;
    this.r = r;
    this.color = color;
}

circle.prototype.update = function() {
    this.opac -= this.decr;
}

circle.prototype.display = function(translateX, translateY, width, height) {
    push();
    translate(translateX, translateY);
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.opac);
    noStroke();
    ellipse(map(this.pos.x, -160, 160, -width * 0.5, width * 0.5) + width / 2, map(this.pos.y, -80, -350, -height * 0.4, height * 0.4) + height * 0.5, this.r, this.r);
    pop();
}

circle.prototype.isDead = function() {
    if (this.opac < 0) {
        return true;
    } else {
        return false;
    }
}
