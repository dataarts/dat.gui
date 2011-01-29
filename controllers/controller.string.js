var StringController = function() {

	this.type = "string";
	
	var _this = this;
    Controller.apply(this, arguments);
    
    var input = document.createElement('input');
    
    var initialValue = this.getValue();
    
    input.setAttribute('value', initialValue);
    input.setAttribute('spellcheck', 'false');
    
    this.domElement.addEventListener('mouseup', function() {
    	input.focus();
    	input.select();
    }, false);
    
    input.addEventListener('keyup', function() {
        _this.setValue(input.value);
    }, false);
    
    this.updateDisplay = function() {
    	input.value = _this.getValue();
    }
    
    this.domElement.appendChild(input);
    
};

StringController.prototype = new Controller();
StringController.prototype.constructor = StringController;
