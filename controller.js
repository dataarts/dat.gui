var Controller = function() {

    this.setName = function(n) {
  	    this.propertyNameElement.innerHTML = n;
    }
    
    this.setValue = function(n) {
    	this.object[this.propertyName] = n;
    }
    
    this.getValue = function() {
        return this.object[this.propertyName];
    }
    
	this.makeUnselectable = function(elem) {
		elem.onselectstart = function() { return false; };
		elem.style.MozUserSelect = "none";
		elem.style.KhtmlUserSelect = "none";
		elem.unselectable = "on";
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