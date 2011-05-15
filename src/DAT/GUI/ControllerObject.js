DAT.GUI.ControllerObject = function( gui, object, propertyName, options ) {

  this.type = "object";
  DAT.GUI.Controller.apply(this, arguments);

  var _this = this;
  var select = document.createElement('select');

  for( var key in options ) {
    var option = document.createElement('option');
    option.value = key;
    option.innerHTML = options[key];
    select.appendChild( option );
  }

  this.setValue(this.getValue());

  this.domElement.addEventListener('change', function(e) {
    e.preventDefault();
    _this.setValue(select.value);
  }, false);

  this.domElement.style.cursor = "pointer";
  this.propertyNameElement.style.cursor = "pointer";
  this.domElement.appendChild(select);

  this.updateDisplay = function() {

  };


  this.setValue = function(val) {
    val = select.value;
    return DAT.GUI.Controller.prototype.setValue.call(this, val);
  };

};
DAT.GUI.extendController(DAT.GUI.ControllerObject);
