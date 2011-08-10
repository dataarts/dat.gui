DAT.GUI.ControllerNumber = function() {

  this.type = "number";

  DAT.GUI.Controller.apply(this, arguments);

  var _this = this;

  // If we simply click and release a number field, we want to highlight it.
  // This variable keeps track of whether or not we've dragged
  var draggedNumberField = false;
  
  var clickedNumberField = false;
  var draggingHorizontal = false;
  var draggingVertical = false;

  var y = 0, py = 0;

  var min = arguments[3];
  var max = arguments[4];
  var step = arguments[5];

  var defaultStep = function() {
      step = (max - min) * 0.01;
  };

  this.min = function() {
    var needsSlider = false;
    if (min == undefined && max != undefined) {
      needsSlider = true;
    }
    if (arguments.length == 0) {
      return min;
    } else {
      min = arguments[0];
    }
    if (needsSlider) {
      addSlider();
      if (step == undefined) {
        defaultStep();
      }
    }
    return _this;
  };

  this.max = function() {
    var needsSlider = false;
    if (min != undefined && max == undefined) {
      needsSlider = true;
    }
    if (arguments.length == 0) {
      return max;
    } else {
      max = arguments[0];
    }
    if (needsSlider) {
      addSlider();
      if (step == undefined) { 
        defaultStep();
      }
    }
    return _this;
  };

  this.step = function() {
    if (arguments.length == 0) {
      return step;
    } else {
      step = arguments[0];
    }
    return _this;
  };

  this.getMin = function() {
    return min;
  };

  this.getMax = function() {
    return max;
  };
  
  this.getStep = function() {
    if (step == undefined) {
      if (max != undefined && min != undefined) {
        return (max-min)/100;
      } else {
        return 1;
      }
    } else {
      return step;
    }
  }

  var numberField = document.createElement('input');
  numberField.setAttribute('id', this.propertyName);
  numberField.setAttribute('type', 'text');
  numberField.setAttribute('value', this.getValue());

  if (step) numberField.setAttribute('step', step);

  this.domElement.appendChild(numberField);

  var slider;

  var addSlider = function() {
    slider = new DAT.GUI.ControllerNumberSlider(_this, min, max, step, _this.getValue());
    _this.domElement.appendChild(slider.domElement);
  };

  if (min != undefined && max != undefined) {
    addSlider();
  }

  numberField.addEventListener('blur', function() {
    var val = parseFloat(this.value);
    if (slider) {
      DAT.GUI.removeClass(_this.domElement, 'active');
    }
    if (!isNaN(val)) {
      _this.setValue(val);
    }
  }, false);


  numberField.addEventListener('mousewheel', function(e) {
    e.preventDefault();
    _this.setValue(_this.getValue() + Math.abs(e.wheelDeltaY) / e.wheelDeltaY * _this.getStep());
    return false;
  }, false);

  numberField.addEventListener('mousedown', function(e) {
    py = y = e.pageY;
    clickedNumberField = true;
    DAT.GUI.makeSelectable(numberField);
    document.addEventListener('mousemove', dragNumberField, false);
    document.addEventListener('mouseup', mouseup, false);
  }, false);

  // Handle up arrow and down arrow
  numberField.addEventListener('keydown', function(e) {
    var newVal;
    switch (e.keyCode) {
      case 13:    // enter
        newVal = parseFloat(this.value);
        _this.setValue(newVal);
        break;
      case 38:    // up
        newVal = _this.getValue() + _this.getStep();
        _this.setValue(newVal);
        break;
      case 40:    // down
        newVal = _this.getValue() - _this.getStep();
        _this.setValue(newVal);
        break;
    }
  }, false);

  var mouseup = function(e) {
    document.removeEventListener('mousemove', dragNumberField, false);
    
    DAT.GUI.makeSelectable(numberField);
    if (clickedNumberField && !draggedNumberField) {
      //numberField.focus();
      //numberField.select();
    }
    draggedNumberField = false;
    clickedNumberField = false;
    if (_this.finishChangeFunction != null) {
      _this.finishChangeFunction.call(this, _this.getValue());
    }
    draggingHorizontal = false;
    draggingVertical = false;
    document.removeEventListener('mouseup', mouseup, false);
  };

  var dragNumberField = function(e) {

    py = y;
    y = e.pageY;
    var dy = py - y;

    

    if (!draggingHorizontal && !draggingVertical) {
      if (dy == 0) {
        draggingHorizontal = true;
      } else {
        draggingVertical = true;
      }
    }

    if (draggingHorizontal) {
      return true;
    }

    DAT.GUI.addClass(_this.domElement, 'active');

    DAT.GUI.makeUnselectable(_this.parent.domElement);
    DAT.GUI.makeUnselectable(numberField);

    draggedNumberField = true;
    e.preventDefault();

    var newVal = _this.getValue() + dy * _this.getStep();
    _this.setValue(newVal);
    return false;

  };

  this.options = function() {
    _this.noSlider();
    _this.domElement.removeChild(numberField);
    return DAT.GUI.Controller.prototype.options.apply(this, arguments);
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

    return DAT.GUI.Controller.prototype.setValue.call(this, val);

  };

  this.updateDisplay = function() {
    numberField.value = DAT.GUI.roundToDecimal(_this.getValue(), 4);
    if (slider) slider.value = _this.getValue();
  };
};

DAT.GUI.extendController(DAT.GUI.ControllerNumber);
