#dat.GUI
A lightweight graphical user interface for changing variables in JavaScript. 

Get started with dat.GUI by reading the tutorial at http://workshop.chromeexperiments.com/examples/gui.

----

##Packaged Builds
The easiest way to use dat.GUI in your code is by using the built source at `build/dat.gui.min.js`. These built JavaScript files bundle all the necessary dependencies to run dat.GUI.

In your `head` tag, include the following code:
```
<script type="text/javascript" src="dat.gui.min.js"></script>
```

----

##Using dat.GUI with require.js
Internally, dat.GUI uses [require.js](http://requirejs.org/) to handle dependency management. If you're making changes to the source and want to see the effects of your changes without building, use require js.

In your `head` tag, include the following code:
```
<script data-main="path/to/main" src="path/to/requirejs/require.js"></script>
```

Then, in `path/to/main.js`:
```
require([
  'path/to/gui/module/GUI'
], function(GUI) {

  // No namespace necessary 
  var gui = new GUI();

});
```

----

##Directory Contents
 * build: Concatenated source code.
 * src: Modular code in [require.js](http://requirejs.org/) format. Also includes css, [scss](http://sass-lang.com/), and html, some of which is included during build.
 * tests: [QUnit](https://github.com/jquery/qunit) test suite.
 * utils: [node.js](http://nodejs.org/) utility scripts for compiling source.

----

##Building your own dat.GUI

In the terminal, enter the following:

```
$ cd utils
$ node build_gui.js
```

This will create a namespaced, unminified build of dat.GUI at `build/dat.gui.js`

_To export minified source using Closure Compiler, open `utils/build_gui.js` and set the `minify` parameter to `true`._

----

##Change log

###0.5
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

##Thanks
The following libraries / open-source projects were used in the development of dat.GUI:
 * [require.js](http://requirejs.org/)
 * [Sass](http://sass-lang.com/)
 * [node.js](http://nodejs.org/)
 * [QUnit](https://github.com/jquery/qunit) / [jquery](http://jquery.com/)