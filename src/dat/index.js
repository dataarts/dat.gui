/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

export default {
  color: {
    Color: require('./color/Color'),
    math: require('./color/math'),
    interpret: require('./color/interpret')
  },

  controllers: {
    Controller: require('./controllers/Controller'),
    BooleanController: require('./controllers/BooleanController'),
    OptionController: require('./controllers/OptionController'),
    StringController: require('./controllers/StringController'),
    NumberController: require('./controllers/NumberController'),
    NumberControllerBox: require('./controllers/NumberControllerBox'),
    NumberControllerSlider: require('./controllers/NumberControllerSlider'),
    FunctionController: require('./controllers/FunctionController'),
    ColorController: require('./controllers/ColorController')
  },

  dom: {
    dom: require('./dom/dom')
  },

  gui: {
    GUI: require('./gui/GUI')
  },

  GUI: require('./gui/GUI')
};
