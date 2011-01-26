function DynamicText(string, width, height, textAscent) {
    
    this.string = string;
    
    this.width  = width;
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
    
    // document.getElementById('helvetica-demo').appendChild(r);
    document.getElementById('helvetica-demo').appendChild(c);
    
    var pixels    = [];
    var particles = [];
    
    s.font = "800 "+textAscent+"px helvetica, arial, sans-serif";
    
    this.update = function() {
        
        // Create our reference bitmap
        s.fillStyle = "#fff";
        s.fillRect(0, 0, this.width, this.height);
        
        s.fillStyle = "#000";
        s.fillText(this.string, 0, this.textAscent);
        
        // Pull reference
        var imageData = s.getImageData(0, 0, width, height);
        pixels = imageData.data;
        
        // Set reference onto particles
        for(var i = 0; i < pixels.length; i+=4) {
            if(pixels[i] < 255) {
                var p = getPosition(i);
                if(particles[i])
                    particles[i].position = p;
                else
                    particles.push( new Particle(p.x, p.y) );
            }
        }
    };
    
    this.render = function(c) {
        g.fillStyle = c;
        for(var i = 0; i < particles.length; i++) {
            var p = particles[i].position;
            g.fillRect(p.x, p.y, 1, 1);
        }
    };
    
    var getPosition = function(i) {
        var p = { x: (i - (width * 4) * Math.floor(i/(width * 4))) / 4, y: Math.floor(i/(width * 4)) };
        return p;
    };
    
    var getPixel = function(x, y) {
        var p = { r: pixels[4 * x * y + 0], g: pixels[4 * x * y + 1], b: pixels[4 * x * y + 2], a:  pixels[4 * x * y + 3]};
        return p;
    };
}

function Particle(x, y) {
    var x = x;
    var y = y;
    
    this.__defineGetter__("x", function() {
        return x;
    });
    
    this.__defineGetter__("y", function() {
        return y;
    });
    
    this.__defineGetter__("position", function() {
        return { x: x, y: y };
    });
    
    this.__defineSetter__("x", function(n) {
        x = n;
    });
    
    this.__defineSetter__("y", function(n) {
        y = n;
    });
    
    // Dependent on Vector format
    this.__defineSetter__("position", function(p) {
        if(p.x && p.y) {
            x = p.x;
            y = p.y;
        }
    });
}