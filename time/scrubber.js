GUI.Scrubber = function(controller, timer) {	

	var _this = this;


	this.points = [];
	this.timer = timer;
	this.timer.scrubbers.push(this);
	this.controller = controller;
	this.controller.scrubber = this;
	this.playing = false;
	
	var previouslyHandled;
	this.position = null;
	
	this.getJSON = function() {	
		
		var pointArray = [];
		for (var i in this.points) {
			pointArray.push(this.points[i].getJSON());
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
		this.sort();
	};
	
	var lastDown = 0;
	
	this.controller.addChangeListener(function(newVal) {
	
		if (!_this.playing) {
			
			var v = newVal;
			
			if (_this.controller.type == 'boolean') {
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
	this.domElement.setAttribute('class', 'guidat-scrubber');

	this.canvas = document.createElement('canvas');
	this.domElement.appendChild(this.canvas);
	
	this.g = this.canvas.getContext('2d');
	
	var width;
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
			// TODO: That's just a damned nasty for loop.
			for (var i = _this.timer.snap(_this.timer.windowMin); i < _this.timer.windowMin+_this.timer.windowWidth; i+= _this.timer.snapIncrement) {
				if (i == 0) continue;
				var x = Math.round(GUI.map(i, _this.timer.windowMin, _this.timer.windowMin+_this.timer.windowWidth, 0, width))+0.5;
				if (i < 0) {
					_this.g.strokeStyle = '#111';
				} else { 
					_this.g.strokeStyle = '#363636';
				}
				_this.g.beginPath();
				_this.g.moveTo(x, 0);
				_this.g.lineTo(x, height-1);
				_this.g.stroke();
			}
		}
		
		// Draw points
		for (var i in _this.points) {
			_this.points[i].update();
		}
		
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
		_this.canvas.width = width = _this.domElement.offsetWidth;
		_this.canvas.height = height = _this.domElement.offsetHeight;
		_this.position = GUI.getOffset(_this.canvas);
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
		var t = GUI.map(e.pageX, _this.position.left, _this.position.left+width, _this.timer.windowMin, _this.timer.windowMin+_this.timer.windowWidth);
		_this.timer.playhead = _this.timer.snap(t);
		scrubPan();
	}
	
	var pan = function(e) {
		mx = e.pageX;
		var t = GUI.map(mx - pmx, 0, width, 0, _this.timer.windowWidth);	
		_this.timer.windowMin -= t;
		pmx = mx;
	}
	
	this.canvas.addEventListener('mousedown', function(e) {
	
		// TODO: Detect right click and prevent that menu?
		if (false) {
			e.preventDefault();
			document.addEventListener('mousemove', pan, false);
			return false;
		}
	
		var thisDown = GUI.millis();
		
		// Double click creates a keyframe
		// TODO: You can double click to create a keyframe right on top of an existing keyframe.
		// TODO: Make 300 a constant of some sort.
		if (thisDown - lastDown < 300) {

			var val = _this.controller.getValue();
			
			if (_this.controller.type == 'boolean') {
				val = !val;
			}
			
			_this.timer.activePoint = new GUI.ScrubberPoint(_this, _this.timer.playhead, val);
			_this.timer.activePoint.update(); // Grab x and y
			_this.timer.activePoint.onSelect();
			_this.add(_this.timer.activePoint);
			_this.render();
		
		// A regular click COULD select a point ...
		} else if (_this.timer.hoverPoint != null) {

			if (_this.timer.activePoint != _this.timer.hoverPoint) {
				if (_this.timer.activePoint != null) _this.timer.activePoint.onBlur();
				_this.timer.activePoint = _this.timer.hoverPoint;
				_this.timer.activePoint.onSelect();
			}
			_this.timer.playhead = _this.timer.snap(_this.timer.activePoint.time);
			
			pmx = mx = e.pageX;
			document.addEventListener('mousemove', _this.timer.activePoint.onDrag, false);
			
			
			
		// Or we could just be trying to place the playhead/scrub.
		} else { 
		
			if (_this.timer.activePoint != null) {
				_this.timer.activePoint.onBlur();
			}
		
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
	
	this.canvas.addEventListener('mousewheel', function(e) {
		e.preventDefault();
		
		var dx = e.wheelDeltaX*4;
		
		var dy = e.wheelDeltaY*4;
		_this.timer.windowWidth -= dy;
		_this.timer.windowMin += dy/2 - dx;
		
		
		return false;
	}, false);
	
	this.canvas.addEventListener('mousemove', function(e) {
		_this.timer.hoverPoint = null;
		for (var i in _this.points) {
			var cur = _this.points[i];
			if (cur.isHovering(e.pageX-_this.position.left)) {
				_this.timer.hoverPoint = cur;
			}
		}
		if (_this.timer.hoverPoint == null) {
			document.body.style.cursor = 'auto';
		} else { 
			document.body.style.cursor = 'pointer';
		}
		_this.render();
	});
	
	document.addEventListener('mouseup', function() {
		document.body.style.cursor = 'auto';
		if (_this.timer.activePoint != null) {
			document.removeEventListener('mousemove', _this.timer.activePoint.onDrag, false);
		}
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
			
			// Find 'surrounding' points.
			
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
	
	// Load saved points!!!!
	
	if (timer.gui.json) {
		var json = timer.gui.json.timer.scrubbers.splice(0, 1)[0];
		for (var i in json.points) {
			var p = json.points[i];
			var pp = new GUI.ScrubberPoint(this, p.time, p.value);
			if (p.tween) {
				pp.tween = GUI.Easing[p.tween];
			}
			this.add(pp);
		}
	}
	
	
};

GUI.ScrubberPoint = function(scrubber, time, value) {
	
	var _this = this;
		
	var g = scrubber.g;
	var timer = scrubber.timer;
	var type = scrubber.controller.type;
	var x, y;
	
	this.hold = false;

	var val;
	
	this.__defineSetter__('value', function(v) {
		val = v;
		scrubber.render();
	});
	
	this.value = value;
	
	this.__defineGetter__('value', function() {
		return val;
	});
	
	this.__defineGetter__('x', function() {
		return x;
	});
	
	this.__defineGetter__('y', function() {
		return y;
	});

	var barSize = 4;
	var rectSize = 5;
	
	var c1 = '#ffd800';
	var c2 = '#ff9000';
	
	var positionTweenSelector = function() {
		var tweenSelectorLeft = (scrubber.position.left + timer.activePoint.x) - timer.tweenSelector.offsetWidth/2;
		var tweenSelectorTop = GUI.getOffset(scrubber.canvas, timer.gui.domElement).top + timer.activePoint.y - 25;
		timer.tweenSelector.style.left = tweenSelectorLeft+'px';
		timer.tweenSelector.style.top = tweenSelectorTop+'px';
	}
	
	this.onSelect = function() {
	
		if (type == 'number') {
		
			timer.showTweenSelector();
			positionTweenSelector();
			var tweenName;
			for (var i in GUI.Easing) {
				if (this.tween == GUI.Easing[i]) {
					tweenName = i;
				}
			}
			timer.tweenSelector.value = tweenName;
		
		}
		
		
	}
	
	this.onBlur = function() {
		if (type == 'number') {
			timer.hideTweenSelector();
		}
	}
	
	this.onDrag = function(e) {
		var t = GUI.map(e.pageX, scrubber.position.left, scrubber.position.left+scrubber.canvas.width, timer.windowMin, timer.windowMin+timer.windowWidth);
		_this.time = timer.snap(t);		
		timer.playhead = timer.snap(t);
		scrubber.sort();
		_this.update();
		if (type == 'number') { 
			positionTweenSelector();
		}
	}
	
	this.getJSON = function() {
		var obj = { 'value': _this.value, 'time': GUI.roundToDecimal(time,4) };
		
		// TODO: save tweens
		
		if (this.tween != GUI.Easing.Linear) {
			for (var i in GUI.Easing) {
				if (this.tween == GUI.Easing[i]) {
					obj.tween = i;
				}
			}
		}
		
		return obj;

	};
	
	this.tween = GUI.Easing.Linear;
	
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
	
	this.__defineGetter__('prev', function() {	
		if (scrubber.points.length <= 1) {
			return null;
		}
		
		var i = scrubber.points.indexOf(this);
		if (i - 1 < 0) {
			return null;
		}
		
		return scrubber.points[i-1];
		
	});
	
	this.__defineGetter__('time', function() {
		return time;
	});
	
	this.__defineSetter__('time', function(s) {
		time = s;
	});
	
	this.update = function() {
	
		x = GUI.map(time, timer.windowMin, timer.windowMin+timer.windowWidth, 0, 1);
		x = Math.round(GUI.map(x, 0, 1, 0, scrubber.width));

		y = scrubber.height/2;
		
		if (scrubber.controller.type == 'number') {
			y = GUI.map(_this.value, scrubber.controller.min, scrubber.controller.max, scrubber.height, 0);
		}
		
	}
	
	this.render = function() {
	
		if (x < 0 || x > scrubber.width) {
			return;
		}
		
		if (GUI.hidden) {
			return;
		}
		
		// TODO: if hidden because of scroll top.
		
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
				
				var p = this.prev;
				
				g.lineWidth = 3;
				g.strokeStyle='#222';

				if (p != null && p.time < timer.windowMin) {		
					var t = GUI.map(timer.windowMin, p.time, this.time, 0, 1);
					var yy = GUI.map(p.tween(t), 0, 1, p.y, y);
					
					g.beginPath();
					g.moveTo(0, yy);
					
					if (p.tween == GUI.Easing.Linear) {

						g.lineTo(x, y);	

					} else { 
					
						for (var i = t; i < 1; i+=0.01) {
							var tx = GUI.map(i, 0, 1, p.x, x);
							var ty = p.tween(i);
							ty = GUI.map(ty, 0, 1, p.y, y);
							g.lineTo(tx, ty);
						}
						
					}
					
					g.stroke();
					
				}
				
				var n = this.next;
				
				if (n != null) {
					
					g.beginPath();
					
					g.moveTo(x, y);
						

					if (_this.tween == GUI.Easing.Linear) {
						g.lineTo(n.x, n.y);
					} else { 
						for (var i = 0; i < 1; i+=0.01) {
							var tx = GUI.map(i, 0, 1, x, n.x);
							var ty = _this.tween(i);
							ty = GUI.map(ty, 0, 1, y, n.y);
							g.lineTo(tx, ty);
						}
					}
					
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

GUI.Easing = {}

GUI.Easing.Linear = function ( k ) {
	return k;
};

GUI.Easing.Hold = function(k) {
	return 0;
}

GUI.Easing.QuadraticEaseIn = function ( k ) {

	return k * k;

};

GUI.Easing.QuadraticEaseOut = function ( k ) {

	return - k * ( k - 2 );

};

GUI.Easing.QuadraticEaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
	return - 0.5 * ( --k * ( k - 2 ) - 1 );

};

GUI.Easing.CubicEaseIn = function ( k ) {

	return k * k * k;

};

GUI.Easing.CubicEaseOut = function ( k ) {

	return --k * k * k + 1;

};

GUI.Easing.CubicEaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k + 2 );

};

GUI.Easing.QuarticEaseIn = function ( k ) {

	return k * k * k * k;

};

GUI.Easing.QuarticEaseOut = function ( k ) {

	 return - ( --k * k * k * k - 1 );

}

GUI.Easing.QuarticEaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
	return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

};

//

GUI.Easing.QuinticEaseIn = function ( k ) {

	return k * k * k * k * k;

};

GUI.Easing.QuinticEaseOut = function ( k ) {

	return ( k = k - 1 ) * k * k * k * k + 1;

};

GUI.Easing.QuinticEaseInOut = function ( k ) {

	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

};

GUI.Easing.SinusoidalEaseIn = function ( k ) {

	return - Math.cos( k * Math.PI / 2 ) + 1;

};

GUI.Easing.SinusoidalEaseOut = function ( k ) {

	return Math.sin( k * Math.PI / 2 );

};

GUI.Easing.SinusoidalEaseInOut = function ( k ) {

	return - 0.5 * ( Math.cos( Math.PI * k ) - 1 );

};

GUI.Easing.ExponentialEaseIn = function ( k ) {

	return k == 0 ? 0 : Math.pow( 2, 10 * ( k - 1 ) );

};

GUI.Easing.ExponentialEaseOut = function ( k ) {

	return k == 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;

};

GUI.Easing.ExponentialEaseInOut = function ( k ) {

	if ( k == 0 ) return 0;
        if ( k == 1 ) return 1;
        if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( k - 1 ) );
        return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

};

GUI.Easing.CircularEaseIn = function ( k ) {

	return - ( Math.sqrt( 1 - k * k ) - 1);

};

GUI.Easing.CircularEaseOut = function ( k ) {

	return Math.sqrt( 1 - --k * k );

};

GUI.Easing.CircularEaseInOut = function ( k ) {

	if ( ( k /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
	return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

};

GUI.Easing.ElasticEaseIn = function( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

};

GUI.Easing.ElasticEaseOut = function( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

};

GUI.Easing.ElasticEaseInOut = function( k ) {

	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
        if ( !a || a < 1 ) { a = 1; s = p / 4; }
        else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
        if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
        return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

};

GUI.Easing.BackEaseIn = function( k ) {

	var s = 1.70158;
	return k * k * ( ( s + 1 ) * k - s );

};

GUI.Easing.BackEaseOut = function( k ) {

	var s = 1.70158;
	return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1;

};

GUI.Easing.BackEaseInOut = function( k ) {

	var s = 1.70158 * 1.525;
	if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
	return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

};

GUI.Easing.BounceEaseIn = function( k ) {

	return 1 - GUI.Easing.BounceEaseOut( 1 - k );

};

GUI.Easing.BounceEaseOut = function( k ) {

	if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {

		return 7.5625 * k * k;

	} else if ( k < ( 2 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

	} else if ( k < ( 2.5 / 2.75 ) ) {

		return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

	} else {

		return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

	}

};

GUI.Easing.BounceEaseInOut = function( k ) {

	if ( k < 0.5 ) return GUI.Easing.BounceEaseIn( k * 2 ) * 0.5;
	return GUI.Easing.BounceEaseOut( k * 2 - 1 ) * 0.5 + 0.5;

};

