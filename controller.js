var Controller = function() {

    this.name = function(n) {
  	    this.propertyNameElement.innerHTML = n;
    }
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('class', 'guidat-controller ' + this.type);

    this.object = arguments[0];
    this.propertyName = arguments[1];
    
    this.propertyNameElement = document.createElement('span');
    this.propertyNameElement.setAttribute('class', 'guidat-propertyname');
    this.name(this.propertyName);
    this.domElement.appendChild(this.propertyNameElement);
    
    
};