
// Only works on the last one
var NumberController = function() {

	this.type = "number";
    
    Controller.apply(this, arguments);
    
    var _this = this;
    
    this.isClicked = false;
    this.py = this.y = 0;
    this.inc = 0;
    
    // Get min and max
    (arguments[2] != null) ? this.min = arguments[2] : this.min = null;
    (arguments[3] != null) ? this.max = arguments[3] : this.max = null;
    
    this.button = document.createElement('input');
    this.button.setAttribute('id', this.propertyName);
    
    this.button.setAttribute('type',  this.type);
    this.button.setAttribute('value', this.inc);
    this.domElement.appendChild(this.button);
    
    this.button.onmousedown = function(e) {
        _this.isClicked = true;
    };
    this.button.onkeyup = function(e) {
        
        var val = parseFloat(_this.button.value);
        if(isNaN(val)) {
            _this.inc = 0;
        } else {
            _this.inc = val;
        }
        _this.button.value = _this.inc;
        _this.setValue(_this.inc);
    };
    document.onmouseup = function(e) {
        _this.isClicked = false;
    };
    document.onmousemove = function(e) {
        
        if(_this.isClicked) {
            
            e.preventDefault();
            
            _this.py = _this.y;
            _this.y = e.offsetY;
            var dy = _this.y - _this.py;
            
            if(dy > 0) {
                if(_this.max != null)
                    (_this.inc >= _this.max) ? _this.inc = _this.max : _this.inc++;
                else
                    _this.inc++;
            } else if(dy < 0) {
                
                if(_this.min != null)
                    (_this.inc <= _this.min) ? _this.inc = _this.min : _this.inc--;
                else
                    _this.inc--;
            }
            
            _this.button.value = _this.inc;
            _this.setValue(_this.inc);
        }
    };
    
    this.__defineSetter__("position", function(val) {
        _this.inc = val;
        _this.button.value = _this.inc;
        _this.setValue(_this.inc);
    });
};

NumberController.prototype = new Controller();
NumberController.prototype.constructor = NumberController;

