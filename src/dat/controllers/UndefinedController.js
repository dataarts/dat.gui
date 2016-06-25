/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * UndefinedController (an adapted StringController) by mikenon
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
   * @class Provides a *disabled* text input indicating the value of the property
   *        is undefined. Calling reset() on the controller will remove and re-add it.
   *        It is intended to be used as a placeholder, where the gui is built before
   *        some required variable has been initialized.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var UndefinedController = function (object, property) {
    UndefinedController.superclass.call(this, object, property);

    var _this = this;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');
    this.__input.setAttribute('disabled', true);
    this.domElement.appendChild(this.__input);
  };

  UndefinedController.superclass = Controller;

  common.extend(
    UndefinedController.prototype,
    Controller.prototype, {
      updateDisplay: function () {
        if (this.__onFinishChange) {
          if (!common.isUndefined(this.object[this.property])) {
            this.__onFinishChange.call(this.object[this.property])
          }
        }
        return UndefinedController.superclass.prototype.updateDisplay.call(this);
      },

    }
  );

  return UndefinedController;
});
