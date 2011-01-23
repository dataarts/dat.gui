var GUI = new function() {


	this.add = function() {
	
		var object = arguments[0];
		var property = arguments[1];
	
		var value = object[property];
		var type = typeof value;
		var handler = addHandlers[type];
		if (handler) {
		} else { 
			console.error("I don't know how to handle data type: " + type);
		}
		
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
	
};