function Example(string, width, height, textAscent) {
    
    this.string = string;
    
    this.width  = width;
    this.height = height;
    
    this.textAscent = textAscent;
    
    var r = document.createElement('canvas');
    var s = r.getContext('2d');
    
    var c = document.createElement('canvas');
    var g = c.getContext('2d');
    
    r.setAttribute('width', width);
    c.setAttribute('width', width);
    r.setAttribute('height', height);
    c.setAttribute('height', height);
    
    document.getElementById('helvetica-demo').appendChild(c);
    
    s.font("800 "+textAscent+"px helvetica, arial, sans-serif");
    
    var update = function() {
        
        // Create our reference bitmap
        s.fillStyle = "#fff";
        s.fillRect(0, 0, this.width, this.height);
        
        s.fillStyle = "#000";
        s.fillText(this.string, 0, this.textAscent);
        
        // Pull reference
        var imageData = r.getImageData(0, 0, width, height);
        var pixels = imageData.data;
        
        for(var i = 0; i < pixels.length; i+=4) {
            
        }
        
        // Take the string
        // save a bitmap
        // and generate particles
        // in the same points
        // with hooks for the
        // GUI
    };
    
    var render = function() {
        // Draw the particles
    };
    
    var getPixel = function(x, y) {
        
        return 
    }
}