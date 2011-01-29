var GUI = function() {

	var _this = this;
	
	var controllers = [];
	var listening = [];
	
	var autoListen = true;
	var listenInterval;
	
	var _this = this, open = false,
	controllers = [], controllersWatched = [];
	
	this.domElement = document.createElement('div');
	this.domElement.setAttribute('id', 'guidat');

	controllerContainer = document.createElement('div');
	controllerContainer.setAttribute('id', 'guidat-controllers');
	
	// @doob 
	// I think this is way more elegant than the negative margin.
	// Only wish we didn't have to see the scrollbar on its way open.
	// Any thoughts?
	controllerContainer.style.height = '0px';

	toggleButton = document.createElement('a');
	toggleButton.setAttribute('id', 'guidat-toggle');
	toggleButton.setAttribute('href', '#');
	toggleButton.innerHTML = "Show Controls";
	toggleButton.addEventListener('click', function(e) {
		_this.toggle();
		e.preventDefault();
	}, false);

	this.domElement.appendChild(controllerContainer);
	this.domElement.appendChild(toggleButton);

	
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

	var error = function(str) {
		if (typeof console.log == 'function') {
			console.error("[GUI ERROR] " + str);
		}
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
			error("Controller for \"" + propertyName+"\" already added.");
			return;
		}

		var value = object[propertyName];

		// Does this value exist? Is it accessible?
		if (value == undefined) {
			error(object + " either has no property \""+propertyName+"\", or the property is inaccessible.");
			return;
		}

		var type = typeof value;
		var handler = handlerTypes[type];

		// Do we know how to deal with this data type?
		if (handler == undefined) {
			error("Cannot create controller for data type \""+type+"\"");
			return;
		}
	
		var args = [_this]; // Set first arg (parent) to this 
		for (var j = 0; j < arguments.length; j++) {
			args.push(arguments[j]);
		}
	
		var controllerObject = construct(handler, args);
		
		// Were we able to make the controller?
		if (!controllerObject) {
			error("Error creating controller for \""+propertyName+"\".");
			return;
		}

		// Success.
		controllerContainer.appendChild(controllerObject.domElement);
		controllers.push(controllerObject);

		return controllerObject;
		
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
	
	var error = function(str) {
		if (typeof console.log == 'function') {
			console.error("[GUI ERROR] " + str);
		}
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
		controllerContainer.style.height = '300px';
		toggleButton.innerHTML = "Hide Controls";
		open = true;
	}

	this.hide = function() {
		controllerContainer.style.height = '0px';
		toggleButton.innerHTML = "Show Controls";
		open = false;
	}

};

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
	if (v < o1) v = o1;
	else if (v > o2) v = o2;
	return v;
}
