GUI.StringController = function() {

	this.type = "string";
	
	var _this = this;
    GUI.Controller.apply(this, arguments);
    
    var input = document.createElement('input');
    
    var initialValue = this.getValue();
    
    input.setAttribute('value', initialValue);
    input.setAttribute('spellcheck', 'false');
    
    this.domElement.addEventListener('mouseup', function() {
    	//input.focus();
    	//input.select();
    }, false);
    
    // TODO: getting messed up on ctrl a
    input.addEventListener('keyup', function() {
        _this.setValue(input.value);
    }, false);
    
    input.addEventListener('focus', function() {
    	GUI.disableKeyListeners = true;
    }, false);
    
    input.addEventListener('blur', function() {
    	GUI.disableKeyListeners = false;
    }, false);
    
    this.updateDisplay = function() {
    	input.value = _this.getValue();
    }
    
    this.domElement.appendChild(input);
    
};

GUI.extendController(GUI.StringController);