var StringController = function() {
	this.type = "string";
    Controller.apply(this, arguments);
    var input = document.createElement('input');
    input.setAttribute('value', this.object[this.propertyName]);
    this.domElement.appendChild(input);
};
StringController.prototype = new Controller();
StringController.prototype.constructor = StringController;