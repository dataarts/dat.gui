
// Only works on the last one
var NumberController = function() {

	this.type = "number";
    
    Controller.apply(this, arguments);
    
    var _this = this;
    
    var isClicked = false;
    var y, py, initialValue, inc;
    
    py = y = 0;
    inc = initialValue = this.object[this.propertyName];
    
    var min, max;
    (arguments[2] != null) ? min = arguments[2] : min = null;
    (arguments[3] != null) ? max = arguments[3] : max = null;
    
    var amt;
    (arguments[4] != null) ? amt = arguments[4] : amt = (max - min) * .01;
    if(amt == 0) amt = 1;
    
    var button = document.createElement('input');
    button.setAttribute('id', this.propertyName);
    button.setAttribute('type', this.type);
    button.setAttribute('value', inc)
    this.domElement.appendChild(button);
    
    button.addEventListener('mousedown', function(e) {
        isClicked = true;
    }, false);
    button.addEventListener('keyup', function(e) {
        var val = parseFloat(this.value);
        if(isNaN(val)) {
            inc = initialValue;
        } else {
            inc = val;
        }
        this.value = inc;
        _this.setValue(inc);
    }, false);
    document.addEventListener('mouseup', function(e) {
        isClicked = false;
    }, false);
    document.addEventListener('mousemove', function(e) {
        if(isClicked) {
            e.preventDefault();
            py = y;
            y  = e.offsetY;
            var dy = y - py;
            if(dy < 0) {
                if(max != null)
                    (inc >= max) ? inc = max : inc+=amt;
                else
                    inc++;
            } else if(dy > 0) {
            
                if(min != null)
                    (inc <= min) ? inc = min : inc-=amt;
                else
                    inc--;
            }
            button.value = inc;
            _this.setValue(inc);
        }
    }, false);
    
    this.__defineSetter__("position", function(val) {
        inc = val;
        button.value = inc;
        _this.setValue(inc);
        // possibly push to an array here so that
        // we have a record of "defined" / "presets"
        // ????
    });
};

NumberController.prototype = new Controller();
NumberController.prototype.constructor = NumberController;

