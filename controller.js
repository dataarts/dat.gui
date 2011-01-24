var Controller = function() {

    this.setName = function(n) {
  	    this.propertyNameElement.innerHTML = n;
    }
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('class', 'guidat-controller ' + this.type);

    this.object = arguments[0];
    this.propertyName = arguments[1];
    
    this.propertyNameElement = document.createElement('span');
    this.propertyNameElement.setAttribute('class', 'guidat-propertyname');
    this.setName(this.propertyName);
    this.domElement.appendChild(this.propertyNameElement);
    
    
};
	
// Only works on the last one
var NumberController = function() {

	this.type = "number";
    
    Controller.apply(this, arguments);
    
    var _this = this;
    
    this.isClicked = false;
    this.py = this.y = 0;
    this.inc = 0;   // TODO pass argument to inc
    
    // Get min and max
    (arguments[2] != null) ? this.min = arguments[2] : this.min = null;
    (arguments[3] != null) ? this.max = arguments[3] : this.max = null;
    
    this.button = document.createElement('input');
    this.button.setAttribute('id', this.propertyName);
    this.button.setAttribute('type', 'number');
    this.button.setAttribute('value', this.inc);
    this.domElement.appendChild(this.button);
    
    this.button.onmousedown = function(e) {
        _this.isClicked = true;
    };
    document.onmouseup = function(e) {
        _this.isClicked = false;
    };
    document.onmousemove = function(e) {
        
        if(_this.isClicked) {
            
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
            
            _this.button.setAttribute('value', _this.inc);
        }
    };
    
    this.__defineSetter__("position", function(val) {
        _this.inc = val;
        _this.button.setAttribute('value', _this.inc);
    });
};

NumberController.prototype = new Controller();
NumberController.prototype.constructor = NumberController;



var StringController = function() {
	this.type = "string";
    Controller.apply(this, arguments);
    // TODO
};
StringController.prototype = new Controller();
StringController.prototype.constructor = StringController;


var BooleanController = function() {
	this.type = "boolean";
    Controller.apply(this, arguments);
    // TODO
};
BooleanController.prototype = new Controller();
BooleanController.prototype.constructor = BooleanController;


var FunctionController = function() {
	this.type = "function";
    Controller.apply(this, arguments);
    // TODO
};
FunctionController.prototype = new Controller();
FunctionController.prototype.constructor = FunctionController;
