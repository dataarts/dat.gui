var GUI = new function() {


	
	var addHandlers = {
		
		"number": function() {
			//
		}
		
	}
	

	this.add = function() {
	
		var object = arguments[0];
		var property = arguments[1];
	
		var value = object[property];
		var type = typeof value;
		
		if (addHandlers[type]) {
			
		} else { 
			// don't know how to handle this data type
		}
		
	}
	
};