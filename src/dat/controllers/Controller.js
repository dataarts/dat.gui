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

/**
 * @class An "abstract" class that represents a given property of an object.
 *
 * @param {Object} object The object to be manipulated
 * @param {string} property The name of the property to be manipulated
 *
 * @member dat.controllers
 */
class Controller {
  constructor(object, property) {
    this.initialValue = object[property];

    /**
     * Those who extend this class will put their DOM elements in here.
     * @type {DOMElement}
     */
    this.domElement = document.createElement('div');

    /**
     * The object to manipulate
     * @type {Object}
     */
    this.object = object;

    /**
     * The name of the property to manipulate
     * @type {String}
     */
    this.property = property;

    /**
     * The containing GUI
     * @type {GUI}
     */
    this.parent = undefined;


    /**
     * The function to be called on change.
     * @type {Function}
     * @ignore
     */
    this.__onChange = undefined;

    /**
     * The function to be called on finishing change.
     * @type {Function}
     * @ignore
     */
    this.__onFinishChange = undefined;
  }

  /**
   * Specify that a function fire every time someone changes the value with
   * this Controller.
   *
   * @param {Function} fnc This function will be called whenever the value
   * is modified via this Controller.
   * @returns {Controller} this
   */
  onChange(fnc) {
    this.__onChange = fnc;
    return this;
  }

  /**
   * Specify that a function fire every time someone "finishes" changing
   * the value wih this Controller. Useful for values that change
   * incrementally like numbers or strings.
   *
   * @param {Function} fnc This function will be called whenever
   * someone "finishes" changing the value via this Controller.
   * @returns {Controller} this
   */
  onFinishChange(fnc) {
    this.__onFinishChange = fnc;
    return this;
  }

  /**
   * Fires onFinishChange function if it exists and propagates message
   * to parent.
   *
   * @param {Object} newValue The new value of <code>object[property]</code>
   */
  __propagateFinishChange(val) {
    if (this.__onFinishChange) {
      this.__onFinishChange.call(this, val);
    }

    if (this.parent) {
      this.parent.__propagateFinishChange();
    }
  }


  /**
   * Fires onChange function if it exists and propagates message to parent.
   *
   * @param {Object} newValue The new value of <code>object[property]</code>
   */
  __propagateChange(val) {
    if (this.__onChange) {
      this.__onChange.call(this, val);
    }

    if (this.parent) {
      this.parent.__propagateChange();
    }
  }


  /**
   * Change the value of <code>object[property]</code>
   *
   * @param {Object} newValue The new value of <code>object[property]</code>
   */
  setValue(newValue) {
    this.object[this.property] = newValue;
    this.__propagateChange(newValue);
    this.updateDisplay();

    return this;
  }

  /**
   * Gets the value of <code>object[property]</code>
   *
   * @returns {Object} The current value of <code>object[property]</code>
   */
  getValue() {
    return this.object[this.property];
  }

  /**
   * Refreshes the visual display of a Controller in order to keep sync
   * with the object's current value.
   * @returns {Controller} this
   */
  updateDisplay() {
    return this;
  }

  /**
   * @returns {Boolean} true if the value has deviated from initialValue
   */
  isModified() {
    return this.initialValue !== this.getValue();
  }
}

export default Controller;
