GUI.BooleanController = function() {

	this.type = "boolean";
	GUI.Controller.apply(this, arguments);

	var _this = this;
    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    
    this.domElement.addEventListener('click', function(e) {
    //	input.checked = !input.checked;
    	e.preventDefault();
//    	_this.setValue(input.checked);
    }, false);
    
    input.addEventListener('mouseup', function(e) {
    	input.checked = !input.checked; // counteracts default.
    	
    	_this.setValue(this.checked);
    }, false);
    
    this.domElement.style.cursor = "pointer";
    this.propertyNameElement.style.cursor = "pointer";
    this.domElement.appendChild(input);
    
    this.updateDisplay = function() {
    	input.checked = _this.getValue();
    };
    
    
    this.setValue = function(val) {
		if (typeof val != "boolean") {
			try { 
				val = eval(val);
			} catch (e) {}
		}
		return GUI.Controller.prototype.setValue.call(this, val);
    }

};
GUI.extendController(GUI.BooleanController);