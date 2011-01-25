// TODO: How do we intercept the press up/down event on number fields?
// TODO: Provide alternate controllers for non-html5 browsers?
// TODO: Firefox is retarded?
var NumberController = function() {

	this.type = "number";
    
    Controller.apply(this, arguments);
    
    var _this = this;
    
    var y = py = 0;
    
    var min = arguments[2];
    var max = arguments[3];
    var step = arguments[4] || (max - min) * 0.01;
    
    var numberField = document.createElement('input');
    numberField.setAttribute('id', this.propertyName);
    numberField.setAttribute('type', this.type);
    numberField.setAttribute('value', this.getValue());
    
    if (step) numberField.setAttribute('step', step);
    
    this.domElement.appendChild(numberField);
    
    var slider;
    
    if (min && max && 
       (navigator.appVersion.indexOf("chrome") != -1 || navigator.appVersion.indexOf("Safari") != -1)) {
    
	    slider = document.createElement('input');
        slider.setAttribute('type', 'range');
        slider.setAttribute('value', this.getValue());
		slider.setAttribute('min', min);
		slider.setAttribute('max', max);
		
		numberField.setAttribute('min', min);
		numberField.setAttribute('max', max);
		
        slider.setAttribute('step', step);
		slider.addEventListener('change', function(e) {
			updateValue(this.value);
		}, false);		
        this.domElement.appendChild(slider);
    }
    
    numberField.addEventListener('blur', function(e) {
        var val = parseFloat(this.value);
        if (!isNaN(val)) {
	        updateValue(val);
        }
    }, false);
    
    numberField.addEventListener('mousewheel', function(e) {
    	e.preventDefault();
    	updateValue(_this.getValue() + Math.abs(e.wheelDeltaY)/e.wheelDeltaY*step);
    	return false;
    }, false);
    
    numberField.addEventListener('mousedown', function(e) {
        py = y = e.pageY;
        document.addEventListener('mousemove', dragNumberField, false);
    }, false);
    
    document.addEventListener('mouseup', function(e) {
        document.removeEventListener('mousemove', dragNumberField, false);
        _this.makeSelectable(GUI.domElement); 
        _this.makeSelectable(numberField);
    }, false);
    
    if(navigator.appVersion.indexOf('chrome') != -1) {
        document.addEventListener('mouseout', function(e) {
            document.removeEventListener('mousemove', dragNumberField, false);
        }, false);
    }
    
    var dragNumberField = function(e) {
		e.preventDefault();
		_this.makeUnselectable(GUI.domElement);
		_this.makeUnselectable(numberField);
		py = y;
		y = e.pageY;
		var dy = py - y;
		var newVal = _this.getValue() + dy*step;
		updateValue(newVal);
		return false;
    }
    
    var updateValue = function(val) {
    	if (min && val <= min) {
    		val = min;
    	} else if (max && val >= max) { 
    		val = max;
    	}
        _this.setValue(val);
        numberField.value = _this.getValue();
        if (slider) slider.value = _this.getValue();
    }
    
};

NumberController.prototype = new Controller();
NumberController.prototype.constructor = NumberController;