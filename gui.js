var GUI = function() {

	GUI.allGuis.push(this);
	
	if (GUI.loadedJSON != null && GUI.loadedJSON.guis.length > 0) {
		// Consume object at index 0
		var json = GUI.loadedJSON.guis.splice(0, 1)[0];
	}
	
	this.__defineGetter__("json", function() {
		return json;
	});
	
	var _this = this;
	
	// For use with GUIScrubber
	this.timer = null;
	
	var MIN_WIDTH = 240;
	var MAX_WIDTH = 500;
	
	var controllers = [];
	var listening = [];
	
	var autoListen = true;
	
	var listenInterval;
	
	// Sum total of heights of controllers in this gui
	var controllerHeight;
	
	var curControllerContainerHeight = 0;
	
	var _this = this;
	
	var open = false;
	
	// Prevents checkForOverflow bug in which loaded gui appearance
	// settings are not respected by presence of scrollbar.
	var explicitOpenHeight = false;
	
	// How big we get when we open
	var openHeight;
	
	var name;
	
	var resizeTo = 0;
	var resizeTimeout;
	
	var width = 280;
	
	this.domElement = document.createElement('div');
	this.domElement.setAttribute('class', 'guidat');
	this.domElement.style.width = width+'px';

	var controllerContainer = document.createElement('div');
	controllerContainer.setAttribute('class', 'guidat-controllers');
	
	// Firefox hack to prevent horizontal scrolling
	controllerContainer.addEventListener('DOMMouseScroll', function(e) {
		
		var scrollAmount = this.scrollTop;
		
		if (e.wheelDelta) {
			scrollAmount+=e.wheelDelta; 
		} else if (e.detail) {
			scrollAmount+=e.detail;
		}
			
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;
		
		controllerContainer.scrollTop = scrollAmount;
		
	}, false);
	
	controllerContainer.style.height = '0px';

	var toggleButton = document.createElement('a');
	toggleButton.setAttribute('class', 'guidat-toggle');
	toggleButton.setAttribute('href', '#');
	toggleButton.innerHTML = "Show Controls";
	
	var toggleDragged = false;
	var dragDisplacementY = 0;
	var togglePressed = false;
	
	var my, pmy, mx, pmx;
	
	this.popout = function(e) {
		
		var w = window.open("index.html",
		 "mywindow",
		 "location=1,status=1,scrollbars=1,width=100,height=100");
		w.document.title = "gui-dat";
		console.log(w.document);

	}
	
	var resize = function(e) {
		pmy = my;
		pmx = mx;
		my = e.pageY;
		mx = e.pageX;
		
		var dmy = _this.timer ? pmy - my : my - pmy;
				
		if (!open) { 
			if (dmy < 0) {
				open = true;
				curControllerContainerHeight = openHeight = 1;
				toggleButton.innerHTML = name || "Hide Controls";
			} else {
				return;
			}
		}
		
		// TODO: Flip this if you want to resize to the right.
		var dmx = pmx - mx;
		
		if (dmy > 0 && 
			curControllerContainerHeight > controllerHeight) {
			var d = GUI.map(curControllerContainerHeight, controllerHeight, controllerHeight + 100, 1, 0);
			dmy *= d;
		}
		
		toggleDragged = true;
		dragDisplacementY += dmy;
		dragDisplacementX += dmx;
		openHeight += dmy;
		
		curControllerContainerHeight += dmy;
		controllerContainer.style.height = openHeight+'px';
		
		if (!_this.timer) {
			width += dmx;
			width = GUI.constrain(width, MIN_WIDTH, MAX_WIDTH);
			_this.domElement.style.width = width+'px';
		}
		
		checkForOverflow();
	};
	
	toggleButton.addEventListener('mousedown', function(e) {
		pmy = my = e.pageY;
		pmx = mx = e.pageX;
		togglePressed = true;
		e.preventDefault();
		dragDisplacementY = 0;
		dragDisplacementX = 0;
		document.addEventListener('mousemove', resize, false);
		return false;

	}, false);
	
	
	toggleButton.addEventListener('click', function(e) {
		e.preventDefault();
		return false;
	}, false);
	
	
	// Clears lingering slider column
	var correctWidth = function() {
		_this.domElement.style.width = (width+1)+'px';
		setTimeout(function() {
			_this.domElement.style.width = width+'px';
		}, 1);
	};
	
	document.addEventListener('mouseup', function(e) {
		
		if (togglePressed && !toggleDragged) {
			
			_this.toggle();

			if (!_this.timer) {
				correctWidth();
			}
		}
		
		if (togglePressed && toggleDragged) {
		
			if (dragDisplacementX == 0 && !_this.timer) {
			
				correctWidth();
				
			}
		
			if (openHeight > controllerHeight) {
			
				clearTimeout(resizeTimeout);
				openHeight = resizeTo = controllerHeight;
				beginResize();
				
			} else if (controllerContainer.children.length >= 1) {

				var singleControllerHeight = controllerContainer.children[0].offsetHeight;			
				clearTimeout(resizeTimeout);
				var target = Math.round(curControllerContainerHeight/singleControllerHeight)*singleControllerHeight-1;
				resizeTo = target;
				if (resizeTo <= 0) {
					_this.hide();
					openHeight = singleControllerHeight*2;
				} else { 
					openHeight = resizeTo;		
					beginResize();			
				}
			}	
			
		}
		
		document.removeEventListener('mousemove', resize, false);
		e.preventDefault();
		toggleDragged = false;
		togglePressed = false;
		
		return false;

	}, false);
	
	this.domElement.appendChild(controllerContainer);
	this.domElement.appendChild(toggleButton);

	if (GUI.autoPlace) {
		if(GUI.autoPlaceContainer == null) {
			GUI.autoPlaceContainer = document.createElement('div');
			GUI.autoPlaceContainer.setAttribute("id", "guidat");
			
			document.body.appendChild(GUI.autoPlaceContainer);
		}
		GUI.autoPlaceContainer.appendChild(this.domElement);
	}

	this.autoListenIntervalTime = 1000/60;

	var createListenInterval = function() {
		listenInterval = setInterval(function() {
			_this.listen();
		}, this.autoListenIntervalTime);
	}
	
	this.__defineSetter__("autoListen", function(v) {
		autoListen = v;
		if (!autoListen) {
			clearInterval(listenInterval);
		} else { 
			if (listening.length > 0) createListenInterval();
		}
	});
	
	this.__defineGetter__("autoListen", function(v) {
		return autoListen;
	});
	
	this.listenTo = function(controller) {
	 	// TODO: check for duplicates
	 	if (listening.length == 0) {
	 		createListenInterval();
	 	}
		listening.push(controller);
	};
	
	this.unlistenTo = function(controller) {
		// TODO: test this
		for(var i = 0; i < listening.length; i++) {
			if(listening[i] == controller) listening.splice(i, 1);
		}
		if(listening.length <= 0) {
			clearInterval(listenInterval);
		}
	};
	
	this.listen = function(whoToListenTo) {
		var arr = whoToListenTo || listening;
		for (var i in arr) {
			arr[i].updateDisplay();
		}
	};
	
	this.listenAll = function() {
		this.listen(controllers);
	}
	
	this.autoListen = true;

	var alreadyControlled = function(object, propertyName) {
		for (var i in controllers) {
			if (controllers[i].object == object &&
				controllers[i].propertyName == propertyName) {
				return true;
			}
		}
		return false;
	};


	var construct = function(constructor, args) {
		function F() {
		    return constructor.apply(this, args);
		}
		F.prototype = constructor.prototype;
		return new F();
	};
	
	// TODO: Keep this? If so, controllerContainerHeight should be aware of these, which it is not.
	this.divider = function() {
		controllerContainer.appendChild(document.createElement('hr'));
	}

	this.add = function() {
	
		var object = arguments[0];
		
		if (arguments.length == 1) {
			for (var i in object) {
				this.add(object, i);
			}
			return;
		}
		
		var propertyName = arguments[1];

		// Have we already added this?
		if (alreadyControlled(object, propertyName)) {
			GUI.error("Controller for \"" + propertyName+"\" already added.");
			return;
		}

		var value = object[propertyName];

		// Does this value exist? Is it accessible?
		if (value == undefined) {
			GUI.error(object + " either has no property \""+propertyName+"\", or the property is inaccessible.");
			return;
		}

		var type = typeof value;
		var handler = handlerTypes[type];

		// Do we know how to deal with this data type?
		if (handler == undefined) {
			GUI.error("Cannot create controller for data type \""+type+"\"");
			return;
		}
	
		var args = [this]; // Set first arg (parent) to this 
		for (var j = 0; j < arguments.length; j++) {
			args.push(arguments[j]);
		}
	
		var controllerObject = construct(handler, args);
		
		// Were we able to make the controller?
		if (!controllerObject) {
			GUI.error("Error creating controller for \""+propertyName+"\".");
			return;
		}

		// Success.
		controllerContainer.appendChild(controllerObject.domElement);
		controllers.push(controllerObject);
		GUI.allControllers.push(controllerObject);

		// Do we have a saved value for this controller?
		if (json && json.values.length > 0) {		
			var val = json.values.splice(0, 1)[0];
			if (type != "function") {
				controllerObject.setValue(val);
			}
		}
	
		// Compute sum height of controllers.
		checkForOverflow();
		
		// Prevents checkForOverflow bug in which loaded gui appearance
		// settings are not respected by presence of scrollbar.
		if (!explicitOpenHeight) {
			openHeight = controllerHeight;
		}
		
		if (this.timer != null) {
			new GUI.Scrubber(controllerObject, this.timer);
		}
		
		return controllerObject;
		
	}
	
	var checkForOverflow = function() {
		controllerHeight = 0;
		for (var i in controllers) {
			controllerHeight += controllers[i].domElement.offsetHeight;
		}
		if (controllerHeight - 1 > openHeight) {
			controllerContainer.style.overflowY = "auto";
		} else {
			controllerContainer.style.overflowY = "hidden";
		}	
	}
	
	var handlerTypes = {
		"number": GUI.NumberController,
		"string": GUI.StringController,
		"boolean": GUI.BooleanController,
		"function": GUI.FunctionController
	};
	
	var alreadyControlled = function(object, propertyName) {
		for (var i in controllers) {
			if (controllers[i].object == object &&
				controllers[i].propertyName == propertyName) {
				return true;
			}
		}
		return false;
	};
	
	var construct = function(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    };

	this.reset = function() {
		// TODO
	}

	this.getJSON = function() {
		var values = [];
		for (var i in controllers) {
			var val;
			switch (controllers[i].type) {
				case 'function':
					val = null;
					break;
				case 'number':
					val = GUI.roundToDecimal(controllers[i].getValue(), 4);
					break;
				default:
					val = controllers[i].getValue();
					break;
			}
			values.push(val);
			
		}
		var obj= {open:open, width:width, openHeight:openHeight, scroll:controllerContainer.scrollTop, values:values}
		if (this.timer) {
			obj.timer = timer.getJSON();
		}
		return obj;
	}
	
	// GUI ... GUI
	
	this.toggle = function() {
		open ? this.hide() : this.show();
	};

	this.show = function() {
		toggleButton.innerHTML = name || "Hide Controls";
		resizeTo = openHeight;
		clearTimeout(resizeTimeout);
		beginResize();
		open = true;
	}

	this.hide = function() {
		toggleButton.innerHTML = name || "Show Controls";
		resizeTo = 0;
		clearTimeout(resizeTimeout);
		beginResize();
		open = false;
	}
	
	this.name = function(n) {
		name = n;
		toggleButton.innerHTML = n;
	}
	
	var beginResize = function() {
		//console.log("Resizing from " + curControllerContainerHeight + " to " + resizeTo);
		curControllerContainerHeight += (resizeTo - curControllerContainerHeight)*0.6;
		if (Math.abs(curControllerContainerHeight-resizeTo) < 1) {
			curControllerContainerHeight = resizeTo;
		} else { 
			resizeTimeout = setTimeout(beginResize, 1000/30);
		}
		controllerContainer.style.height = Math.round(curControllerContainerHeight)+'px';
		checkForOverflow();
	}
	
	
	// Load saved appearance.
	if (json) {

		width = json.width;
		_this.domElement.style.width = width+"px";
		
		openHeight = json.openHeight;
		
		explicitOpenHeight = true;
		
		if (json.open) {
			curControllerContainerHeight = openHeight;

			// Hack.
			setTimeout(function() {
				controllerContainer.scrollTop = json.scroll;
			}, 0);
			
			resizeTo = openHeight;
			this.show();
		}		

	}
	
	// Add hide listener if this is the first GUI. 
	if (GUI.allGuis.length == 1) {
		window.addEventListener('keyup', function(e) {
			// Hide on "H"
			if (e.keyCode == 72) {
				GUI.toggleHide();
			}
		}, false);
	}

};

// Do not set this directly.
GUI.hidden = false;

GUI.toggleHide = function() {
	if (GUI.hidden) {
		GUI.show();
	} else { 
		GUI.hide();
	}
}

GUI.show = function() {
	GUI.hidden = false;
	for (var i in GUI.allGuis) {
		GUI.allGuis[i].domElement.style.display = "block";
	}
}

GUI.hide = function() {
	GUI.hidden = true;
	for (var i in GUI.allGuis) {
		GUI.allGuis[i].domElement.style.display = "none";
	}
}

GUI.autoPlace = true;
GUI.autoPlaceContainer = null;

GUI.allControllers = [];
GUI.allGuis = [];

GUI.makeUnselectable = function(elem) {
	elem.onselectstart = function() { return false; };
	elem.style.MozUserSelect = "none";
	elem.style.KhtmlUserSelect = "none";
	elem.unselectable = "on";
}
    
GUI.makeSelectable = function(elem) {
	elem.onselectstart = function() { };
	elem.style.MozUserSelect = "auto";
	elem.style.KhtmlUserSelect = "auto";
	elem.unselectable = "off";
}

GUI.map = function(v, i1, i2, o1, o2) {
	var v = o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	return v;
}

GUI.constrain = function (v, o1, o2) {
	if (v < o1) v = o1;
	else if (v > o2) v = o2;
	return v;
}

GUI.error = function(str) {
	if (typeof console.error == 'function') {
		console.error("[GUI ERROR] " + str);
	}
};

GUI.getOffset = function(obj, relativeTo) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			
			var c = obj = obj.offsetParent;
			if (relativeTo) {
				c = c && obj != relativeTo;
			}
			
		} while (c);
		return {left: curleft,top: curtop};
	}
}

GUI.roundToDecimal = function(n, decimals) {
	var t = Math.pow(10, decimals);
	return Math.round(n*t)/t;
}

GUI.extendController = function(clazz) {
	clazz.prototype = new GUI.Controller();
	clazz.prototype.constructor = clazz;
}
