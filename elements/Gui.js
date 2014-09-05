(function(scope) {
  'use strict';

  var Gui = function(params) {

    if (!ready) {
      Gui.error('Gui not ready. Put your code inside Gui.ready()');
    }

    params = params || {};

    var panel = document.createElement('gui-panel');

    panel.autoPlace = params.autoPlace !== false;

    if (panel.autoPlace) {
      document.body.appendChild(panel);
    }

    return panel;

  };

  // Register custom controllers
  // -------------------------------

  var controllers = {};

  Gui.register = function(elementName, test) {

    controllers[elementName] = test;

  };

  // Returns a controller based on a value
  // -------------------------------

  Gui.getController = function(value) {

    for (var type in controllers) {

      var test = controllers[type];

      if (test(value)) {

        return document.createElement(type);

      }

    }

  };

  // Gui ready handler ... * shakes fist at polymer *
  // -------------------------------

  var ready = false;
  var readyHandlers = [];

  document.addEventListener('polymer-ready', function() {

    ready = true;
    readyHandlers.forEach(function(fnc) {

      fnc();

    });

  });

  Gui.ready = function(fnc) {

    if (ready) {
      fnc();
    } else {
      readyHandlers.push(fnc);
    }

  };

  // Error
  // -------------------------------

  Gui.error = function() {
    var args = Array.prototype.slice.apply(arguments);
    args.unshift('dat-gui ::');
    console.error.apply(console, args);
  };

  Gui.warn = function() {
    var args = Array.prototype.slice.apply(arguments);
    args.unshift('dat-gui ::');
    console.warn.apply(console, args);
  };

  // Old namespaces
  // -------------------------------

  var dat = {};

  dat.gui = {};
  dat.gui.GUI = Gui;
  dat.GUI = dat.gui.GUI;

  dat.color = {};
  dat.color.Color = function() {};

  dat.dom = {};
  dat.dom.dom = function() {};

  dat.controllers = {};
  dat.controllers.Controller = constructor('controller-base');
  dat.controllers.NumberController = constructor('controller-number');
  dat.controllers.FunctionController = constructor('controller-function');
  dat.controllers.ColorController = constructor('controller-color');
  dat.controllers.BooleanController = constructor('controller-boolean');
  dat.controllers.OptionController = constructor('controller-option');

  dat.controllers.NumberControllerBox = dat.controllers.NumberController;
  dat.controllers.NumberControllerSlider = dat.controllers.NumberController;

  function constructor(elementName) {

    return function(object, path) {
      var el = document.createElement(elementName);
      el.watch(object, path);
      return el;
    };

  }

  // Export
  // -------------------------------

  scope.dat = dat;
  scope.Gui = Gui;

})(this);
