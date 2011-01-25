var FunctionController = function() {
	this.type = "function";
	var _this = this;
    Controller.apply(this, arguments);
    this.domElement.addEventListener('click', function() {
    	_this.object[_this.propertyName].call(_this.object);
    }, false);
    this.domElement.style.cursor = "pointer";
    this.propertyNameElement.style.cursor = "pointer";
};
FunctionController.prototype = new Controller();
FunctionController.prototype.constructor = FunctionController;