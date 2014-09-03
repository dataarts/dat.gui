# dat-gui

dat-gui creates an interface that you can use to modify variables with very little code. 

[ Basic Usage ]( #basic-usage ) •
[ Limits ]( #limits ) •
[ Colors ]( #colors ) •
[ Events ]( #events ) •
[ Folders ]( #folders ) •
[ Saving ]( #saving )

### Basic Usage 

Download the [minified library]( todo ) and include it in your html.

```html
<script src="gui.js"></script>
```

Create controllers by adding objects and their properties. dat-gui chooses a controller based on the variable's initial value.

```javascript
var gui = new Gui();
gui.add( object, 'numberProperty', 0, 1 ); // Slider
gui.add( object, 'stringProperty' ); // Text box
gui.add( object, 'booleanProperty' ); // Check box
gui.add( object, 'functionProperty' ); // Button
```

### Limits

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

### Colors

dat-gui has a color selector and understands many different representations of color. The following creates color controllers for color variables of different formats.


```javascript
text.color0 = "#ffae23"; // CSS string
text.color1 = [ 0, 128, 255 ]; // RGB array
text.color2 = [ 0, 128, 255, 0.3 ]; // RGB with alpha
text.color3 = { h: 350, s: 0.9, v: 0.3 }; // Hue, saturation, value

var gui = new Gui();

gui.addColor(text, 'color0');
gui.addColor(text, 'color1');
gui.addColor(text, 'color2');
gui.addColor(text, 'color3');

```

### Events 

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

### Folders

You can nest as many dat-gui as you want. Nested dat-gui act as collapsible folders.

```javascript
var gui = new Gui();

var f1 = gui.addFolder('Flow Field');
f1.add(text, 'speed');
f1.add(text, 'noiseStrength');

var f2 = gui.addFolder('Letters');
f2.add(text, 'growthSpeed');
f2.add(text, 'maxSize');

f2.open();
```

The comment method adds a tooltip to a controller.

```javascript
f2.add(text, 'message').comment( 'This is the comment.' );
```

### Saving 

Add a save menu to the interface by calling `gui.remember` on all the objects you've added to the Gui.

```javascript
var fizzyText = new FizzyText();
var gui = new Gui();

gui.remember(fizzyText);

// Add controllers ...
```

Click the gear icon to change your save settings. You can either save your dat-gui values to localStorage, or by copying and pasting a JSON object into your source code as follows:

```javascript
var fizzyText = new FizzyText();
var gui = new Gui( { load: JSON } );

gui.remember( fizzyText );

// Add controllers ...
```

### Presets 

The save menu also allows you to save all of your settings as presets. Click Save to modify the current preset, or New to create a new preset from existing settings. Clicking Revert will clear all unsaved changes to the current preset.

Switch between presets using the dropdown in the save menu. You can specify the default like this:

```javascript
var gui = new Gui({
  load: JSON,
  preset: 'Flow'
});
```

A word of caution about localStorage:

Paste the JSON save object into your source frequently. Using localStorage to save presets can make you faster, but its easy to lose your settings by clearing browsing data, changing browsers, or even by changing the URL of the page you're working on.

### Save to Disk 

dat-gui comes with a node server that saves your settings to disk. This way you don't have to worry about losing your values to local storage or copying and pasting a JSON string.

First, run the node script:

```sh
$ node gui-server
```

Next, instantiate your Gui with a path to a JSON file to store settings. dat-gui will read from this file on load and write to this file on change.

```javascript
var gui = new Gui( { load: 'path/to/file.json' } );
```

### Custom Placement 

By default, Gui panels are created with fixed position, and are automatically appended to the body. You can change this behavior by setting the `autoPlace` parameter to `false`.

```javascript
var gui = new Gui( { autoPlace: false } );

var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);
```

Since dat-gui is built using [Web Components]( todo ), you can also use HTML syntax to add controllers to the page.

```html
<body>
  
<controller-number min="-2" max="2" step="1" value="0"></controller-number>

<script>

var controller = document.querySelector( 'controller-number' );
controller.onChange( function() {

    // react to UI changes ...

} );

</script>

</body>
```


### Defining Custom Controllers 

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

`Gui.register` takes an element name and a test function. The test function tells dat-gui to add a `<controller-number>` to the panel when the user adds a variable whose type is `'number'`.

A test function determines if a controller is appropriate for a given value. This example registers `<vector-controller>` for values that have properties `x`, `y` and `z`.

```javascript
Gui.register( 'vector-controller', function( value ) {

    return value.hasOwnProperty( 'x' ) &&
           value.hasOwnProperty( 'y' ) &&
           value.hasOwnProperty( 'z' );

} );
```

### Publishing Custom Controllers 

You should use [Bower]( todo ) and format your plugin all nice and it should have a certain prefix yada yada.

Installing third-party controllers ... 

```sh
$ bower install gui-three
```

Include the source for the third-party controllers after dat-gui.

```html
<script src="gui.js"></script>
<script src="gui-three.js"></script>
```
