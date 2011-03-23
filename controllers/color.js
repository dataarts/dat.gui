

var rgb = function(r, g, b, a) {
	var a = a || 255;
	return ~~ a << 32 ^ ~~ r << 16 ^ ~~ g << 8 ^ ~~ b;
}
var hsv = function(h, s, v) {

}
var red = function(color) {

}
var 
var hex = function(color) {
	return '#'+color.toString(16);
}


console.log(hex(rgb(0, 0, 255, 255)));
