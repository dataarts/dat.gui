GUI.Controller = function() {

    this.parent = arguments[0];
    this.object = arguments[1];
    this.propertyName = arguments[2];

    if (arguments.length > 0) this.initialValue = this.propertyName[this.object];

    this.domElement = document.createElement('div');
    this.domElement.setAttribute('class', 'guidat-controller ' + this.type);

    this.propertyNameElement = document.createElement('span');
    this.propertyNameElement.setAttribute('class', 'guidat-propertyname');
    this.name(this.propertyName);
    this.domElement.appendChild(this.propertyNameElement);

    GUI.makeUnselectable(this.domElement);

};

GUI.Controller.prototype.changeFunction = null;
GUI.Controller.prototype.finishChangeFunction = null;

GUI.Controller.prototype.name = function(n) {
    this.propertyNameElement.innerHTML = n;
    return this;
};

GUI.Controller.prototype.reset = function() {
    this.setValue(this.initialValue);
    return this;
};

GUI.Controller.prototype.listen = function() {
    this.parent.listenTo(this);
    return this;
};

GUI.Controller.prototype.unlisten = function() {
    this.parent.unlistenTo(this); // <--- hasn't been tested yet
    return this;
};

GUI.Controller.prototype.setValue = function(n) {
    this.object[this.propertyName] = n;
    if (this.changeFunction != null) {
        this.changeFunction.call(this, n);
    }
    this.updateDisplay();
    return this;
};

GUI.Controller.prototype.getValue = function() {
    return this.object[this.propertyName];
};

GUI.Controller.prototype.updateDisplay = function() {};

GUI.Controller.prototype.onChange = function(fnc) {
    this.changeFunction = fnc;
    return this;
};

GUI.Controller.prototype.onFinishChange = function(fnc) {
    this.finishChangeFunction = fnc;
    return this;
};

GUI.Controller.prototype.options = function () {
    var _this = this,
        currentValue = this.object[this.propertyName],
        select = document.createElement('select'),
        args = arguments[0],
        options = {};

    function addOption(select, label, value) {
        var opt = document.createElement('option');
        opt.innerHTML = label;
        opt.setAttribute('value', value);
        if (currentValue === value) {
            opt.setAttribute('selected', true);
        }
        select.appendChild(opt);
    }

    if (Array.isArray(args)) {
        for (var i = 0; i < args.length; i++) {
            options[args[i]] = args[i];
        }
    } else {
        options = args;
    }

    for (option in options) {
        addOption(select, option, options[option]);
    }

    select.addEventListener('change', function() {
        _this.setValue(this.value);
        if (_this.finishChangeFunction != null) {
            _this.finishChangeFunction.call(this, _this.getValue());
        }
    }, false);

    _this.domElement.appendChild(select);

    return this;
};
