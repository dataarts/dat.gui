var BooleanController = function() {
	this.type = "boolean";
    Controller.apply(this, arguments);
    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    this.domElement.appendChild(input);
};
BooleanController.prototype = new Controller();
BooleanController.prototype.constructor = BooleanController;