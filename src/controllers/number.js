GUI.NumberController = function() {

    this.type = "number";

    GUI.Controller.apply(this, arguments);

    var _this = this;

    // If we simply click and release a number field, we want to highlight it.
    // This variable keeps track of whether or not we've dragged
    var draggedNumberField = false;

    var clickedNumberField = false;

    var y = 0, py = 0;

    var min = arguments[3];
    var max = arguments[4];
    var step = arguments[5];

    if (!step) {
        if (min != undefined && max != undefined) {
            step = (max-min)*0.01;
        } else {
            step = 1;
        }
    }

    var numberField = document.createElement('input');
    numberField.setAttribute('id', this.propertyName);
    numberField.setAttribute('type', 'text');
    numberField.setAttribute('value', this.getValue());

    if (step) numberField.setAttribute('step', step);

    this.domElement.appendChild(numberField);

    var slider;

    if (min != undefined && max != undefined) {
        slider = new GUI.Slider(this, min, max, step, this.getValue());
        this.domElement.appendChild(slider.domElement);
    }

    numberField.addEventListener('blur', function(e) {
        var val = parseFloat(this.value);
        if (!isNaN(val)) {
            _this.setValue(val);
        }
    }, false);

    numberField.addEventListener('mousewheel', function(e) {
        e.preventDefault();
        _this.setValue(_this.getValue() + Math.abs(e.wheelDeltaY)/e.wheelDeltaY*step);
        return false;
    }, false);

    numberField.addEventListener('mousedown', function(e) {
        py = y = e.pageY;
        clickedNumberField = true;
        document.addEventListener('mousemove', dragNumberField, false);
        document.addEventListener('mouseup', mouseup, false);
    }, false);

    // Handle up arrow and down arrow
    numberField.addEventListener('keydown', function(e) {
        var newVal;
        switch(e.keyCode) {
            case 13:    // enter
                newVal = parseFloat(this.value);
                _this.setValue(newVal);
                break;
            case 38:    // up
                newVal = _this.getValue() + step;
                _this.setValue(newVal);
                break;
            case 40:    // down
                newVal = _this.getValue() - step;
                _this.setValue(newVal);
                break;
        }
    }, false);

    var mouseup = function(e) {
        document.removeEventListener('mousemove', dragNumberField, false);
        GUI.makeSelectable(_this.parent.domElement);
        GUI.makeSelectable(numberField);
        if (clickedNumberField && !draggedNumberField) {
            numberField.focus();
            numberField.select();
        }
        if(slider) slider.domElement.className = slider.domElement.className.replace(' active', '');
        draggedNumberField = false;
        clickedNumberField = false;
        if (_this.finishChangeFunction != null) {
            _this.finishChangeFunction.call(this, _this.getValue());
        }
        document.removeEventListener('mouseup', mouseup, false);
    };

    var dragNumberField = function(e) {

        draggedNumberField = true;
        e.preventDefault();

        // We don't want to be highlighting this field as we scroll.
        // Or any other fields in this gui for that matter ...
        // TODO: Make makeUselectable go through each element and child element.

        GUI.makeUnselectable(_this.parent.domElement);
        GUI.makeUnselectable(numberField);
        
        if(slider) slider.domElement.className += ' active';
        
        py = y;
        y = e.pageY;
        var dy = py - y;
        var newVal = _this.getValue() + dy*step;
        _this.setValue(newVal);
        return false;
    };

    this.options = function() {
        _this.noSlider();
        _this.domElement.removeChild(numberField);
        return GUI.Controller.prototype.options.apply(this, arguments);
    };

    this.noSlider = function() {
        if (slider) {
            _this.domElement.removeChild(slider.domElement);
        }
        return this;
    };

    this.setValue = function(val) {

        val = parseFloat(val);

        if (min != undefined && val <= min) {
            val = min;
        } else if (max != undefined && val >= max) {
            val = max;
        }

        return GUI.Controller.prototype.setValue.call(this, val);

    };

    this.updateDisplay = function() {
        numberField.value = GUI.roundToDecimal(_this.getValue(), 4);
        if (slider) slider.value = _this.getValue();
    };
};

GUI.extendController(GUI.NumberController);
