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
import Plotter from '../utils/plotter';

/**
 * @class Provides a canvas that graphically displays the value of the object property at the specified interval
 *
 * @extends dat.controllers.Controller
 *
 * @param {Object} object The object to be manipulated
 * @param {string} property The name of the property to be manipulated
 * @param {Object} params Contains the max and period properties
 */
class PlotterController extends Controller {
  constructor(object, property, params) {
    super(object, property);
    this.max = params.max;
    this.period = params.period;

    // TODO: Allow graph type to passed in via params: line or bar
    // TODO: Allow fg and bg colours to be passed in via params
    this.__panel = new Plotter('#fff', '#000');
    this.domElement.appendChild(this.__panel.dom);
    this.prevValue = this.getValue();
    this.lastUpdate = Date.now();
  }

  updateDisplay() {
    const value = this.getValue();
    if (this.period < 1 && value !== this.prevValue) {
      this.__panel.update(value, this.max);
    } else if (Math.floor((Date.now() - this.lastUpdate) / this.period) * this.period) {
      this.__panel.update(value, this.max);
      this.lastUpdate = Date.now();
    }

    this.prevValue = value;

    return super.updateDisplay();
  }

}

export default PlotterController;
