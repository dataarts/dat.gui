/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
import Controller from './Controller';
import ControllerFactory from './ControllerFactory';

/**
 * @class Represents a custom controller.
 *
 * @extends dat.controllers.Controller
 *
 * @param {Object} object The object to be manipulated
 * @param {Function} [object.property] Returns an object with elements for adding into "property-name" class element.
 * @param {string} property The name of the property to be manipulated
 * @param {Object} [params] Optional parameters
 */
class CustomController extends Controller{
	constructor(object, property) {
    super(object, property);

    this.arguments = {
      object: object, property: property, opts: Array.prototype.slice.call(arguments, 2)
    }
    if(object.property)
      this.property = object.property();
  }
}

export default CustomController;
