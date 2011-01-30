var GUI = function() {

	var _this = this;
	
	var MIN_WIDTH = 200;
	var MAX_WIDTH = 500;
	
	var controllers = [];
	var listening = [];
	
	var autoListen = true;
	
	var listenInterval;
	
	
	// Sum total of heights of controllers in this gui
	var controllerHeight;
	
	var curControllerContainerHeight = 0;
	
	// How big we get when we open
	var openHeight;
	
	var _this = this, open = false;
	
	var name;
	var width = 280;
	
	var resizeTo = 0;
	var resizeTimeout;
	
	this.domElement = document.createElement('div');
	this.domElement.setAttribute('class', 'guidat');
	this.domElement.style.width = width+'px'

	var controllerContainer = document.createElement('div');
	controllerContainer.setAttribute('class', 'guidat-controllers');
	
	controllerContainer.style.height = '0px';

	var toggleButton = document.createElement('a');
	toggleButton.setAttribute('class', 'guidat-toggle');
	toggleButton.setAttribute('href', '#');
	toggleButton.innerHTML = "Show Controls";
	
	var toggleDragged = false;
	var dragDisplacementY = 0;
	var togglePressed = false;
	
	var my, pmy, mx, pmx;
	
	var resize = function(e) {
	if (!open) { 
		open = true;
		curControllerContainerHeight = openHeight = 0;
	}
		pmy = my;
		pmx = mx;
		my = e.pageY;
		mx = e.pageX;
		
		var dmy = my - pmy;
		// TODO: Flip this if you want to resize to the left.
		var dmx = pmx - mx;
		
		if (dmy > 0 && 
			curControllerContainerHeight > controllerHeight) {
			var d = GUI.map(curControllerContainerHeight, controllerHeight, controllerHeight + 100, 1, 0);
			dmy *= Math.pow(d, 1.5);

		}
		toggleDragged = true;
		dragDisplacementY += dmy;
		dragDisplacementX += dmx;
		openHeight += dmy;
		width += dmx;
		curControllerContainerHeight += dmy;
		controllerContainer.style.height = openHeight+'px';
		width = GUI.constrain(width, MIN_WIDTH, MAX_WIDTH);
		_this.domElement.style.width = width+'px';
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
	
	
	document.addEventListener('mouseup', function(e) {
		
		
		if (togglePressed && !toggleDragged) {
			
			_this.toggle();

			// Clears lingering slider column
			_this.domElement.style.width = (width+1)+'px';
			setTimeout(function() {
				_this.domElement.style.width = width+'px';
			}, 1);
		}
		
		if (togglePressed && toggleDragged) {
		
			if (dragDisplacementX == 0) {
			
				// Clears lingering slider column
				_this.domElement.style.width = (width+1)+'px';
				setTimeout(function() {
					_this.domElement.style.width = width+'px';
				}, 1);
	
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
					console.log("HIDING, wTF");
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
		// TODO 
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

	var handlerTypes = {
		"number": NumberController,
		"string": StringController,
		"boolean": BooleanController,
		"function": FunctionController
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

	this.add = function() {

		var object = arguments[0];
		var propertyName = arguments[1];

		// Have we already added this?
		if (alreadyControlled(object, propertyName)) {
		//	GUI.error("Controller for \"" + propertyName+"\" already added.");
		//	return;
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

		// Compute sum height of controllers.
		controllerHeight = 0;
		for (var i in controllers) {
			controllerHeight += controllers[i].domElement.offsetHeight;
		}

		openHeight = controllerHeight;
		
		checkForOverflow();



		return controllerObject;
		
	}
	
	var checkForOverflow = function() {
		if (controllerHeight - 1 > openHeight) {
			controllerContainer.style.overflowY = "auto";
		} else {
			controllerContainer.style.overflowY = "hidden";
		}	
	}
	
	var addHandlers = {
		"number": NumberController,
		"string": StringController,
		"boolean": BooleanController,
		"function": FunctionController
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
		
	}

};

GUI.autoPlace = true;
GUI.autoPlaceContainer = null;

// Util functions

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
	if (typeof console.log == 'function') {
		console.GUI.error("[GUI ERROR] " + str);
	}
};

