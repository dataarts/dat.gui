var FunctionController = function() {
	this.type = "function";
	var that = this;
	Controller.apply(this, arguments);
	this.domElement.addEventListener('click', function() {
		that.object[that.propertyName].call(that.object);
	}, false);
	this.domElement.style.cursor = "pointer";
	this.propertyNameElement.style.cursor = "pointer";
};
FunctionController.prototype = new Controller();
FunctionController.prototype.constructor = FunctionController;
