// Standalone GUI element
DAT.GUI.Slider = function(object, property, min, max, step) {

  var clicked = false;
  var _this = this;

  var x, px;

  this.domElement = document.createElement('div');
  this.domElement.setAttribute('class', 'guidat-slider-bg');

  this.fg = document.createElement('div');
  this.fg.setAttribute('class', 'guidat-slider-fg');

  this.domElement.appendChild(this.fg);

  var onDrag = function(e) {
    if (!clicked) return;
    var pos = findPos(_this.domElement);
    var val = map(e.pageX, pos[0], pos[0] + _this.domElement
        .offsetWidth, getMin(), getMax());
    val = Math.round(val / getStep()) * getStep();
    setValue(val);
  };

  this.domElement.addEventListener('mousedown', function(e) {
    clicked = true;
    x = px = e.pageX;
    onDrag(e);
    document.addEventListener('mouseup', mouseup, false);
  }, false);

  var mouseup = function(e) {
    clicked = false;
    document.removeEventListener('mouseup', mouseup, false);
  };

  var findPos = function(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while ((obj = obj.offsetParent));
      return [curleft,curtop];
    }
  };

  // Overridden methods
  var map = function(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  };

  var getMin = function() {
    return min;
  };

  var getMax = function() {
    return max;
  };

  var getStep = function() {
    return step;
  };

  var setValue = function(val) {

    val = parseFloat(val);

    if (min != undefined && val <= min) {
      val = min;
    } else if (max != undefined && val >= max) {
      val = max;
    }

    object[propertyName] = val;
    _this.value = getValue();
  };

  var getValue = function() {
    return object[propertyName];
  };
  
  // Public methods
  this.min = function(n) {
    min = n;
  };
  this.max = function(n) {
    max = n;
  };
  this.step = function(n) }{
    step = n;
  };

  this.__defineSetter__('value', function(e) {
    this.fg.style.width = DAT.GUI.map(e, getMin(),
        getMax(), 0, 100) + "%";
  });

  document.addEventListener('mousemove', onDrag, false);

  this.value = getValue();

};
