GUI.millis = function() {
	var d = new Date();
	return d.getTime();
}
	
GUI.Timer = function(gui) {
	
	var _this = this;
	
	this.hoverPoint = null;
	this.activePoint = null;
	
	this.gui = gui;
	this.gui.timer = this;
	
	this.gui.domElement.setAttribute('class', 'guidat time');
	this.gui.domElement.style.width = '100%';
	
	// Put toggle button on top.
	var toggleButton = this.gui.domElement.lastChild;
	
	this.gui.domElement.removeChild(toggleButton);
	this.gui.domElement.insertBefore(toggleButton, this.gui.domElement.firstChild);
	
	// Create tween dropdown.
	this.tweenSelector = document.createElement('select');
	this.tweenSelector.setAttribute('class', 'guidat-tween-selector');
	for (var i in GUI.Easing) {
		var opt = document.createElement('option');
		opt.innerHTML = i;
		this.tweenSelector.appendChild(opt);
	}
	this.tweenSelector.addEventListener('change', function(e) {
		if (_this.activePoint != null) {
			_this.activePoint.tween = GUI.Easing[this.value];
		}
	}, false);
	this.gui.domElement.appendChild(this.tweenSelector);

	
	this.showTweenSelector = function() {
		_this.tweenSelector.style.display = 'block';
	}
	this.hideTweenSelector = function() {
		_this.tweenSelector.style.display = 'none';
	}
	
	this.hideTweenSelector();
	
	var playhead = 0;
	var lastPlayhead = 0;

	var playListeners = [];
	var windowListeners = [];
	
	var windowWidth = 10000;
	var windowMin = -windowWidth/4;
	
	var thisTime;
	var lastTime;
	
	var playInterval = -1;
	var playResolution = 1000/60;
	
	var playing = false;
	
	var snapIncrement = 250;
	var useSnap = false;
	
	this.__defineGetter__('useSnap', function() {
		return useSnap;
	});

	this.__defineSetter__('useSnap', function(v) {
		useSnap = v;
		for (var i in _this.scrubbers) {
			_this.scrubbers[i].render();
		};
	});
	
	this.__defineGetter__('snapIncrement', function() {
		return snapIncrement;
	});

	this.__defineSetter__('snapIncrement', function(v) {
		if (snapIncrement > 0) {
			snapIncrement = v;			
			for (var i in _this.scrubbers) {
				_this.scrubbers[i].render();
			};
		}
	});
	
	this.snap = function(t) {
		
		if (!this.useSnap) {
			return t;
		}
		
		var r = Math.round(t/this.snapIncrement)*this.snapIncrement;
		return r;
		
	}
	
	this.scrubbers = [];
	
	window.addEventListener('keyup', function(e) {
		if (GUI.disableKeyListeners) return;
		switch (e.keyCode) {
			case 32:
				_this.playPause();
				break;
			case 13: 
				_this.stop();
				break;
			case 8: 
				if (_this.activePoint != null) {
					_this.activePoint.remove();
					_this.activePoint = null;
				}
				break;
		}
	}, false);
	
	this.getSaveObject = function() {
		
		var scrubberArr = [];
		
		for (var i in _this.scrubbers) {
			scrubberArr.push(_this.scrubbers[i].getSaveObject());
		}
	
		var obj = {'windowMin':_this.windowMin,
				   'windowWidth':_this.windowWidth,
				   'playhead':_this.playhead,
				   'snapIncrement': _this.snapIncrement,
				   'scrubbers': scrubberArr};
				   
		return obj;
		
	};
	
	this.__defineGetter__('windowMin', function() {
		return windowMin;
	});
	
	this.__defineSetter__('windowMin', function(v) {
		windowMin = v;
		for (var i in windowListeners) {
			windowListeners[i].call(windowListeners[i]);
		}
	});
	
	this.__defineGetter__('windowWidth', function() {
		return windowWidth;
	});
	
	
	this.__defineSetter__('windowWidth', function(v) {
		// TODO: Make these constants.
		windowWidth = GUI.constrain(v, 1000, 60000);
		for (var i in windowListeners) {
			windowListeners[i].call(windowListeners[i]);
		}
	});
	
	this.__defineGetter__('playhead', function() {
		return playhead;
	});
	
	this.__defineSetter__('playhead', function(t) {
		lastPlayhead = playhead;
		playhead = t;
		if (playing) {
			windowMin += ((playhead-windowWidth/2)-windowMin)*0.3;
		}
		for (var i = 0; i < playListeners.length; i++) {
			playListeners[i].call(this, playhead, lastPlayhead);
		}
	});
	
	this.__defineGetter__('playing', function() {
		return playing;
	});
	
	this.play = function() {
		playing = true;
		lastTime = GUI.millis();
		if (playInterval == -1) {
			playInterval = setInterval(this.update, playResolution);
		}
	};
	
	this.update = function() {
		thisTime = GUI.millis();
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
		this.windowMin = -windowWidth/4;
	};
	
	this.addPlayListener = function(fnc) {
		playListeners.push(fnc);
	};
	
	this.addWindowListener = function(fnc) {
		windowListeners.push(fnc);
	};
		
}