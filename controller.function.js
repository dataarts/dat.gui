var FunctionController = function() {
	this.type = "function";
    Controller.apply(this, arguments);
    var input = document.createElement('input');
    input.setAttribute('type', 'submit');
    this.domElement.appendChild(input);
};
FunctionController.prototype = new Controller();
FunctionController.prototype.constructor = FunctionController;