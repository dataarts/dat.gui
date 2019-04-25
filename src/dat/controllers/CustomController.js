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
import Controller from './Controller';

/**
 * @class Represents a custom controller.
 * @param {Object} object
 * @param {string} property
 */
class CustomController extends Controller{
  constructor(object, property) {
  	super(object, property);

  	object.constructor( this );
  }
}

export default CustomController;
