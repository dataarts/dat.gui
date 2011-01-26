function DynamicText(message, width, height, textAscent) {
    
    var message = message;
    
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
    
    var createParticles = function(m) {
        s.fillStyle = "#fff";
        s.fillRect(0, 0, width, height);
        
        s.fillStyle = "#222";
        s.fillText(m, 0, textAscent);
        
        // Pull reference
        var imageData = s.getImageData(0, 0, width, height);
        pixels = imageData.data;
                
        // Set reference onto particles
        for(var i = 0; i < pixels.length; i+=4) {
            if(pixels[i] < 255) {
                var p = getPosition(i);
                var c = getPixel(p.x, p.y);
                particles.push( new Particle(p.x, p.y, c) );
            }
        }
    };
    
    var render = function() {
        
        g.clearRect(0, 0, width, height);
        
        for(var i = 0; i < particles.length; i++) {
            particles[i].update();
            
            var p = particles[i].position;
            g.fillStyle = particles[i].color;
            g.fillRect(p.x, p.y, 1, 1);
        }
    };
    
    var getPosition = function(i) {
        return { x: (i - (width * 4) * Math.floor(i/(width * 4))) / 4, y: Math.floor(i/(width * 4)) };
    };
    
    var getPixel = function(x, y) {
        var base = (y * width + x) * 4;
        return { r: pixels[base + 0], g: pixels[base + 1], b: pixels[base + 2], a:  pixels[base + 3]};
    };
    
    this.__defineGetter__("message", function() {
        return message;
    });
    
    this.__defineSetter__("message", function(m) {
        message = m;
        particles = [];
        createParticles(message);
        render();
    });
    
    createParticles(message);
    setInterval(render, 30);
}

function Particle(x, y, c) {
    var x = x;
    var y = y;
    
    this.color = "rgb("+c.r+", "+c.g+", "+c.b+")";
    
    this.update = function() {
        // x+=Math.random() - Math.random();
    };
    
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