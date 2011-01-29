var GUI = function () {

	var _this = this, open = false,
	controllers = [], controllersWatched = [];

	this.domElement = document.createElement('div');
	this.domElement.setAttribute('id', 'guidat');

	controllerContainer = document.createElement('div');
	controllerContainer.setAttribute('id', 'guidat-controllers');
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

		var controllerObject = construct( handler, arguments);
		controllerObject.parent = _this;

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

	this.toggle = function() {

		if (open) {
			this.hide();
		} else {
			this.show();
		}

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
