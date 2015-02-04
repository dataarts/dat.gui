var builder = require('./builder.js');

builder.build({
   "baseUrl": "../src/",
   "main": "dat/gui/GUI",
   "out": "../build/dat.gui.js",
   "minify": false,
   "shortcut": "dat.GUI",
   "paths": {}
});

builder.build({
   "baseUrl": "../src/",
   "main": "dat/gui/GUI",
   "out": "../build/dat.gui.min.js",
   "minify": true,
   "shortcut": "dat.GUI",
   "paths": {}
});
