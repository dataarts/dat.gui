var BooleanController = function() {
	this.type = "boolean";
	Controller.apply(this, arguments);

	var that = this;
	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');

	this.domElement.addEventListener('click', function(e) {
		e.preventDefault();
		input.checked = !input.checked;
		that.value = input.checked;
		that.setTargetValue(that.value);
	}, false);

	input.addEventListener('mouseup', function(e) {
		input.checked = !input.checked; // counteracts default.
	}, false);

	this.domElement.style.cursor = "pointer";
	this.propertyNameElement.style.cursor = "pointer";
	this.domElement.appendChild(input);

};
BooleanController.prototype = new Controller();
BooleanController.prototype.constructor = BooleanController;
