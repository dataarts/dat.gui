// Would really love to make it so that as FEW changes as possible are required to gui.js in order to make this work. Would love to make it so you simply include gui.scrubber.min.js in addition to gui.min.js. 

GUI.Controller.prototype.at = function(when, what, tween) {
	new GUI.ScrubberPoint(this.scrubber, when, what);
	this.scrubber.render();
	return this;
}

GUI.Scrubber = function(controller, timer) {	

	var _this = this;

	this.points = [];
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
	
	
	this.render = function() {
	
		// TODO: if visible ...
		_this.g.clearRect(0, 0, width, height);
		
		for (var i in _this.points) {
			_this.points[i].render();
		}
		
		// Draw playhead
		
		_this.g.strokeStyle = "red";
		_this.g.lineWidth = 1;
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
		
		if (_this.controller.type == "number") {
		
			var closestToLeft = null;
			for (var i = 0; i < _this.points.length; i++) {
				var cur = _this.points[i];
				if (cur.time >= curTime && i > 0) {
					closestToLeft = _this.points[i-1];
				}
			}
			
			
			if (closestToLeft == null || closestToLeft.time > curTime) return;
			
			var n = closestToLeft.next;
			if (n != null) {
				
				// Interpolate.
				var t = GUI.map(curTime, closestToLeft.time, n.time, 0, 1);
				t = closestToLeft.tween(t);
				var val = GUI.map(t, 0, 1, closestToLeft.value, n.value);
				_this.controller.setValue(val);
				
			}
			
			
		} else { 
			
			for (var i = 0; i < _this.points.length; i++) {
				var cur = _this.points[i];
				
				if (cur.time < prevTime) {
					continue;
				}
							
				if (cur.time >= prevTime && cur.time <= curTime) {
					pointHandlers[_this.controller.type].call(_this, cur);
				}
						
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
		
	}
	
	this.timer.addPlayListener(onPlayChange);
	
	this.timer.addWindowListener(this.render);
	
	
};

GUI.ScrubberPoint = function(scrubber, time, value) {
	
	var _this = this;
	
	scrubber.points.push(this);
	scrubber.points.sort(function(a,b) {
		return a.time - b.time;
	});
		
	var g = scrubber.g;
	var timer = scrubber.timer;
	var type = scrubber.controller.type;
	
	this.tween = function(t) {
		return t;
	};
	
	this.hold = false;
	
	this.__defineGetter__("next", function() {	
		if (scrubber.points.length <= 1) {
			return null;
		}
		
		var i = scrubber.points.indexOf(this);
		if (i + 1 >= scrubber.points.length) {
			return null;
		}
		
		return scrubber.points[i+1];
	});
	
	
	
	this.value = value;
	var barSize = 4;
	var rectSize = 7;
	
	var c1 = "#ffd800";
	var c2 = "#ff9000";
	
	this.__defineGetter__("time", function() {
		return time;
	});
	
	this.render = function() {
	

	
		var x = GUI.map(time, timer.windowMin, timer.windowMin+timer.windowWidth, 0, 1);

		if (x >= 0 && x <= 1) {
			x = Math.round(GUI.map(x, 0, 1, 0, scrubber.width));
		}
		
		switch (type) {
		
			case "number":
			
				g.save();
				var y = scrubber.height/2;

				var n = this.next;
				
				if (n != null) {
							
					var nx = GUI.constrain(GUI.map(n.time, timer.windowMin, timer.windowMin+timer.windowWidth, 0, 1));
	
					if (nx >= 0 && nx <= 1) {
						nx = Math.round(GUI.map(nx, 0, 1, 0, scrubber.width));
					}
					
					g.lineWidth = rectSize/2
					g.strokeStyle="#222";
					g.beginPath();
					g.moveTo(nx, y);
					g.lineTo(x, y);
					g.stroke();
					
					
				}		
				
				g.translate(x, y);
				g.rotate(Math.PI/4);
				g.fillStyle = c1;
				g.fillRect(-rectSize/2, -rectSize/2, rectSize, rectSize);
				g.restore();
						
				break;
		
			default:	
				g.save();
				g.translate(x-barSize/2, 0);
				g.fillStyle = c1;
				g.fillRect(0, 0, barSize/2, scrubber.height-1);
				g.fillStyle = c2;
				g.fillRect(barSize/2, 0, barSize/2, scrubber.height-1);
				g.restore();
		
		}
		
	}
	
}
