DAT.GUI.ControllerFunction = function() {

  this.type = "function";

  var _this = this;

  DAT.GUI.Controller.apply(this, arguments);

  this.domElement.addEventListener('click', function() {
    _this.fire();
  }, false);

  this.domElement.style.cursor = "pointer";
  this.propertyNameElement.style.cursor = "pointer";

  var fireFunction = null;
  this.onFire = function(fnc) {
    fireFunction = fnc;
    return this;
  }

  this.fire = function() {
    if (fireFunction != null) {
      fireFunction.call(this);
    }
    _this.object[_this.propertyName].call(_this.object);
  };

};
DAT.GUI.extendController(DAT.GUI.ControllerFunction);
