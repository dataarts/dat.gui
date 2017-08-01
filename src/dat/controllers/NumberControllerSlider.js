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

import NumberController from './NumberController';
import dom from '../dom/dom';

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}

/**
 * @class Represents a given property of an object that is a number, contains
 * a minimum and maximum, and provides a slider element with which to
 * manipulate it. It should be noted that the slider element is made up of
 * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
 * <code>&lt;slider&gt;</code> element.
 *
 * @extends dat.controllers.Controller
 * @extends dat.controllers.NumberController
 *
 * @param {Object} object The object to be manipulated
 * @param {string} property The name of the property to be manipulated
 * @param {Number} minValue Minimum allowed value
 * @param {Number} maxValue Maximum allowed value
 * @param {Number} stepValue Increment by which to change value
 *
 * @member dat.controllers
 */
class NumberControllerSlider extends NumberController {
  constructor(object, property, min, max, step) {
    super(object, property, { min: min, max: max, step: step });

    const _this = this;

    this.__background = document.createElement('div');
    this.__foreground = document.createElement('div');

    dom.bind(this.__background, 'mousedown', onMouseDown);
    dom.bind(this.__background, 'touchstart', onTouchStart);

    dom.addClass(this.__background, 'slider');
    dom.addClass(this.__foreground, 'slider-fg');

    function onMouseDown(e) {
      document.activeElement.blur();

      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);

      onMouseDrag(e);
    }

    function onTouchStart(e) {
      document.activeElement.blur();

      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);

      _this.__activeTouch = e.targetTouches[0];

      onTouchMove(e);
    }

    function onMouseDrag(e) {
      // e.preventDefault();

      onDrag(e.clientX);
    }

    function onTouchMove(e) {
      // e.preventDefault();

      const changed = e.changedTouches;

      for (let i = 0; i < changed.length; i++) {
        if (changed[i].identifier === _this.__activeTouch.identifier) {
          onDrag(changed[i].clientX);
        }
      }
    }

    function onDrag(clientX) {
      const bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(
        map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max)
      );

      return false;
    }

    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onMouseDrag);
      dom.unbind(window, 'touchend', onMouseUp);

      _this.__activeTouch = null;

      moveFinish();
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);

      moveFinish();
    }

    function moveFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__background);
  }

  updateDisplay() {
    const pct = (this.getValue() - this.__min) / (this.__max - this.__min);
    this.__foreground.style.width = pct * 100 + '%';
    return super.updateDisplay();
  }
}

export default NumberControllerSlider;
