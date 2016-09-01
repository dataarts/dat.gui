## Changelog

### 0.6.0
 * optional external CSS file (dat.gui.css) for use on CSP-enabled servers that block unsafe-inline 
 * added updateDisplay() to GUI, to update all controls in all folders
 * fixed GUI.destroy() to remove all window eventListeners
 * fixed performance issue when rotated on tablet/mobile
 * fixed issue that prevented user from changing values of controls that are listening
 * fixed issues with onFinishChange callbacks on revert
 * fixed issues with color selector formatting
 * fixed issues with step parameters in sliders
 * fixed issue with controler.options() function
 * fixed issue with hiding the GUI
 * Fixed all eslint issues
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
