
var c, g;
var frameRate = 1000/60;
var width, height;

var checkAsset = 0;
var letterWidth = 50;

function setup() {
    
    c = document.getElementById('helvetica-demo');
    g = c.getContext('2d');
    
    width  = c.width;
    height = c.height;
    
    g.font = "800 80px helvetica, arial, sans-serif";
    frameRate = setInterval("draw()", frameRate);
}


function draw() {
    
    g.fillStyle = "#fff";
    g.fillRect(0, 0, width, height);
    
    g.fillStyle = "#222";
    g.fillText(controllableObject.pageTitle, 0, height);
    
}