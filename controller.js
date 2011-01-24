var Controller = function() {
    this.domElement;
    
    this.object = arguments[0];
    this.propertyName = arguments[1];
};

var NumberController = function() {
    
    Controller.apply(this, arguments);
    this.isClicked = false;

    this.py = this.y = 0;
    // TODO pass argument to inc
    this.inc = 0;
    this.button;
    
    this.button = document.createElement('input');
    this.button.setAttribute('id', this.propertyName);
    this.button.setAttribute('type', 'number');
    this.button.setAttribute('value', this.y);
    
    // return this.button;
    
    this.addListeners = function() {
        
        this.onmousedown = function(e) {
            this.isClicked = true;
        };
        document.onmouseup = function(e) {
            this.isClicked = false;
        };
        document.onmousemove = function(e) {
            if(this.isClicked) {
                this.py = this.y;
                var dy = this.y - this.py;
                if(dy > 0)
                    this.button.setAttribute('value', this.inc++);
                else
                    this.button.setAttribute('value', this.inc--);
                this.y = e.offsetY;
            }
        };
    };
    
    this.__defineGetter__("button", function(){
        return this.button;
    });
};

NumberController.prototype = new Controller();
NumberController.prototype.constructor = NumberController;