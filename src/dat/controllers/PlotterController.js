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
import dom from '../dom/dom';
import plotter from '../utils/plotter'

/**
 * @class Provides a GUI interface to fire a specified method, a property of an object.
 *
 * @extends dat.controllers.Controller
 *
 * @param {Object} object The object to be manipulated
 * @param {string} property The name of the property to be manipulated
 */
class PlotterController extends Controller {
  constructor(object, property, params) {
    super(object, property);

    const _this = this;

    this.__panel = new plotter('#0ff', '#002');
    this.domElement.appendChild(this.__panel.dom);
  }


}

export default PlotterController;
