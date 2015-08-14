#dat.GUI
A lightweight graphical user interface for changing variables in JavaScript. 

Get started with dat.GUI by reading the tutorial at http://workshop.chromeexperiments.com/examples/gui.

----

##Packaged Builds
The easiest way to use dat.GUI in your code is by using the built source at `build/dat.gui.min.js`. These built JavaScript files bundle all the necessary dependencies to run dat.GUI.

In your `head` tag, include the following code:
```
<script type="text/javascript" src="dat.gui.main.js"></script>
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
$ npm run build
```

This will create a namespaced, unminified build of dat.GUI at `build/dat.gui.main.js`

----

##Change log

### 0.6.1
 * Fixed all eslint issues
 
### 0.6.0
 * Using common.js
 * Using webpack for build
 * Fixed an issue with colors based on arrays - https://github.com/dataarts/dat.gui/pull/57
 * Update factory.js, Step param was not used - https://github.com/dataarts/dat.gui/pull/45
 
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


### 0.4

 * Migrated from GitHub to Google Code.

----

##Thanks
The following libraries / open-source projects were used in the development of dat.GUI:
 * [require.js](http://requirejs.org/)
 * [Sass](http://sass-lang.com/)
 * [node.js](http://nodejs.org/)
 * [QUnit](https://github.com/jquery/qunit) / [jquery](http://jquery.com/)