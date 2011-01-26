function DynamicText(message, width, height, textAscent) {
    
    var _this = this;
    
    this.growthSpeed = 0.1;
    this.minSize = 0;
    this.maxSize = 5;
    
    var message = message;
    
    this.width = width;
    this.height = height;
    
    this.textAscent = textAscent;
    
    var r = document.createElement('canvas');
    var s = r.getContext('2d');
    
    var c = document.createElement('canvas');
    var g = c.getContext('2d');
    
    r.setAttribute('width',  width);
    c.setAttribute('width',  width);
    r.setAttribute('height', height);
    c.setAttribute('height', height);
    
    document.getElementById('helvetica-demo').appendChild(c);
    
    var pixels    = [];
    var particles = [];
    
    s.font = "800 "+textAscent+"px helvetica, arial, sans-serif";
    
	// Set reference onto particles
	for (var i = 0; i < 1000; i++) {
		particles.push( new Particle(Math.random()*width, Math.random()*height));
	}
	
    var createBitmap = function(m) {
        s.fillStyle = "#fff";
        s.fillRect(0, 0, width, height);
        
        s.fillStyle = "#222";
        s.fillText(m, 0, textAscent);
        
        // Pull reference
        var imageData = s.getImageData(0, 0, width, height);
        pixels = imageData.data;
                
    };
    
    var render = function() {
        
        g.clearRect(0, 0, width, height);
        
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
    };
    
    var getPosition = function(i) {
        return { x: (i - (width * 4) * Math.floor(i/(width * 4))) / 4, y: Math.floor(i/(width * 4)) };
    };
    
    var getColor = function(x, y) {
        var base = (Math.floor(y) * width + Math.floor(x)) * 4;
        var c = { r: pixels[base + 0], g: pixels[base + 1], b: pixels[base + 2], a:  pixels[base + 3]};

        return "rgb("+c.r+","+c.g+","+c.b+")";
    };
    
    this.__defineGetter__("message", function() {
        return message;
    });
    
    this.__defineSetter__("message", function(m) {
        message = m;
        createBitmap(message);
    });
    
    createBitmap(message);
    setInterval(render, 30);
    
	function Particle(x, y, c) {
		this.x = x;
		this.y = y;
		this.r = 0;
		this.update = function() {
			this.x += Math.random() - Math.random();
			this.y += Math.random() - Math.random();
		}
		this.draw = function() {
			var c = getColor(this.x, this.y);
			if (c == "rgb(255,255,255)") {
				this.r -= _this.growthSpeed;
			} else { 
				this.r += _this.growthSpeed;
			}
			this.r = constrain(this.r, _this.minSize, _this.maxSize);
			g.beginPath();
			g.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
			g.fill();
		}
	}
	
	
	var constrain = function(v, o1, o2) {
		if (v < o1) v = o1;
		else if (v > o2) v = o2;
		return v;
	}
	
}
