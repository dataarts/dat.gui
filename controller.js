var Controller = function() {
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('class', 'guidat-controller');
    
    this.object = arguments[0];
    this.propertyName = arguments[1];
};

var NumberController = function() {
    
    Controller.apply(this, arguments);
    
    var _this = this;
    
    this.isClicked = false;
    this.py = this.y = 0;
    // TODO pass argument to inc
    this.inc = 0;
    this.button;
    
    this.button = document.createElement('input');
    this.button.setAttribute('id', this.propertyName);
    this.button.setAttribute('type', 'number');
    this.button.setAttribute('value', this.y);
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
            
            if(dy > 0)
                _this.button.setAttribute('value', _this.inc++);
            else
                _this.button.setAttribute('value', _this.inc--);
        }
    };
};

NumberController.prototype = new Controller();
NumberController.prototype.constructor = NumberController;