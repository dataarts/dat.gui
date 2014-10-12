/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * ArrayController is based on StringController and was created by Ulysses Popple
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

define([
    'dat/controllers/Controller',
    'dat/dom/dom',
    'dat/utils/common'
], function (Controller, dom, common) {

  /**
   * @class Provides a text input to alter the array property of an object. 
   *        Automatically converts strings to numbers and boolean values if appropriate.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var ArrayController = function(object, property) {

    ArrayController.superclass.call(this, object, property);

    var _this = this;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    dom.bind(this.__input, 'keyup', onChange);
    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    

    function onChange() {
      var arr = _this.__input.value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/)

      // The resulting values will all be strings, so convert them here to actual data types
      for (var i = 0; i < arr.length; i++) {
        var value = arr[i];
        if (!isNaN(value)) {
          arr[i] = +value;
          continue;
        }
        else if (value === 'true') {
          arr[i] = true;
        }
        else if (value === 'false') {
          arr[i] = false;
        }
      }
      _this.setValue(arr);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  ArrayController.superclass = Controller;

  common.extend(

      ArrayController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {
          // Stops the caret from moving on account of:
          // keyup -> setValue -> updateDisplay
          if (!dom.isActive(this.__input)) {
            this.__input.value = this.getValue();
          }
          return ArrayController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return ArrayController;

});