GUI.FunctionController = function() {
	this.type = "function";
	var that = this;
	GUI.Controller.apply(this, arguments);
	this.domElement.addEventListener('mousedown', function() {
		that.object[that.propertyName].call(that.object);
	}, false);
	this.domElement.style.cursor = "pointer";
	this.propertyNameElement.style.cursor = "pointer";
};
GUI.extendController(GUI.FunctionController);
