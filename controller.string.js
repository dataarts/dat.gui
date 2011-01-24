var StringController = function() {
	
	this.type = "string";
	
	var _this = this;
	
    Controller.apply(this, arguments);
    
    var input = document.createElement('input');
    
    var initialValue = this.getValue();
    
    input.setAttribute('value', initialValue);
    this.domElement.addEventListener('mouseup', function() {
    	input.focus();
    	input.select();
    }, false);
    
    input.addEventListener('keyup', function() {
        _this.setValue(input.value);
    }, false);
    
    input.onblur = function(e) {
        if(_this.getValue() == '') {
            _this.setValue(initialValue);
            this.value = initialValue;
        }
    };
    
    this.domElement.appendChild(input);
};
StringController.prototype = new Controller();
StringController.prototype.constructor = StringController;