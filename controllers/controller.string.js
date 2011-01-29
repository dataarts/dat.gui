var StringController = function() {

	this.type = "string";

	var that = this;

	Controller.apply(this, arguments);

	this.value = this.getTargetValue();

	var input = document.createElement('input');
	input.setAttribute('value', this.value);
	input.setAttribute('spellcheck', 'false');

	this.domElement.addEventListener('mouseup', function() {
		input.focus();
		input.select();
	}, false);

	input.addEventListener('keyup', function() {
		that.updateValue(input.value);
		that.setTargetValue(that.value);
	}, false);

	this.domElement.appendChild(input);

	this.updateValue = function(val) {
		that.value = val;
		input.setAttribute('value', that.value);
	}

};
StringController.prototype = new Controller();
StringController.prototype.constructor = StringController;
