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

    /** The graph will be these many units high */
    this.max = params.max;

    /** Refresh rate. Value of 0 disables auto-refresh */
    this.period = params.period;

    /** Stores the current value for comparison during animation frame */
    this.prevValue = this.getValue();

    /** Allows acurate timing for the period to be checked during animation frame */
    this.lastUpdate = Date.now();

    this.__panel = new Plotter(params.fgColor, params.bgColor, params.type);
    this.domElement.appendChild(this.__panel.dom);
  }

  updateDisplay() {
    const value = this.getValue();
    if (this.period < 1 && value !== this.prevValue) {
      /* Update only on value change when auto-refresh is off */
      this.__panel.update(value, this.max);
    } else if ((Date.now() - this.lastUpdate) > this.period) {
      /* Update if elapsed time since last update is greater than the period */
      this.__panel.update(value, this.max);
      this.lastUpdate = Date.now() * 2 - this.lastUpdate - this.period;
    }

    this.prevValue = value;

    return super.updateDisplay();
  }

}

export default PlotterController;
