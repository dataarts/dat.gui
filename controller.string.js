var StringController = function() {
	
	this.type = "string";
	
	var _this = this;
	
    Controller.apply(this, arguments);
    
    var input = document.createElement('input');
    
    input.setAttribute('value', this.object[this.propertyName]);
    this.domElement.addEventListener('mouseover', function() {
    	input.focus();
    }, false);
    
    input.addEventListener('keyup', function() {
    	console.log(input.value);
    	_this.setValue(input.value);
    }, false);
    
    this.domElement.appendChild(input);
};
StringController.prototype = new Controller();
StringController.prototype.constructor = StringController;