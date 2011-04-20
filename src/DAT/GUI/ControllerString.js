DAT.GUI.ControllerString = function() {

  this.type = "string";

  var _this = this;
  DAT.GUI.Controller.apply(this, arguments);

  var input = document.createElement('input');

  var initialValue = this.getValue();

  input.setAttribute('value', initialValue);
  input.setAttribute('spellcheck', 'false');

  this.domElement.addEventListener('mouseup', function() {
    input.focus();
    input.select();
  }, false);

  // TODO: getting messed up on ctrl a
  input.addEventListener('keyup', function(e) {
    if (e.keyCode == 13 && _this.finishChangeFunction != null) {
      _this.finishChangeFunction.call(this, _this.getValue());
      input.blur();
    }
    _this.setValue(input.value);
  }, false);

  input.addEventListener('mousedown', function(e) {
    DAT.GUI.makeSelectable(input);
  }, false);

  input.addEventListener('blur', function() {
    DAT.GUI.supressHotKeys = false;
    if (_this.finishChangeFunction != null) {
      _this.finishChangeFunction.call(this, _this.getValue());
    }
  }, false);

  input.addEventListener('focus', function() {
    DAT.GUI.supressHotKeys = true;
  }, false);

  this.updateDisplay = function() {
    input.value = _this.getValue();
  };

  this.options = function() {
    _this.domElement.removeChild(input);
    return DAT.GUI.Controller.prototype.options.apply(this, arguments);
  };

  this.domElement.appendChild(input);

};

DAT.GUI.extendController(DAT.GUI.ControllerString);
