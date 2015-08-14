module.exports = {
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
