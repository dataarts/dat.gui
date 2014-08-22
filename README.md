# dat-gui

With very little code, dat gui creates an interface that you can use to modify variables.

## Basic Usage

Download the [minified library]( todo ) and include it in your html.

```html
<script src="gui.js"></script>
```

The following code makes a number box for the variable `object.someNumber`.

```javascript
var gui = new Gui();
gui.add( object, 'someNumber' );
```

dat-gui decides what type of controller to use based on the variable's initial value.

```javascript
var gui = new Gui();
gui.add( object, 'stringProperty' ); // Text box
gui.add( object, 'booleanProperty' ); // Check box
gui.add( object, 'functionProperty' ); // Button
```

## Constraining Input

You can specify limits on numbers. A number with a min and max value becomes a slider.

```javascript
gui.add( text, 'growthSpeed', -5, 5 ); // Min and max
gui.add( text, 'noiseStrength' ).step( 5 ); // Increment amount
gui.add( text, 'maxSize' ).min( 0 ).step( 0.25 ); // Mix and match
```

You can also provide a list of accepted values for a dropdown.

```javascript
// Choose from accepted values
gui.add( text, 'message', [ 'pizza', 'chrome', 'hooray' ] );

// Choose from named values
gui.add( text, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 } );
```

## Color Controllers

dat-gui has a color selector and understands many different representations of color. The following creates color controllers for color variables of different formats.


```javascript
var FizzyText = function() {

  this.color0 = "#ffae23"; // CSS string
  this.color1 = [ 0, 128, 255 ]; // RGB array
  this.color2 = [ 0, 128, 255, 0.3 ]; // RGB with alpha
  this.color3 = { h: 350, s: 0.9, v: 0.3 }; // Hue, saturation, value

  // Define render logic ...

};

window.onload = function() {

  var text = new FizzyText();
  var gui = new Gui();

  gui.addColor(text, 'color0');
  gui.addColor(text, 'color1');
  gui.addColor(text, 'color2');
  gui.addColor(text, 'color3');

};
```

## Events

You can listen for events on individual controllers using an event listener syntax.

```javascript
var controller = gui.add(fizzyText, 'maxSize', 0, 10);

controller.onChange(function(value) {
  // Fires on every change, drag, keypress, etc.
});

controller.onFinishChange(function(value) {
  // Fires when a controller loses focus.
  alert("The new value is " + value);
});
```

## Folders

You can nest as many Gui's as you want. Nested Gui's act as collapsible folders.

```javascript
var gui = new Gui();

var f1 = gui.addFolder('Flow Field');
f1.add(text, 'speed');
f1.add(text, 'noiseStrength');

var f2 = gui.addFolder('Letters');
f2.add(text, 'growthSpeed');
f2.add(text, 'maxSize');
f2.add(text, 'message');

f2.open();
```


## Saving Values

Add a save menu to the interface by calling `gui.remember` on all the objects you've added to the Gui.

```javascript
var fizzyText = new FizzyText();
var gui = new Gui();

gui.remember(fizzyText);

// Add controllers ...
```

Click the gear icon to change your save settings. You can either save your Gui's values to localStorage, or by copying and pasting a JSON object into your source code as follows:

```javascript
var fizzyText = new FizzyText();
var gui = new Gui({ load: JSON });

gui.remember(fizzyText);

// Add controllers ...
```

## Save to disk

dat-gui comes with a node server that listens for changes to your Gui and saves them to disk. This way you don't have to worry about losing your local storage or copying and pasting a JSON string.

First, run the node script:

```sh
$ node gui-server
```

Next, instantiate your Gui with a path to a JSON file to store settings. 

```javascript
var gui = new Gui( { save: 'path/to/file.json' } );
gui.remember( fizzyText );

// Add controllers ...
```

## Custom Placement

By default, Gui panels are created with fixed position, and are automatically appended to the body.

You can change this behavior by setting the `autoPlace` parameter to `false`.

```javascript
var gui = new Gui( { autoPlace: false } );

var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);
```

## HTML Elements

Since dat-gui is built using [Web Components]( todo ), you can use HTML syntax to add controllers to the page.

```html
<body>
  
<controller-number id="my-controller" min="-2" max="2" step="1" value="0"></controller-number>

<script>

var controller = document.getElementById( 'my-controller' );
controller.onChange( function() {

    // react to UI changes ...

} );

</script>

</body>
```

## Defining Custom Controllers

dat-gui uses [Polymer]( todo ) under the hood to define custom elements. A dat-gui controller is just a [Polymer element]( todo ) with two important requirements:

- Controllers must extend `<controller-base>`.
- Controllers must be associated with a data type.

Take for example this (simplified) source for dat-gui's `<controller-number>`:

```javascript
Polymer( 'controller-number', {

  // Define element ...

} );

Gui.register( 'controller-number', function( value ) {

    return typeof value == 'number';

} );
```

`Gui.register` takes an element name and a test function. The call to `Gui.register` tells dat-gui to add a `<controller-number>` to the panel when the user adds a variable whose type is `'number'`.

A test function takes a value added with `gui.add` and returns a boolean that determines if the controller is appropriate for the value. This example uses [duck typing]( todo ) to register `<vector-controller>` for values that have properties `x`, `y` and `z`.

```javascript
Gui.register( 'vector-controller', function( value ) {

    return value.hasOwnProperty( 'x' ) &&
           value.hasOwnProperty( 'y' ) &&
           value.hasOwnProperty( 'z' );

} );
```

## Publishing Custom Controllers

You should use bower and format your plugin all nice and it should have a certain prefix yada yada.