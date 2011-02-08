GUI.Controller.prototype.at = function(when, what, tween) {
	// TODO: tween
	this.scrubber.add(new GUI.ScrubberPoint(this.scrubber, when, what));
	this.scrubber.render();
	return this;
}

GUI.Scrubber = function(controller, timer) {	

	var _this = this;

	this.points = [];
	this.timer = timer;
	this.timer.scrubbers.push(this);
	this.controller = controller;
	this.controller.scrubber = this;
	this.playing = false;
	
	var previouslyHandled;
	
	this.getSaveObject = function() {	
		
		var pointArray = [];
		for (var i in this.points) {
			pointArray.push(this.points[i].getSaveObject());
		}
		var obj = {'points': pointArray};
		
		return obj;
		
	};
	
	this.sort = function() {
		this.points.sort(function(a,b) {
			return a.time - b.time;
		});
	};
	
	this.add = function(p) {
		this.points.push(p);
		this.getSaveObject();
		this.sort();
	};
	
	var lastDown = 0;
	
	this.controller.addChangeListener(function(newVal) {
	
	
		if (!_this.playing) {
			var v = newVal;
			if (_this.controller.type == "boolean") {
			  v = !v; // Couldn't tell you why I have to do this.
			}
			if (_this.timer.activePoint == null) {

				_this.timer.activePoint = new GUI.ScrubberPoint(_this, _this.timer.playhead, v);
				_this.add(_this.timer.activePoint);
				_this.render();
			} else { 
				_this.timer.activePoint.value = v;
			}
		}
		
	});

	this.domElement = document.createElement('div');
	this.domElement.setAttribute('class', 'guidat-time');

	var canvas = document.createElement('canvas');
	this.domElement.appendChild(canvas);
	
	this.g = canvas.getContext('2d');
	
	var width;
	var position;
	var height;
	
	var mx, pmx;
	
	this.__defineGetter__('width', function() {
		return width;
	});
	
	this.__defineGetter__('height', function() {
		return height;
	});
	
	controller.domElement.insertBefore(this.domElement, controller.propertyNameElement.nextSibling);
	
	this.render = function() {
	
		// TODO: if visible ...
		
		_this.g.clearRect(0, 0, width, height);
		
		// Draw 0
		if (_this.timer.windowMin < 0) {
			var x = GUI.map(0, _this.timer.windowMin, _this.timer.windowMin+_this.timer.windowWidth, 0, width);
			_this.g.fillStyle = '#000';
			_this.g.fillRect(0, 0, x, height-1);
		}
		
		// Draw ticks
		if (_this.timer.useSnap) {
			_this.g.lineWidth = 1;
			for (var i = _this.timer.snap(_this.timer.windowMin); i < _this.timer.windowMin+_this.timer.windowWidth; i+= _this.timer.snapIncrement) {
				if (i == 0) continue;
				var x = Math.round(GUI.map(i, _this.timer.windowMin, _this.timer.windowMin+_this.timer.windowWidth, 0, width))+0.5;
				if (i < 0) {
					_this.g.strokeStyle = '#111111';
				} else { 
					_this.g.strokeStyle = '#282828';
				}
				_this.g.beginPath();
				_this.g.moveTo(x, 0);
				_this.g.lineTo(x, height-1);
				_this.g.stroke();
			}
		}
		
		// Draw points
		
		for (var i in _this.points) {
			_this.points[i].render();
		}
		
		// Draw playhead
		
		_this.g.strokeStyle = '#ff0024';
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
		position = GUI.getOffset(canvas);
		_this.render();
	};
	
	window.addEventListener('resize', function(e) {
		onResize();
	}, false);
	
	
	var scrubPan = function() {
		var t = _this.timer.playhead;
		var tmin = _this.timer.windowMin + _this.timer.windowWidth/5;
		var tmax = _this.timer.windowMin + _this.timer.windowWidth - _this.timer.windowWidth/5;
		
		if (t < tmin) {
			_this.timer.windowMin += GUI.map(t, _this.timer.windowMin, tmin, -_this.timer.windowWidth/50, 0);
		}
		
		if (t > tmax) {
			_this.timer.windowMin += 0;
			
			_this.timer.windowMin += GUI.map(t, tmax, _this.timer.windowMin+_this.timer.windowWidth, 0,_this.timer.windowWidth/50);
		}
		
	}
	
	var scrub = function(e) {
		var t = GUI.map(e.pageX, position.left, position.left+width, _this.timer.windowMin, _this.timer.windowMin+_this.timer.windowWidth);
		_this.timer.playhead = _this.timer.snap(t);
		scrubPan();
	}
	
	var pan = function(e) {
		mx = e.pageX;
		var t = GUI.map(mx - pmx, 0, width, 0, _this.timer.windowWidth);	
		_this.timer.windowMin -= t;
		pmx = mx;
	}
	
	var dragActive = function(e) {
	
		var t = GUI.map(e.pageX, position.left, position.left+width, _this.timer.windowMin, _this.timer.windowMin+_this.timer.windowWidth);
		_this.timer.activePoint.time = _this.timer.snap(t);		
		_this.timer.playhead = _this.timer.snap(t);
		pmx = mx;		
		_this.sort();
	}
	
	canvas.addEventListener('mousedown', function(e) {
	
		if (false) {
			e.preventDefault();
			document.addEventListener('mousemove', pan, false);
			return false;
		}
	
		var thisDown = GUI.millis();
		
		// Double click creates a keyframe
		if (thisDown - lastDown < 300) {

			_this.timer.activePoint = new GUI.ScrubberPoint(_this, _this.timer.playhead, _this.controller.getValue());
			_this.add(_this.timer.activePoint);
			_this.render();
		
		// A regular click COULD select a point ...
		} else if (_this.timer.hoverPoint != null) {

			_this.timer.activePoint = _this.timer.hoverPoint;
			_this.timer.playhead = _this.timer.snap(_this.timer.activePoint.time);
			
			pmx = mx = e.pageX;
			document.addEventListener('mousemove', dragActive, false);
			
		// Or we could just be trying to place the playhead/scrub.
		} else { 
		
			_this.timer.activePoint = null;
			_this.timer.hoverPoint = null;
			scrub(e);
			document.body.style.cursor = 'text';
			_this.timer.pause();
			pmx = mx = e.pageX;
			document.addEventListener('mousemove', scrub, false);
			_this.render();
			
		}
		
		lastDown = thisDown;
		
	}, false);
	
	canvas.addEventListener('mousewheel', function(e) {
		e.preventDefault();
		
		var dx = e.wheelDeltaX*4;
		
		var dy = e.wheelDeltaY*4;
		_this.timer.windowWidth -= dy;
		_this.timer.windowMin += dy/2 + dx;
		
		
		return false;
	}, false);
	
	canvas.addEventListener('mousemove', function(e) {
		_this.timer.hoverPoint = null;
		for (var i in _this.points) {
			var cur = _this.points[i];
			if (cur.isHovering(e.pageX-position.left)) {
				_this.timer.hoverPoint = cur;
			}
		}
		if (_this.timer.hoverPoint == null) {
			document.body.style.cursor = 'pointer';
		} else { 
			document.body.style.cursor = 'auto';
		}
		_this.render();
	});
	
	document.addEventListener('mouseup', function() {
		document.body.style.cursor = 'auto';
		document.removeEventListener('mousemove', dragActive, false);
		document.removeEventListener('mousemove', scrub, false);
		document.removeEventListener('mousemove', pan, false);
	}, false);
	
	onResize();

	this.timer.addPlayListener(this.render);
	
	var handlePoint = function(point) {
		if (point != previouslyHandled) {
			previouslyHandled = point;
			_this.controller.setValue(point.value);
		}
	};
	
	var onPlayChange = function(curTime, prevTime) {
		
		if (_this.points.length == 0) return;
		
		_this.playing = true;
		
		if (_this.controller.type == 'function') {
			
				for (var i = 0; i < _this.points.length; i++) {	
					var t = _this.points[i].time;
					if ((curTime > prevTime && prevTime < t && t < curTime) || 
					    (curTime < prevTime && prevTime > t && t > curTime)) {
						_this.controller.getValue().call(this);
					}
				}
			
		} else { 
			
			var prev = undefined, next = undefined;
			
			// Find "surrounding" points.
			
			for (var i = 0; i < _this.points.length; i++) {
				var t = _this.points[i].time;
				
				if (t > curTime) {
					
					if (i == 0) {
						
						prev = null;
						next = _this.points[i];
						break;
						
					} else { 
					
						prev = _this.points[i-1];
						next = _this.points[i];
						break;
						
					}
					
				}
				
			}
			
			if (next == undefined) {
				prev = _this.points[_this.points.length-1];
				next = null;
			}
			
			console.log(next, prev);
			
			if (next != null & prev != null) {
				
				if (_this.controller.type == 'number') {
					
					var t = prev.tween(GUI.map(curTime, prev.time, next.time, 0, 1));
					
					_this.controller.setValue(GUI.map(t, 0, 1, prev.value, next.value));
					
					
				} else { 
					handlePoint(prev);
				}
				
			} else if (next != null) {
			
				handlePoint(next);
				
			} else if (prev != null) { 
				
				handlePoint(prev);
				
			}
			
		}
		
		_this.playing = false;
		
	};
	
	this.timer.addPlayListener(onPlayChange);
	
	this.timer.addWindowListener(this.render);
	
	
};

GUI.ScrubberPoint = function(scrubber, time, value) {
	
	var _this = this;
		
	var g = scrubber.g;
	var timer = scrubber.timer;
	var type = scrubber.controller.type;
	var x, y;
	
	this.hold = false;

	var val;
	
	this.__defineSetter__("value", function(v) {
		val = v;
		scrubber.render();
	});
	
	this.value = value;
	
	this.__defineGetter__("value", function() {
		return val;
	});

	var barSize = 4;
	var rectSize = 7;
	
	var c1 = '#ffd800';
	var c2 = '#ff9000';
	
	this.getSaveObject = function() {
		var obj = { 'value': _this.value, 'time': time };
		
		if (this.hold) {
			obj.hold = true;
		}
		
		// TODO: save tweens
		
		return obj;

	};
	
	this.tween = function(t) {
		return t;
	};
	
	this.remove = function() {
		scrubber.points.splice(scrubber.points.indexOf(this), 1);
		scrubber.render();
	};
	
	this.isHovering = function(xx) {
		return xx >= x-rectSize/2 && xx <= x+rectSize/2;
	};
	
	this.__defineGetter__('next', function() {	
		if (scrubber.points.length <= 1) {
			return null;
		}
		
		var i = scrubber.points.indexOf(this);
		if (i + 1 >= scrubber.points.length) {
			return null;
		}
		
		return scrubber.points[i+1];
		
	});
	
	this.__defineGetter__('time', function() {
		return time;
	});
	this.__defineSetter__('time', function(s) {
		time = s;
	});
	
	this.render = function() {
	
		x = GUI.map(time, timer.windowMin, timer.windowMin+timer.windowWidth, 0, 1);

		if (x >= 0 && x <= 1) {
			x = Math.round(GUI.map(x, 0, 1, 0, scrubber.width));
		} else { 
			return;
		}
		
		y = scrubber.height/2;

		if (scrubber.timer.activePoint == this) {
			g.fillStyle = '#ffd800'; //
		} else if (scrubber.timer.hoverPoint == this) {
			g.fillStyle = '#999';
		} else { 
			g.fillStyle = '#ccc';
		}
		
		switch (type) {
		
			case 'boolean':
			
				g.save();
				
					g.translate(x, y-0.5);
				
				if (this.value) {
					
					g.strokeStyle = g.fillStyle;
					g.lineWidth = barSize;
					g.beginPath();
					g.arc(0, 0, barSize, 0, Math.PI*2, false);
					g.stroke();
				} else { 
				
					g.rotate(Math.PI/4);
					g.fillRect(-barSize/2, -barSize*3.5/2, barSize, barSize*3.5);
					g.rotate(Math.PI/2);
					g.fillRect(-barSize/2, -barSize*3.5/2, barSize, barSize*3.5);
				}
				
				g.restore();
				
				break;
		
			case 'number':
			
				g.save();
				var n = this.next;
				
				if (n != null) {
							
					var nx = GUI.constrain(GUI.map(n.time, timer.windowMin, timer.windowMin+timer.windowWidth, 0, 1));
	
					nx = GUI.constrain(GUI.map(nx, 0, 1, 0, scrubber.width));
					
					g.lineWidth = rectSize/2
					g.strokeStyle='#222';
					g.beginPath();
					g.moveTo(nx, y);
					g.lineTo(x, y);
					g.stroke();
					
				}		
				
				g.translate(x, y);
				g.rotate(Math.PI/4);
			//	g.fillStyle = c1;
				g.fillRect(-rectSize/2, -rectSize/2, rectSize, rectSize);
				g.restore();
						
				break;
		
			default:	
				g.save();
				g.translate(x-barSize/2, 0);
				//g.fillStyle = c1;
				g.fillRect(0, 0, barSize/2, scrubber.height-1);
				//g.fillStyle = c2;
				g.fillRect(barSize/2, 0, barSize/2, scrubber.height-1);
				g.restore();
		
		}
		
	}
	
}
