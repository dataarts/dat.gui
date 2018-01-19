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
import Color from '../color/Color';
import interpret from '../color/interpret';
import common from '../utils/common';

class HSVColorController extends Controller {


  constructor(object, property) {
    super(object, property);

    this.__color = new Color(this.getValue());
    this.__temp = new Color(0);
    this.__temp2 = new Color(0);

    const _this = this;
    this.domElement = document.createElement('div');
    dom.makeSelectable(this.domElement, false);
    this.__selector = document.createElement('div');
    this.__field_knob = document.createElement('div');
    this.__field_knob.className = 'field-knob';
    this.__field_knob_border = '2px solid ';
    this.__field_knob2 = document.createElement('div');
    this.__field_knob2.className = 'field-knob';
    this.__field_knob_border2 = '2px solid ';
    this.__field_knob3 = document.createElement('div');
    this.__field_knob3.className = 'field-knob';
    this.__field_knob_border3 = '2px solid ';
    this.__hsv_field = document.createElement('div');
    this.__hsv_field.className = 'hue-field';
    this.__hsv_field2 = document.createElement('div');
    this.__hsv_field2.className = 'hue-field';
    this.__hsv_field3 = document.createElement('div');
    this.__hsv_field3.className = 'hue-field';
    this.__hsv_fieldLabel = document.createElement('Label');
    this.__hsv_fieldLabel.innerHTML = 'H:';
    this.__hsv_fieldLabel2 = document.createElement('Label');
    this.__hsv_fieldLabel2.innerHTML = 'S:';
    this.__hsv_fieldLabel3 = document.createElement('Label');
    this.__hsv_fieldLabel3.innerHTML = 'V:';

    this.__input = document.createElement('input');
    this.__input.type = 'text';
    this.__input_textShadow = '0 1px 1px ';

    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) { // on enter
        onBlur.call(this);
      }
    });

    dom.bind(this.__input, 'blur', onBlur);

    const valueField = document.createElement('div');

    common.extend(this.__selector.style, {
      width: '256px',
      height: '10px',
      marginTop: '22px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });

    common.extend(this.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      top: '-2',
      zIndex: 1
    });
    common.extend(this.__field_knob2.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      top: '-2',
      zIndex: 1
    });
    common.extend(this.__field_knob3.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      top: '-2',
      zIndex: 1
    });


    common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });


    common.extend(this.__hsv_field.style, {
      width: '256px',
      height: '20px',
      border: '1px solid #555',
      position: 'absolute',
      top: '30px',
      left: '0px'
    });
    common.extend(this.__hsv_field2.style, {
      width: '256px',
      height: '20px',
      border: '1px solid #555',
      position: 'absolute',
      top: '55px',
      left: '0px'
    });
    common.extend(this.__hsv_field3.style, {
      width: '256px',
      height: '20px',
      border: '1px solid #555',
      position: 'absolute',
      top: '80px',
      left: '0px'
    });

    hueGradient(this.__hsv_field);
    hueGradient(this.__hsv_field2);
    hueGradient(this.__hsv_field3);

    common.extend(this.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      left: '0px',
      position: 'absolute',
      fontWeight: 'bold',
      width: '256px',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    common.extend(this.__hsv_fieldLabel.style, {
      outline: 'none',
      textAlign: 'left',
      color: '#fff',
      border: 0,
      left: '-70px',
      position: 'absolute',
      font: 'bold 12px Courier',
      width: '50px',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    common.extend(this.__hsv_fieldLabel2.style, {
      outline: 'none',
      textAlign: 'left',
      color: '#fff',
      border: 0,
      left: '-70px',
      position: 'absolute',
      font: 'bold 12px Courier',
      width: '50px',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    common.extend(this.__hsv_fieldLabel3.style, {
      outline: 'none',
      textAlign: 'left',
      color: '#fff',
      border: 0,
      left: '-70px',
      position: 'absolute',
      font: 'bold 12px Courier',
      width: '50px',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });

    dom.bind(this.__hsv_field, 'mousedown', function(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
    });
    dom.bind(this.__hsv_field2, 'mousedown', function(e) {
      setS(e);
      dom.bind(window, 'mousemove', setS);
      dom.bind(window, 'mouseup', fieldUpS);
    });
    dom.bind(this.__hsv_field3, 'mousedown', function(e) {
      setV(e);
      dom.bind(window, 'mousemove', setV);
      dom.bind(window, 'mouseup', fieldUpV);
    });

    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      onFinish();
    }
    function fieldUpS() {
      dom.unbind(window, 'mousemove', setS);
      dom.unbind(window, 'mouseup', fieldUpS);
      onFinish();
    }
    function fieldUpV() {
      dom.unbind(window, 'mousemove', setV);
      dom.unbind(window, 'mouseup', fieldUpV);
      onFinish();
    }


    function onBlur() {
      const i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }

    common.extend(this.domElement.style, { height: '100px' });

    this.__hsv_field.appendChild(this.__field_knob);
    this.__hsv_field2.appendChild(this.__field_knob2);
    this.__hsv_field3.appendChild(this.__field_knob3);

    this.__selector.appendChild(this.__hsv_field);
    this.__selector.appendChild(this.__hsv_field2);
    this.__selector.appendChild(this.__hsv_field3);
    this.__hsv_field.appendChild(this.__hsv_fieldLabel);
    this.__hsv_field2.appendChild(this.__hsv_fieldLabel2);
    this.__hsv_field3.appendChild(this.__hsv_fieldLabel3);
    this.domElement.appendChild(this.__input);
    this.domElement.appendChild(this.__selector);

    this.updateDisplay();


    function setS(e) {
      const fieldRect = _this.__hsv_field.getBoundingClientRect();
      const s = (e.clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      e.preventDefault();
      _this.__color.s = Math.min(Math.max(s, 0), 1);
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setV(e) {
      const fieldRect = _this.__hsv_field.getBoundingClientRect();
      const v = (e.clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      e.preventDefault();
      _this.__color.v = Math.min(Math.max(v, 0), 1);
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      const fieldRect = _this.__hsv_field.getBoundingClientRect();
      const h = (e.clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      e.preventDefault();
      _this.__color.h = Math.min(Math.max(h, 0), 1) * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
  }

  updateDisplay() {
    const i = interpret(this.getValue());

    if (i !== false) {
      let mismatch = false;

      // Check for mismatch on the interpreted value.

      common.each(Color.COMPONENTS, function(component) {
        if (!common.isUndefined(i[component]) && !common.isUndefined(this.__color.__state[component]) &&
          i[component] !== this.__color.__state[component]) {
          mismatch = true;
          return {}; // break
        }
      }, this);

      // If nothing diverges, we keep our previous values
      // for statefulness, otherwise we recalculate fresh
      if (mismatch) {
        common.extend(this.__color.__state, i);
      }
    }

    common.extend(this.__temp.__state, this.__color.__state);

    this.__temp.a = 1;
    this.__temp2.a = 1;

    const flip = (this.__color.v < 0.5 || this.__color.s > 0.5) ? 255 : 0;
    const _flip = 255 - flip;

    common.extend(this.__field_knob.style, {
      marginLeft: (parseInt(this.__color.h / 360 * 256 - 7, 10)) + 'px',
      marginTop: '5px',
      border: this.__field_knob_border + 'rgb(255,255,255)'
    });
    common.extend(this.__field_knob2.style, {
      marginLeft: 256 * this.__color.s - 7 + 'px',
      marginTop: '5px',
      border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
    });
    common.extend(this.__field_knob3.style, {
      marginLeft: 256 * this.__color.v - 7 + 'px',
      marginTop: '5px',
      border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
    });

    this.__hsv_fieldLabel.innerHTML = 'H: ' + parseInt(this.__color.h, 10);
    this.__hsv_fieldLabel2.innerHTML = 'S: ' + parseInt(this.__color.s * 100, 10);
    this.__hsv_fieldLabel3.innerHTML = 'V: ' + parseInt(this.__color.v * 100, 10);

    this.__temp.h = this.__color.h;
    this.__temp.v = this.__color.v;
    this.__temp.s = 1;
    this.__temp2.s = this.__color.s;
    this.__temp2.h = this.__color.h;
    this.__temp2.v = 1;

    linearGradient(this.__hsv_field2, 'left', '#fff', this.__temp.toHexString());
    linearGradient(this.__hsv_field3, 'left', '#000', this.__temp2.toHexString());

    this.__input.value = this.__color.toString();

    common.extend(this.__input.style, {
      backgroundColor: this.__color.toHexString(),
      color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
      textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
    });
  }
}

const vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];

function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  common.each(vendors, function(vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}

function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(right,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(right,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(right,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(right,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(right,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

export default HSVColorController;
