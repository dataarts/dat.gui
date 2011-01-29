# gui-dat
**gui-dat** is a lightweight controller library for JavaScript. It allows you to easily manipulate variables and fire functions on the fly.
## Basic Usage
    <script type="text/javascript" src="demo/demo.js"></script>
    <script type="text/javascript">

    window.onload = function() {

       var fizzyText = new FizzyText("gui-dat");

       GUI.start();
   
       // Text field
       GUI.add(fizzyText, "message");

       // Sliders with min and max
       GUI.add(fizzyText, "maxSize", 0.5, 7);
       GUI.add(fizzyText, "growthSpeed", 0.01, 1);
       GUI.add(fizzyText, "speed", 0.1, 2);
   
       // Sliders with min, max and increment
       GUI.add(fizzyText, "noiseStrength", 10, 100, 5);
   
       // Boolean checkbox
       GUI.add(fizzyText, "displayOutline");

       // Fires a function called "explode"
       GUI.add(fizzyText, "explode").name("Explode!"); // Specify a custom name.
   
    };

    </script>
+   ui-dat will infer the type of the property you're trying to add (based on its initial value) and create the corresponding control.
+   The properties must be public, i.e. defined by `**this**.prop = value`.

## Monitor variable changes <i>outside</i> of the GUI
Let's say you have a variable that changes by itself from time to time. If you'd like the GUI to reflect those changes, use the listen() method
    GUI.add(obj, "propName").listen();
## Fire a function when someone uses a control
    GUI.add(obj, "propName").onChange(function(n) {
        alert("You changed me to " + n);
    });
Initiated by [George Michael Brower]:http://georgemichaelbrower.com/ and [Jono Brandel]:http://jonobr1.com/ of the Data Arts Team, Google Creative Lab.
