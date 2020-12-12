/**
 * dat-gui JavaScript Controller Library
 * https://github.com/dataarts/dat.gui
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
 */
class NumberControllerSlider extends NumberController {
  constructor(object, property, min, max, step, disableMidi) {
    super(object, property, { min: min, max: max, step: step });

    const _this = this;

    this.__background = document.createElement('div');
    this.__foreground = document.createElement('div');
    if (!disableMidi) {
      this.__midiButton = document.createElement('div');
      this.__midiButton.style.display = 'none';
      dom.bind(this.__midiButton, 'mousedown', onMidiButtonClick);
      dom.bind(this.__midiButton, 'touchstart', onMidiButtonClick);
      this.__midiButton.innerText = '🎵';
      dom.addClass(this.__midiButton, 'slider-midi');
      setMidiDomState();
      detectMidi();
    }
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

    function onMouseDrag(e) {
      e.preventDefault();

      const bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(
        map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max)
      );

      return false;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onTouchStart(e) {
      if (e.touches.length !== 1) { return; }
      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }

    function onTouchMove(e) {
      const clientX = e.touches[0].clientX;
      const bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(
        map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max)
      );
    }

    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onMidiButtonClick() {
      if (_this.__activeMidiInput || _this.__midiBindState === 'binding') {
        unbindMidi();
      } else {
        bindMidi();
      }
    }


    function onMidiMessage(e) {
      if (!_this.__activeMidiInput) {
        clearTimeout(_this.__cancelMidiTimer);
        _this.__activeMidiInput = e.currentTarget;
        _this.__midiControlId = e.data[1];
        _this.__midiInputs.forEach(function (input) {
          if (input.id !== e.currentTarget.id) {
            input.removeEventListener('midimessage', onMidiMessage);
          }
        });
        setMidiDomState('bound');
      }
      if (e.data[1] === _this.__midiControlId) {
        _this.setValue(
          map(e.data[2], 0, 127, _this.__min, _this.__max)
        );
      }
    }

    function setMidiDomState(state) {
      dom.removeClass(_this.__midiButton, 'bound');
      dom.removeClass(_this.__midiButton, 'binding');
      if (state) {
        _this.__midiBindState = state;
        dom.addClass(_this.__midiButton, state);
        if (state === 'binding') {
          _this.__midiButton.setAttribute('title', 'Cancel Midi Control: Click to cancel midi binding.');
        } else {
          _this.__midiButton.setAttribute('title', 'Disable Midi Control: Click to unbind.');
        }
      } else {
        _this.__midiBindState = 'unbound';
        _this.__midiButton.setAttribute('title', 'Enable Midi Control: Click then manipulate your device to bind.');
      }
    }

    function detectMidi() {
      hasMidiDevices().then(function (hasMidi) {
        if (hasMidi) {
          _this.__midiButton.style.display = 'block';
        }
      });
    }

    function hasMidiDevices() {
      return new Promise(function (resolve) {
        if (navigator && navigator.requestMIDIAccess) {
          const promise = navigator.requestMIDIAccess();
          if (promise) {
            promise
              .then(function (access) {
                resolve(access && access.inputs && access.inputs.size);
              })
              .catch(function () {
                resolve(false);
              });
          }
        } else {
          resolve(false);
        }
      });
    }

    function bindMidi() {
      setMidiDomState('binding');
      navigator.requestMIDIAccess()
        .then(function (access) {
          const inputs = Array.from(access.inputs.values());
          _this.__midiInputs = inputs;
          for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            input.addEventListener('midimessage', onMidiMessage);
          }
        });
      _this.__cancelMidiTimer = setTimeout(function () {
        unbindMidi();
      }, 15000);
    }

    function unbindMidi() {
      _this.__activeMidiInput = undefined;
      clearTimeout(_this.__cancelMidiTimer);
      setMidiDomState();
      if (_this.__midiInputs) {
        _this.__midiInputs.forEach(function (input) {
          input.removeEventListener('midimessage', onMidiMessage);
        });
      }
    }

    this.updateDisplay();

    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__midiButton);
    this.domElement.appendChild(this.__background);
  }


  updateDisplay() {
    const pct = (this.getValue() - this.__min) / (this.__max - this.__min);
    this.__foreground.style.width = pct * 100 + '%';
    return super.updateDisplay();
  }
}

export default NumberControllerSlider;
