function FizzyText(message) {

  var that = this;

  // These are the variables that we manipulate with gui-dat.
  // Notice they're all defined with "this". That makes them public.
  // Otherwise, gui-dat can't see them.

  this.growthSpeed = 0.2;       // how fast do particles change size?
  this.maxSize = 5.59;          // how big can they get?
  this.noiseStrength = 10;      // how turbulent is the flow?
  this.speed = 0.4;             // how fast do particles move?
  this.displayOutline = false;  // should we draw the message as a stroke?
  this.framesRendered = 0;

  // __defineGetter__ and __defineSetter__ makes JavaScript believe that
  // we've defined a variable 'this.message'. This way, whenever we
  // change the message variable, we can call some more functions.

  this.__defineGetter__("message", function () {
    return message;
  });

  this.__defineSetter__("message", function (m) {
    message = m;
    createBitmap(message);
  });

  // We can even add functions to the DAT.GUI! As long as they have
  // 0 arguments, we can call them from the dat-gui panel.

  this.explode = function() {
    var mag = Math.random() * 30 + 30;
    for (var i in particles) {
      var angle = Math.random() * Math.PI * 2;
      particles[i].vx = Math.cos(angle) * mag;
      particles[i].vy = Math.sin(angle) * mag;
    }
  };

  ////////////////////////////////////////////////////////////////

  var _this = this;

  var width = 550;
  var height = 200;
  var textAscent = 101;
  var textOffsetLeft = 80;
  var noiseScale = 300;
  var frameTime = 30;

  var colors = ["#00aeff", "#0fa954", "#54396e", "#e61d5f"];

  // This is the context we use to get a bitmap of text using
  // the getImageData function.
  var r = document.createElement('canvas');
  var s = r.getContext('2d');

  // This is the context we actually use to draw.
  var c = document.createElement('canvas');
  var g = c.getContext('2d');

  r.setAttribute('width', width);
  c.setAttribute('width', width);
  r.setAttribute('height', height);
  c.setAttribute('height', height);

  // Add our demo to the HTML
  document.getElementById('helvetica-demo').appendChild(c);

  // Stores bitmap image
  var pixels = [];

  // Stores a list of particles
  var particles = [];

  // Set g.font to the same font as the bitmap canvas, incase we
  // want to draw some outlines.
  s.font = g.font = "800 82px helvetica, arial, sans-serif";

  // Instantiate some particles
  for (var i = 0; i < 1000; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height));
  }

  // This function creates a bitmap of pixels based on your message
  // It's called every time we change the message property.
  var createBitmap = function (msg) {

    s.fillStyle = "#fff";
    s.fillRect(0, 0, width, height);

    s.fillStyle = "#222";
    s.fillText(msg, textOffsetLeft, textAscent);

    // Pull reference
    var imageData = s.getImageData(0, 0, width, height);
    pixels = imageData.data;

  };

  // Called once per frame, updates the animation.
  var render = function () {

    that.framesRendered ++;

    g.clearRect(0, 0, width, height);

    if (_this.displayOutline) {
      g.globalCompositeOperation = "source-over";
      g.strokeStyle = "#000";
      g.lineWidth = .5;
      g.strokeText(message, textOffsetLeft, textAscent);
    }

    g.globalCompositeOperation = "darker";

    for (var i = 0; i < particles.length; i++) {
      g.fillStyle = colors[i % colors.length];
      particles[i].render();
    }

  };

  // Returns x, y coordinates for a given index in the pixel array.
  var getPosition = function (i) {
    return {
      x: (i - (width * 4) * Math.floor(i / (width * 4))) / 4,
      y: Math.floor(i / (width * 4))
    };
  };

  // Returns a color for a given pixel in the pixel array.
  var getColor = function (x, y) {
    var base = (Math.floor(y) * width + Math.floor(x)) * 4;
    var c = {
      r: pixels[base + 0],
      g: pixels[base + 1],
      b: pixels[base + 2],
      a: pixels[base + 3]
    };

    return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
  };

  // This calls the setter we've defined above, so it also calls
  // the createBitmap function.
  this.message = message;

  var loop = function() {

    requestAnimationFrame(loop);

    // Don't render if we don't see it.
    // Would be cleaner if I dynamically acquired the top of the canvas.
    if (document.body.scrollTop < height + 20) {
      render();
    }

  }

  // This calls the render function every 30 milliseconds.
  loop();

  // This class is responsible for drawing and moving those little
  // colored dots.
  function Particle(x, y, c) {

    // Position
    this.x = x;
    this.y = y;

    // Size of particle
    this.r = 0;

    // This velocity is used by the explode function.
    this.vx = 0;
    this.vy = 0;

    // Called every frame
    this.render = function () {

      // What color is the pixel we're sitting on top of?
      var c = getColor(this.x, this.y);

      // Where should we move?
      var angle = noise(this.x / noiseScale, this.y / noiseScale) * _this.noiseStrength;

      // Are we within the boundaries of the image?
      var onScreen = this.x > 0 && this.x < width &&
          this.y > 0 && this.y < height;

      var isBlack = c != "rgb(255,255,255)" && onScreen;

      // If we're on top of a black pixel, grow.
      // If not, shrink.
      if (isBlack) {
        this.r += _this.growthSpeed;
      } else {
        this.r -= _this.growthSpeed;
      }

      // This velocity is used by the explode function.
      this.vx *= 0.5;
      this.vy *= 0.5;

      // Change our position based on the flow field and our
      // explode velocity.
      this.x += Math.cos(angle) * _this.speed + this.vx;
      this.y += -Math.sin(angle) * _this.speed + this.vy;

      this.r = DAT.GUI.constrain(this.r, 0, _this.maxSize);

      // If we're tiny, keep moving around until we find a black
      // pixel.
      if (this.r <= 0) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        return; // Don't draw!
      }

      // Draw the circle.
      g.beginPath();
      g.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      g.fill();

    }

  }

}
