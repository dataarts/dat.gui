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

var OptionController = require('./OptionController'),
    NumberControllerBox = require('./NumberControllerBox'),
    NumberControllerSlider = require('./NumberControllerSlider'),
    StringController = require('./StringController'),
    FunctionController = require('./FunctionController'),
    BooleanController = require('./BooleanController'),
    common = require('../utils/common');

    module.exports = function(object, property) {

  var initialValue = object[property];

  // Providing options?
  if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }

  // Providing a map?

  if (common.isNumber(initialValue)) {

    if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {
      // Has min and max.
      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);

    } else {

      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
    }
  }

  if (common.isString(initialValue)) {
    return new StringController(object, property);
  }

  if (common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }

  if (common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }
};