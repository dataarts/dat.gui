DAT.GUI.Controller = function() {

  this.parent = arguments[0];
  this.object = arguments[1];
  this.propertyName = arguments[2];

  //if (arguments.length > 0) this.initialValue = this.propertyName[this.object];
  if (arguments.length > 0) this.initialValue = this.object[this.propertyName];

  this.domElement = document.createElement('div');
  this.domElement.setAttribute('class', 'guidat-controller ' + this.type);

  this.propertyNameElement = document.createElement('span');
  this.propertyNameElement.setAttribute('class', 'guidat-propertyname');
  this.name(this.propertyName);
  this.domElement.appendChild(this.propertyNameElement);

  DAT.GUI.makeUnselectable(this.domElement);

};

DAT.GUI.Controller.prototype.changeFunction = null;
DAT.GUI.Controller.prototype.finishChangeFunction = null;

DAT.GUI.Controller.prototype.name = function(n) {
  this.propertyNameElement.innerHTML = n;
  return this;
};

DAT.GUI.Controller.prototype.reset = function() {
  this.setValue(this.initialValue);
  return this;
};

DAT.GUI.Controller.prototype.listen = function() {
  this.parent.listenTo(this);
  return this;
};

DAT.GUI.Controller.prototype.unlisten = function() {
  this.parent.unlistenTo(this); // <--- hasn't been tested yet
  return this;
};

DAT.GUI.Controller.prototype.setValue = function(n) {
	if(this.object[this.propertyName] != undefined){
		this.object[this.propertyName] = n;
	}else{
		var o = new Object();
		o[this.propertyName] = n;
		this.object.set(o);
	}
  if (this.changeFunction != null) {
    this.changeFunction.call(this, n);
  }
  this.updateDisplay();
  return this;
};

DAT.GUI.Controller.prototype.getValue = function() {
	var val = this.object[this.propertyName];
	if(val == undefined) val = this.object.get(this.propertyName);
  return val;
};

DAT.GUI.Controller.prototype.updateDisplay = function() {
  
};

DAT.GUI.Controller.prototype.onChange = function(fnc) {
  this.changeFunction = fnc;
  return this;
};

DAT.GUI.Controller.prototype.onFinishChange = function(fnc) {
  this.finishChangeFunction = fnc;
  return this;
};

DAT.GUI.Controller.prototype.options = function() {
  var _this = this;
  var select = document.createElement('select');
  if (arguments.length == 1) {
    var arr = arguments[0];
    for (var i in arr) {
      var opt = document.createElement('option');
      opt.innerHTML = i;
      opt.setAttribute('value', arr[i]);
      if (arguments[i] == this.getValue()) {
        opt.selected = true;
      }
      select.appendChild(opt);
    }
  } else {
    for (var i = 0; i < arguments.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = arguments[i];
      opt.setAttribute('value', arguments[i]);
      if (arguments[i] == this.getValue()) {
        opt.selected = true;
      }
      select.appendChild(opt);
    }
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
