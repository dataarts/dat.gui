var Controller = function() {

	this.parent = arguments[0];
    this.object = arguments[1];
    this.propertyName = arguments[2];

    this.domElement = document.createElement('div');
    this.domElement.setAttribute('class', 'guidat-controller ' + this.type);
    
    this.propertyNameElement = document.createElement('span');
    this.propertyNameElement.setAttribute('class', 'guidat-propertyname');
    this.name(this.propertyName);
    this.domElement.appendChild(this.propertyNameElement);
    
    GUI.makeUnselectable(this.domElement);
    
};

Controller.prototype.changeFunction = null;

Controller.prototype.name = function(n) {
	this.propertyNameElement.innerHTML = n;
	return this;
};

Controller.prototype.listen = function() {
	this.parent.listenTo(this);
}

Controller.prototype.unlisten = function() {
	this.parent.unlistenTo(this); // <--- hasn't been implemented yet
}
    
Controller.prototype.setValue = function(n) {
	this.object[this.propertyName] = n;
	if (this.changeFunction != null) {
		this.changeFunction.call(this, n);
	}
	// Whenever you call setValue, the display will be updated automatically.
	// This reduces some clutter in subclasses. We can also use this method for listen().
	this.updateDisplay();
	return this;
}
    
Controller.prototype.getValue = function() {
	return this.object[this.propertyName];
}

Controller.prototype.updateDisplay = function() {}
    
Controller.prototype.onChange = function(fnc) {
	this.changeFunction = fnc;
	return this;
}
