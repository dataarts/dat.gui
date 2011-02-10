GUI.StringController = function() {

    this.type = "string";

    var _this = this;
    GUI.Controller.apply(this, arguments);

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
        }
        _this.setValue(input.value);
    }, false);

    input.addEventListener('blur', function() {
        if (_this.finishChangeFunction != null) {
            _this.finishChangeFunction.call(this, _this.getValue());
        }
    }, false);

    this.updateDisplay = function() {
        input.value = _this.getValue();
    };

    this.options = function() {
        _this.domElement.removeChild(input);
        return GUI.Controller.prototype.options.apply(this, arguments);
    };

    this.domElement.appendChild(input);

};

GUI.extendController(GUI.StringController);
