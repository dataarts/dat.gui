var StringController = function() {
	
	this.type = "string";
	
	var _this = this;
	
    Controller.apply(this, arguments);
    
    var input = document.createElement('input');
    
    input.setAttribute('value', this.object[this.propertyName]);
    this.domElement.addEventListener('mouseup', function() {
    	input.focus();
    	input.select();
    }, false);
    
    input.addEventListener('keyup', function() {
    	console.log(input.value);
    	_this.setValue(input.value);
    }, false);
    
    this.domElement.appendChild(input);
    
    input.onfocus = function(e) {
        if(_this.contents == _this.object[_this.propertyName]) {
            contents = "";
            _this.input.setAttribute('value', contents);
        }
    };
    input.onblur = function(e) {
    };
};
StringController.prototype = new Controller();
StringController.prototype.constructor = StringController;