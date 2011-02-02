// Would really love to make it so that as FEW changes as possible are required to gui.js in order to make this work. Would love to make it so you simply include gui.scrubber.min.js in addition to gui.min.js. 

GUI.Controller.prototype.at = function(when, what, tween) {

	this.scrubber.addPoint(new GUI.ScrubberPoint(this.scrubber, when, what));
	this.scrubber.render();
	return this;

}

GUI.Scrubber = function(controller, timer) {	

	var _this = this;

	var points = [];
	this.timer = timer;
	this.controller = controller;
	this.controller.scrubber = this;
		

	this.domElement = document.createElement('div');
	this.domElement.setAttribute('class', 'guidat-time');

	var canvas = document.createElement('canvas');
	this.domElement.appendChild(canvas);
	
	this.g = canvas.getContext('2d');
	
	var width;
	var height;
	
	this.__defineGetter__("width", function() {
		return width;
	});
	
	this.__defineGetter__("height", function() {
		return height;
	});
	
	controller.domElement.insertBefore(this.domElement, controller.propertyNameElement.nextSibling);
	

	this.addPoint = function(point) {
		points.push(point);
		points.sort(function(a,b) {
			return a.time - b.time;
		});
	}
	
	
	
	this.render = function() {
	
		// TODO: if visible ...
		_this.g.clearRect(0, 0, width, height);
		
		for (var i in points) {
			points[i].render();
		}
		
		// Draw playhead
		
		_this.g.strokeStyle = "red";
		var t = Math.round(GUI.map(_this.timer.playhead, _this.timer.windowMin, _this.timer.windowMin+_this.timer.windowWidth, 0, width))+0.5;
		_this.g.beginPath();
		_this.g.moveTo(t, 0);
		_this.g.lineTo(t, height);
		_this.g.stroke();
		
	}
	
	this.render();
	
	var onResize = function() {
		canvas.width = width = _this.domElement.offsetWidth;
		canvas.height = height = _this.domElement.offsetHeight;
		_this.render();
	};
	
	window.addEventListener('resize', function(e) {
		onResize();
	}, false);
	
	onResize();

	this.timer.addPlayListener(this.render);
	
	var onPlayChange = function(curTime, prevTime) {
		
		// This assumes a SORTED point array
		// And a PROGRESSING/INCREASING/GROWING playhead
		for (var i = 0; i < points.length; i++) {
			var cur = points[i];
			
			if (cur.time < prevTime) {
				continue;
			}
			
			if (cur.time >= prevTime && cur.time <= curTime) {
				pointHandlers[_this.controller.type].call(_this, cur);
			}	
			
		}	
		
	};
	
	var pointHandlers = {
	
		'function': function(point) {	
			this.controller.getValue().call(this);
		}, 
		
		'boolean': function(point) {
			this.controller.setValue(point.value);
		},
		
		'string': function(point) {
			this.controller.setValue(point.value);
		},
		
		'number': function(point) {
			//
		}
		
	}
	
	this.timer.addPlayListener(onPlayChange);
	
	this.timer.addWindowListener(this.render);
	
	
};

GUI.ScrubberPoint = function(scrubber, time, value) {
	
	var _this = this;
	
	var g = scrubber.g;
	var timer = scrubber.timer;
	this.value = value;
	var rectSize = 4;
	
	this.__defineGetter__("time", function() {
		return time;
	});
	
	this.render = function() {
	
		var x = GUI.map(time, timer.windowMin, timer.windowMin+timer.windowWidth, 0, 1);

		if (x >= 0 && x <= 1) {
			x = Math.round(GUI.map(x, 0, 1, 0, scrubber.width));
		}
		
		g.save();
		g.translate(x-rectSize/2, 0);
		g.fillStyle = "#ffd800";
		g.fillRect(0, 0, rectSize/2, scrubber.height-1);
		g.fillStyle = "#ff9000";
		g.fillRect(rectSize/2, 0, rectSize/2, scrubber.height-1);
		g.restore();
		
	}
	
}

GUI.Timer = function(gui) {
	
	var _this = this;
	
	this.gui = gui;
	this.gui.timer = this;
	
	var playhead = 0;
	var lastPlayhead = 0;
	var playListeners = [];
	var windowListeners = [];
	
	var windowMin = 0;
	var windowWidth = 10000;
	
	var thisTime;
	var lastTime;
	
	var playInterval = -1;
	var playResolution = 1000/60;
	
	var playing = false;
	
	var millis = function() {
		var d = new Date();
		return d.getTime();
	}
	
	this.__defineGetter__("windowMin", function() {
		return windowMin;
	});
	
	this.__defineSetter__("windowMin", function(v) {
		windowMin = v;
		for (var i in windowListeners) {
			windowListeners[i].call(windowListeners[i]);
		}
	});
	
	this.__defineGetter__("windowWidth", function() {
		return windowWidth;
	});
	
	
	this.__defineSetter__("windowWidth", function(v) {
		windowWidth = v;
		for (var i in windowListeners) {
			windowListeners[i].call(windowListeners[i]);
		}
	});
	
	this.__defineGetter__("playhead", function() {
		return playhead;
	});
	
	this.__defineSetter__("playhead", function(t) {
		lastPlayhead = playhead;
		playhead = t;
		for (var i = 0; i < playListeners.length; i++) {
			playListeners[i].call(this, playhead, lastPlayhead);
		}
	});
	
	this.__defineGetter__("playing", function() {
		return playing;
	});
	
	this.play = function() {
		playing = true;
		lastTime = millis();
		if (playInterval == -1) {
			playInterval = setInterval(this.update, playResolution);
		}
	};
	
	this.update = function() {
		thisTime = millis();
		_this.playhead = _this.playhead + (thisTime - lastTime);
		lastTime = thisTime;
	};
	
	this.pause = function() {
		playing = false;
		clearInterval(playInterval);
		playInterval = -1;
	};
	
	this.playPause = function() {
		if (playing) {
			this.pause();
		} else {
			this.play();
		}
	}
	
	
	this.stop = function() {
		this.pause();
		this.playhead = 0;
	};
	
	this.addPlayListener = function(fnc) {
		playListeners.push(fnc);
	};
	
	this.addWindowListener = function(fnc) {
		windowListeners.push(fnc);
	};
	
	
	
}