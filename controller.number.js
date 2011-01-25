// TODO: How do we intercept the press up/down event on number fields?
// TODO: Provide alternate controllers for non-html5 browsers?
// TODO: Firefox is retarded?
var NumberController = function() {

	this.type = "number";
    
    Controller.apply(this, arguments);
    
    var _this = this;
    
    // If we simply click and release a number field, we want to highlight it.
    // This variable keeps track of whether or not we've draggedNumberField.
    var draggedNumberField = false;
    var clickedNumberField = false;
    
    var y = py = 0;
    
    var min = arguments[2];
    var max = arguments[3];
    var step = arguments[4];
    
    if (!step) {
    	if (min && max) {
    		step = (max-min)*0.01;
    	} else {
    		step = 1;
    	}	
    }
    
    var numberField = document.createElement('input');
    numberField.setAttribute('id', this.propertyName);
    
    // Little up and down arrows are pissing me off.
    numberField.setAttribute('type', 'text');
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
		clickedNumberField = true;
        document.addEventListener('mousemove', dragNumberField, false);
    }, false);
    
    document.addEventListener('mouseup', function(e) {
        document.removeEventListener('mousemove', dragNumberField, false);
        _this.makeSelectable(GUI.domElement); 
        _this.makeSelectable(numberField);
        if (clickedNumberField && !draggedNumberField) { 
	        numberField.focus();
	        numberField.select();
        }
        draggedNumberField = false;
        clickedNumberField = false;
    }, false);
    
    if(navigator.appVersion.indexOf('chrome') != -1) {
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

		val = parseFloat(val);
		
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