// This version of gui.js appends the style definitions via javascript.
var GUI = new function() {

	var _this = this;
	
	var controllers = [];
	
	var style = '#guidat{color:#fff;position:fixed;width:280px;z-index:200;opacity:.97;top:0;left:100%;margin-left:-300px;background-color:#fff;-moz-transition:margin-top .2s ease-out;-webkit-transition:margin-top .2s ease-out;transition:margin-top .2s ease-out;-webkit-box-shadow:0 0 10px rgba(0,0,0,0.3);-moz-box-shadow:0 0 10px rgba(0,0,0,0.3);box-shadow:0 0 10px rgba(0,0,0,0.3)}#guidat,#guidat input{font:9.5px Lucida Grande,sans-serif}#guidat-controllers{height:300px;overflow-y:auto;overflow-x:hidden;background-color:rgba(0,0,0,0.1)}#guidat-toggle{text-decoration:none;cursor:pointer;color:#fff;background-color:#222;text-align:center;display:block;padding:5px}#guidat-toggle:hover{background-color:#000}.guidat-controller{padding:3px;height:25px;clear:left;border-bottom:1px solid #222;background-color:#111}.guidat-controller,.guidat-controller input,.guidat-slider-bg,.guidat-slider-fg{-moz-transition:background-color .15s linear;-webkit-transition:background-color .15s linear;transition:background-color .15s linear}.guidat-controller.boolean:hover,.guidat-controller.function:hover{background-color:#000}.guidat-controller input{float:right;outline:none;border:0;padding:4px;margin-top:2px;background-color:#222}.guidat-controller input:hover{background-color:#444}.guidat-controller input:focus{background-color:#555}.guidat-controller.number{border-left:5px solid #00aeff}.guidat-controller.string{border-left:5px solid #1ed36f}.guidat-controller.string input{border:0;color:#1ed36f;margin-right:2px;width:148px}.guidat-controller.boolean{border-left:5px solid #54396e}.guidat-controller.function{border-left:5px solid #e61d5f}.guidat-controller.number input[type=text]{width:35px;margin-left:5px;margin-right:2px;color:#00aeff}#guidat .guidat-controller.boolean input{margin-top:6px;margin-right:2px;font-size:20px}.guidat-controller:last-child{border-bottom:none;-webkit-box-shadow:0 1px 3px rgba(0,0,0,0.5);-moz-box-shadow:0 1px 3px rgba(0,0,0,0.5);box-shadow:0 1px 3px rgba(0,0,0,0.5)}.guidat-propertyname{padding:5px;padding-top:7px;cursor:default;display:inline-block}.guidat-slider-bg:hover,.guidat-slider-bg.active{background-color:#444}.guidat-slider-bg:hover .guidat-slider-fg,.guidat-slider-bg.active .guidat-slider-fg{background-color:#52c8ff}.guidat-slider-bg{background-color:#222;cursor:ew-resize;width:40%;margin-top:2px;float:right;height:21px}.guidat-slider-fg{background-color:#00aeff;height:20px}'


	this.add = function() {
	
		// We need to call GUI.start() before .add()
		if (!started) {
			error("Make sure to call GUI.start() in the window.onload function");
			return;
		}
	
		var object = arguments[0];
		var propertyName = arguments[1];
	
		// Have we already added this?
		if (alreadyControlled(object, propertyName)) {
			error("Controller for \"" + propertyName+"\" already added.");
			return;
		}
	
		var value = object[propertyName];
		
		// Does this value exist? Is it accessible?
		if (value == undefined) {
			error(object + " either has no property \""+propertyName+"\", or the property is inaccessible.");
			return;
		}
		
		var type = typeof value;
		var handler = addHandlers[type];
		
		// Do we know how to deal with this data type?
		if (handler == undefined) {
			error("Cannot create controller for data type \""+type+"\"");
			return;
		}
	
		var controllerObject = handler.apply(this, arguments);
		
		// Were we able to make the controller?
		if (!controllerObject) {		
			error("Error creating controller for \""+propertyName+"\".");	
			return;
		}
		
		// Success.
		controllerContainer.appendChild(controllerObject.domElement);
		controllers.push(controllerObject);
		
		return controllerObject;
		
	}
	
	var addHandlers = {
		
		"number": function() {
            return construct(NumberController, arguments);
		},
		
		"string": function() {
            return construct(StringController, arguments);
		},
		
		"boolean": function() {
			return construct(BooleanController, arguments);
		},
		
		"function": function() {
			return construct(FunctionController, arguments);
		},
		
	};
	
	var alreadyControlled = function(object, propertyName) {
		for (var i in controllers) {
			if (controllers[i].object == object &&
				controllers[i].propertyName == propertyName) {
				return true;
			}
		}
		return false;
	};
	
	var error = function(str) {
		if (typeof console.log == 'function') {
			console.error("[GUI ERROR] " + str);
		}
	};
	
	var construct = function(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    };



	// GUI ... GUI
	
	this.domElement = null;
	var controllerContainer;
	var started = false;
	var open = false;
	
	// TODO: obtain this dynamically?
	var domElementMarginTop = 300;
	
	this.start = function() {
	
		var styleSheet = document.createElement('style');
		styleSheet.setAttribute('type', 'text/css');
		styleSheet.innerHTML = style;
		document.getElementsByTagName('head')[0].appendChild(styleSheet);
		
		
		this.domElement = document.createElement('div');
		this.domElement.setAttribute('id', 'guidat');
		
		controllerContainer = document.createElement('div');
		controllerContainer.setAttribute('id', 'guidat-controllers');
		
		toggleButton = document.createElement('a');
		toggleButton.setAttribute('id', 'guidat-toggle');
		toggleButton.setAttribute('href', '#');
		toggleButton.innerHTML = "Show Controls";
		toggleButton.addEventListener('click', function(e) {
			_this.toggle();
			e.preventDefault();
		}, false);
		
		this.domElement.appendChild(controllerContainer);
		this.domElement.appendChild(toggleButton);
		
		this.domElement.style.marginTop = -domElementMarginTop+"px";
		
		document.body.appendChild(this.domElement);
		
		started = true;
		
	};
	
	this.toggle = function() {
		
		if (open) {
			this.hide();
		} else { 
			this.show();
		}
		
	};
	
	this.show = function() {
		this.domElement.style.marginTop = 0+"px";
		toggleButton.innerHTML = "Hide Controls";
		open = true;
	}
	
	this.hide = function() {
		this.domElement.style.marginTop = -domElementMarginTop+"px";
		toggleButton.innerHTML = "Show Controls";
		open = false;
	}
	
};
// TODO: Leaving the window while dragging the slider and then removing the mouse
// still leaves slider in focus.
// TODO: Problem with multiple sliders.
var Slider = function(numberController, min, max, step, initValue) {
	
	var min = min;
	var max = max;
	var step = step;
	
	var clicked = false;
	var _this = this;
	
	var x, px;
	
	this.domElement = document.createElement('div');
	this.fg = document.createElement('div');
	this.domElement.setAttribute('class', 'guidat-slider-bg');
	this.fg.setAttribute('class', 'guidat-slider-fg');
	
	this.domElement.appendChild(this.fg);
	
	var map = function(v, i1, i2, o1, o2) {
		var v = o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
		if (v < o1) v = o1;
		else if (v > o2) v = o2;
		return v;
	}
	
	var findPos = function(obj) {
		var curleft = curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
			return [curleft,curtop];
		}
	}
	
	this.__defineSetter__('value', function(e) {
		
		var pct = map(e, min, max, 0, 100);
		this.fg.style.width = pct+"%";
		
	});

	var onDrag = function(e) {
		if (!clicked) return;
		var pos = findPos(_this.domElement);
		var val = map(e.pageX, pos[0], pos[0] + _this.domElement.offsetWidth, min, max);
		val = Math.round(val/step)*step;
		numberController.updateValue(val);
	}
	
	this.domElement.addEventListener('mousedown', function(e) {
		clicked = true;
		x = px = e.pageX;
		_this.domElement.setAttribute('class', 'guidat-slider-bg active');
		_this.fg.setAttribute('class', 'guidat-slider-fg active');
		onDrag(e);
	}, false);
	
	
	document.addEventListener('mouseup', function(e) {
		_this.domElement.setAttribute('class', 'guidat-slider-bg');
		_this.fg.setAttribute('class', 'guidat-slider-fg');
		clicked = false;
	}, false);
	
	document.addEventListener('mousemove', onDrag, false);


	
	
	this.value = initValue;	
		
}
var Controller = function() {

	var onChange = null;

    this.setName = function(n) {
  	    this.propertyNameElement.innerHTML = n;
    }
    
    this.setValue = function(n) {
    	this.object[this.propertyName] = n;
      	if (onChange != null) {
      		onChange.call(this, n);
      	}
    }
    
    this.getValue = function() {
        return this.object[this.propertyName];
    }
    
    this.onChange = function(fnc) {
    	onChange = fnc;
    }
    
	this.makeUnselectable = function(elem) {
		elem.onselectstart = function() { return false; };
		elem.style.MozUserSelect = "none";
		elem.style.KhtmlUserSelect = "none";
		elem.unselectable = "on";
	}
    
	this.makeSelectable = function(elem) {
		elem.onselectstart = function() { };
		elem.style.MozUserSelect = "auto";
		elem.style.KhtmlUserSelect = "auto";
		elem.unselectable = "off";
	}
    
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('class', 'guidat-controller ' + this.type);

    this.object = arguments[0];
    this.propertyName = arguments[1];
    
    this.propertyNameElement = document.createElement('span');
    this.propertyNameElement.setAttribute('class', 'guidat-propertyname');
    this.setName(this.propertyName);
    this.domElement.appendChild(this.propertyNameElement);
    
    this.makeUnselectable(this.domElement);
    
};
var BooleanController = function() {
	this.type = "boolean";
    Controller.apply(this, arguments);

	var _this = this;
    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    
    this.domElement.addEventListener('click', function(e) {
    	input.checked = !input.checked;
    	e.preventDefault();
    	_this.setValue(input.checked);
    }, false);
    
    input.addEventListener('mouseup', function(e) {
    	input.checked = !input.checked; // counteracts default.
    }, false);
    
    this.domElement.style.cursor = "pointer";
    this.propertyNameElement.style.cursor = "pointer";
    this.domElement.appendChild(input);

};
BooleanController.prototype = new Controller();
BooleanController.prototype.constructor = BooleanController;
var FunctionController = function() {
	this.type = "function";
	var _this = this;
    Controller.apply(this, arguments);
    this.domElement.addEventListener('click', function() {
    	_this.object[_this.propertyName].call(_this.object);
    }, false);
    this.domElement.style.cursor = "pointer";
    this.propertyNameElement.style.cursor = "pointer";
};
FunctionController.prototype = new Controller();
FunctionController.prototype.constructor = FunctionController;
// TODO: Provide alternate controllers for non-html5 browsers?
var NumberController = function() {

	this.type = "number";
    
    Controller.apply(this, arguments);
    
    var _this = this;
    
    // If we simply click and release a number field, we want to highlight it.
    // This variable keeps track of whether or not we've dragged
    var draggedNumberField = false;
    
    var clickedNumberField = false;
    
    var y = py = 0;
    
    var min = arguments[2];
    var max = arguments[3];
    var step = arguments[4];
    
    if (!step) {
    	if (min && max) {
    		step = (max-min)*0.01;
    	} else {
    		step = 1;
    	}	
    }
    
    var numberField = document.createElement('input');
    numberField.setAttribute('id', this.propertyName);
    
    // Little up and down arrows are pissing me off.
    numberField.setAttribute('type', 'text');
    numberField.setAttribute('value', this.getValue());
    
    if (step) numberField.setAttribute('step', step);
    
    this.domElement.appendChild(numberField);
    
    var slider;
    
    if (min != undefined && max != undefined) {
    	slider = new Slider(this, min, max, step, this.getValue());
    	this.domElement.appendChild(slider.domElement);
    }
    
    numberField.addEventListener('blur', function(e) {
        var val = parseFloat(this.value);
        if (!isNaN(val)) {
	        _this.updateValue(val);
        } else { 
        	this.value = _this.getValue();
        }
    }, false);
    
    numberField.addEventListener('mousewheel', function(e) {
    	e.preventDefault();
    	this.updateValue(_this.getValue() + Math.abs(e.wheelDeltaY)/e.wheelDeltaY*step);
    	return false;
    }, false);
    
    numberField.addEventListener('mousedown', function(e) {
        py = y = e.pageY;
		clickedNumberField = true;
        document.addEventListener('mousemove', dragNumberField, false);
    }, false);
    
    document.addEventListener('mouseup', function(e) {
        document.removeEventListener('mousemove', dragNumberField, false);
        _this.makeSelectable(GUI.domElement); 
        _this.makeSelectable(numberField);
        if (clickedNumberField && !draggedNumberField) { 
	        numberField.focus();
	        numberField.select();
        }
        draggedNumberField = false;
        clickedNumberField = false;
    }, false);
    
    // Kinda nast
    if (navigator.appVersion.indexOf('chrome') != -1) {
        document.addEventListener('mouseout', function(e) {
            document.removeEventListener('mousemove', dragNumberField, false);
        }, false);
    }
    
    var dragNumberField = function(e) {
    	draggedNumberField = true;
		e.preventDefault();
		
		// We don't want to be highlighting this field as we scroll.
		// Or any other fields in this gui for that matter ... 
		// TODO: Make makeUselectable go through each element and child element.
		_this.makeUnselectable(GUI.domElement);
		_this.makeUnselectable(numberField);
		
		py = y;
		y = e.pageY;
		var dy = py - y;
		var newVal = _this.getValue() + dy*step;	
		_this.updateValue(newVal);
		return false;
    }
    
    this.updateValue = function(val) {

		val = parseFloat(val);
		
    	if (min != undefined && val <= min) {
    		val = min;
    	} else if (max != undefined && val >= max) { 
    		val = max;
    	}
        _this.setValue(val);
        
        numberField.value = _this.getValue();
        if (slider) slider.value = _this.getValue();
    }
    
};

NumberController.prototype = new Controller();
NumberController.prototype.constructor = NumberController;
var StringController = function() {
	
	this.type = "string";
	
	var _this = this;
	
    Controller.apply(this, arguments);
    
    var input = document.createElement('input');
    
    var initialValue = this.getValue();
    
    input.setAttribute('value', initialValue);
    input.setAttribute('spellcheck', 'false');
    this.domElement.addEventListener('mouseup', function() {
    	input.focus();
    	input.select();
    }, false);
    
    input.addEventListener('keyup', function() {
        _this.setValue(input.value);
    }, false);
    
    this.domElement.appendChild(input);
};
StringController.prototype = new Controller();
StringController.prototype.constructor = StringController;