var FunctionController = function() {
	this.type = "function";
	var _this = this;
    Controller.apply(this, arguments);
    var input = document.createElement('input');
    input.setAttribute('type', 'submit');
    this.domElement.addEventListener('click', function() {
    	_this.object[_this.propertyName].call(_this.object);
    }, false);
    this.domElement.style.cursor = "pointer";
    this.domElement.appendChild(input);
};
FunctionController.prototype = new Controller();
FunctionController.prototype.constructor = FunctionController;