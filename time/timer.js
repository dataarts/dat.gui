GUI.millis = function() {
	var d = new Date();
	return d.getTime();
};

GUI.Controller.prototype.at = function(when, what, tween) {
	// TODO: Disable if we're using loaded JSON. Don't want to duplicate events.
	if (!this.scrubber) {
		GUI.error('You must create a new Timer for this GUI in order to define events.');
		return this;
	}
	this.scrubber.add(new GUI.ScrubberPoint(this.scrubber, when, what));
	this.scrubber.render();
	return this;
}

GUI.loadJSON = function(json) {
	if (typeof json == 'string') {
		json = eval('('+json+')');
	}
	GUI.loadedJSON = json;
}

GUI.loadedJSON = null;

GUI.getJSON = function() {
	var guis = [];
	for (var i in GUI.allGuis) {
		guis.push(GUI.allGuis[i].getJSON());
	}
	var obj = {guis:guis};
	return {guis:guis};
}

GUI.closeSave = function() {
	//
}

GUI.save = function() {
	
	var jsonString = JSON.stringify(GUI.getJSON());
	
	var dialogue = document.createElement('div');
	dialogue.setAttribute('id', 'guidat-save-dialogue');
	
	var a = document.createElement('a');
	a.setAttribute('href', window.location.href+'?gui='+escape(jsonString));
	a.innerHTML = 'Use this URL.';
	
	var span2 = document.createElement('span');
	span2.innerHTML = '&hellip; or paste this into the beginning of your source:';
	
	var textarea = document.createElement('textarea');
	//textarea.setAttribute('disabled', 'true');
	textarea.innerHTML += 'GUI.loadJSON('+jsonString+');';

	var close = document.createElement('div');
	close.setAttribute('id', 'guidat-save-dialogue-close');
	close.addEventListener('click', function() {
		GUI.closeSave();
	}, false);
	
	
	dialogue.appendChild(a);
	dialogue.appendChild(span2);
	dialogue.appendChild(textarea);
		document.body.appendChild(dialogue);
		
		textarea.addEventListener('click', function() {
			this.select();
		}, false);
		
	
	
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
				_this.hideTweenSelector();
				break;
		}
	}, false);
	
	this.getJSON = function() {
		
		var scrubberArr = [];
		
		for (var i in _this.scrubbers) {
			scrubberArr.push(_this.scrubbers[i].getJSON());
		}
	
		var obj = {'windowMin':_this.windowMin,
				   'windowWidth':_this.windowWidth,
				   'playhead':_this.playhead,
				   'snapIncrement': _this.snapIncrement,
				   'useSnap': _this.useSnap,
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
	
	// Load saved stuff.
	if (gui.json && gui.json.timer) {
		this.playhead = gui.json.timer.playhead;
		this.snapIncrement = gui.json.timer.snapIncrement;
		this.useSnap = gui.json.timer.useSnap;
		this.windowMin = gui.json.timer.windowMin;
		this.windowWidth = gui.json.timer.windowWidth;
	}
}

