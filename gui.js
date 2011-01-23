var GUI = new function() {
	
	// Contains list of properties we've add to the GUI in the following format:
	// [object, propertyName, controllerObject]
	var registeredProperties = [];
	
	var domElement;
	var controllerContainer;
	var started = false;
	
	this.start = function() {
		
		domElement = document.createElement('div');
		domElement.setAttribute('id', 'guidat');
		
		controllerContainer = document.createElement('div');
		controllerContainer.setAttribute('id', 'guidat-controllers');
		
		toggleButton = document.createElement('a');
		toggleButton.setAttribute('id', 'guidat-toggle');
		toggleButton.innerHTML = "Show Controls";
		
		
		domElement.appendChild(controllerContainer);
		
		
		document.body.appendChild(domElement);
		
		started = true;
	}
	
	this.add = function() {
	
		// We need to call GUI.start() before .add()
		if (!started) {
			error("Make sure to call GUI.start() in the window.onload function");
			return;
		}
	
		var object = arguments[0];
		var propertyName = arguments[1];
	
		// Have we already added this?
		if (registeredPropertiesContains(object, propertyName)) {
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
		var handler = addHandlers[type];
		
		// Do we know how to deal with this data type?
		if (handler == undefined) {
			error("Cannot create controller for data type \"" + object + "\"");
			return;
		}
	
		var controllerObject = handler.apply(this, arguments);
		
		// Were we able to make the controller?
		if (!controllerObject) {		
			error("Error creating controller for \""+propertyName+"\".");	
			return;
		}
		
		// Success.
		controllerContainer.appendChild(controllerObject.domElement);
		registeredProperties.push([object, propertyName, controllerObject]);
		
	}
	
	var addHandlers = {
		
		"number": function() {
			//
		},
		
		"string": function() {
			//
		},
		
		"boolean": function() {
			//
		},
		
		"function": function() {
			//
		},
		
	};
	
	var registeredPropertiesContains = function(object, property) {
		// TODO:
		return false;
	};
	
	var error = function(str) {
		if (typeof console.log == 'function') {
			console.error("[GUI ERROR] " + str);
		}
	};
	
};
