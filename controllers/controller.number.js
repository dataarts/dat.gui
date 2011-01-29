// TODO: Provide alternate controllers for non-html5 browsers?
var NumberController = function() {

	this.type = "number";

	Controller.apply(this, arguments);

	var that = this;

	// If we simply click and release a number field, we want to highlight it.
	// This variable keeps track of whether or not we've dragged
	var draggedNumberField = false, clickedNumberField = false,
	y = 0, py = 0;

	var min = arguments[2], max = arguments[3], step = arguments[4];

	if (!step) {
		step = min != undefined && max != undefined ? (max-min)*0.01: 1;
	}

	var numberField = document.createElement('input');
	numberField.setAttribute('id', this.propertyName);

	this.value = this.getTargetValue();

	// Little up and down arrows are pissing me off.
	numberField.setAttribute('type', 'text');
	numberField.setAttribute('value', this.value);

	if (step) numberField.setAttribute('step', step);

	this.domElement.appendChild(numberField);

	var slider;

	if (min != undefined && max != undefined) {
		slider = new Slider(this, min, max, step, this.value);
		this.domElement.appendChild(slider.domElement);
	}

	numberField.addEventListener('blur', function(e) {
		var val = parseFloat(this.value);
		if (!isNaN(val)) {
			that.updateValue(val);
			that.setTargetValue(that.value);
		} else {
			this.value = that.value;
		}
	}, false);

	numberField.addEventListener('mousewheel', function(e) {
		e.preventDefault();
		that.updateValue(that.value + Math.abs(e.wheelDeltaY)/e.wheelDeltaY*step);
		that.setTargetValue(that.value);
		return false;
	}, false);

	numberField.addEventListener('mousedown', function(e) {
		py = y = e.pageY;
		clickedNumberField = true;
		document.addEventListener('mousemove', dragNumberField, false);
	}, false);

	document.addEventListener('mouseup', function(e) {
		document.removeEventListener('mousemove', dragNumberField, false);
		that.makeSelectable(that.parent.domElement);
		that.makeSelectable(numberField);

		if (clickedNumberField && !draggedNumberField) {
			numberField.focus();
			numberField.select();
		}

		draggedNumberField = false;
		clickedNumberField = false;
	}, false);

	// Kinda nast
	if (navigator.appVersion.indexOf('chrome') != -1) {
		document.addEventListener('mouseout', function(e) {
		    document.removeEventListener('mousemove', dragNumberField, false);
		}, false);
	}

	var dragNumberField = function(e) {
		draggedNumberField = true;
		e.preventDefault();

		// We don't want to be highlighting this field as we scroll.
		// Or any other fields in this gui for that matter ...
		// TODO: Make makeUselectable go through each element and child element.
		that.makeUnselectable(that.parent.domElement);
		that.makeUnselectable(numberField);

		py = y;
		y = e.pageY;
		var dy = py - y;
		that.updateValue(that.value + dy*step);
		that.setTargetValue(that.value);
		return false;
	}

	this.updateValue = function(val) {

		if (that.value != val) {

			val = parseFloat(val);

			if (min != undefined && val <= min) {
				val = min;
			} else if (max != undefined && val >= max) {
				val = max;
			}

			that.value = val;

			numberField.value = roundToDecimal(val, 4);

			if (slider) slider.value = val;

		}
	}

	var roundToDecimal = function(n, decimals) {
		var t = Math.pow(10, decimals);
		return Math.round(n*t)/t;
	}

};

NumberController.prototype = new Controller();
NumberController.prototype.constructor = NumberController;
