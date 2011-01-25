var Slider = function() {
	
	this.domElement = document.createElement('div');
	this.domElement.setAttribute('class', 'guidat-slider-bg');
	
	this.fg = document.createElement('div');
	this.fg.setAttribute('class', 'guidat-slider-fg');
	
	this.domElement.appendChild(this.fg);
	
}