# UI Controller (dat.gui ported to commonjs)

A lightweight graphical user interface for changing variables in JavaScript. 

Get started with dat.GUI by reading the tutorial at http://workshop.chromeexperiments.com/examples/gui.

## Packaged Builds

The easiest way to use dat.GUI in your code is by using the built source at `build/dat.gui.min.js`. These built JavaScript files bundle all the necessary dependencies to run dat.GUI.

In your `head` tag, include the following code:

``` html
<script type="text/javascript" src="dat.gui.min.js"></script>
```

## As commonjs module

Install the module:

```
npm install dat.gui
```

Use it:

``` js
var dat = require('dat.gui');
var obj = { x: 5 };
var gui = new dat.GUI();

gui.add(obj, 'x').onChange(function() {
  // obj.x will now have updated value
});
```



## Directory Contents

 * build: Concatenated source code for browsers.
 * src: source code in commonjs format.
 * tests: [QUnit](https://github.com/jquery/qunit) test suite.

## Building your own dat.GUI

In the terminal, enter the following:

```
npm start
```

This will create a browserified build of dat.GUI at `build/dat.gui.js` and its
minified version at `build/dat.gui.min.js`.

## Change log

### Pending version number
 * Moved to commonjs, made it browserify friendly.
 * Back to GitHub.

### 0.5
 * Moved to requirejs for dependency management.
 * Changed global namespace from *DAT* to *dat* (lowercase).
 * Added support for color controllers. See [Color Controllers](http://workshop.chromeexperiments.com/examples/gui/#4--Color-Controllers).
 * Added support for folders. See [Folders](http://workshop.chromeexperiments.com/examples/gui/#3--Folders).
 * Added support for saving named presets.  See [Presets](http://workshop.chromeexperiments.com/examples/gui/examples/gui/#6--Presets).
 * Removed `height` parameter from GUI constructor. Scrollbar automatically induced when window is too short.
 * `dat.GUI.autoPlace` parameter removed. Use `new dat.GUI( { autoPlace: false } )`. See [Custom Placement](http://workshop.chromeexperiments.com/examples/gui/#9--Custom-Placement).
 * `gui.autoListen` and `gui.listenAll()` removed. See [Updating The Display Manually](http://workshop.chromeexperiments.com/examples/gui/#11--Updating-the-Display-Manually).
 * `dat.GUI.load` removed. See [Saving Values](http://workshop.chromeexperiments.com/examples/gui/#5--Saving-Values).
 * Made Controller code completely agnostic of GUI. Controllers can easily be created independent of a GUI panel.


#0.4

 * Migrated from GitHub to Google Code.

----

## Thanks
The following libraries / open-source projects were used in the development of dat.GUI:

 * [browserify](http://browserify.org/)
 * [Sass](http://sass-lang.com/)
 * [node.js](http://nodejs.org/)
 * [QUnit](https://github.com/jquery/qunit) / [jquery](http://jquery.com/)
