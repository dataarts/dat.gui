var GUI = new function() {

	
	// Contains list of properties we've add to the GUI in the following format:
	// [object, propertyName, controllerDomElement]
	var registeredProperties = [];
	
	var domElement;
	var started = false;
	this.start = function() {
		
		domElement = document.createElement('div');
		domElement.setAttribute('id', 'guidat');
		
		
		started = true;
	}
	
	this.add = function() {
	
		if (!started) {
			error("Make sure to call GUI.start() in the window.onload function");
			return;
		}
	
		var object = arguments[0];
		var propertyName = arguments[1];
	
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
	
		var controllerDomElement = handler.apply(this, arguments);
		
		// Were we able to make the controller?
		if (!controllerDomElement) {		
			error("Error creating controller for \""+propertyName+"\".");	
			return;
		}
		
		// Success.
		registeredProperties.push([object, propertyName, controllerDomElement]);			
		
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
	
	var error = function(str) {
		console.error("[GUI ERROR] " + str);
	}
	
};