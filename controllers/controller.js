var Controller = function() {

	var onChange = null;

	this.parent = null;

	this.name = function(n) {
	    this.propertyNameElement.innerHTML = n;
	    return this;
	}

	this.setWatched = function() {
		this.parent.watchController(this);
		return this;
	}

	this.getValue = function() {
		return this.object[this.propertyName];
	}

	this.setValue = function(n) {
		this.object[this.propertyName] = n;
		if (onChange != null) {
			onChange.call(this, n);
		}
		return this;
	}

	this.watchValue = function() {
		this.updateValue(this.object[this.propertyName]);
	}

	this.onChange = function(fnc) {
		onChange = fnc;
		return this;
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
	this.name(this.propertyName);
	this.domElement.appendChild(this.propertyNameElement);

	this.makeUnselectable(this.domElement);

};
