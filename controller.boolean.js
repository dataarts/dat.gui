var BooleanController = function() {
	this.type = "boolean";
    Controller.apply(this, arguments);

	var _this = this;
    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    
    this.domElement.addEventListener('click', function(e) {
    	input.checked = !input.checked;
    	e.preventDefault();
    	_this.setValue(input.checked);
    }, false);
    
    input.addEventListener('mouseup', function(e) {
    	input.checked = !input.checked;
    }, false);
    
    this.domElement.style.cursor = 'pointer';
    this.domElement.appendChild(input);

};
BooleanController.prototype = new Controller();
BooleanController.prototype.constructor = BooleanController;