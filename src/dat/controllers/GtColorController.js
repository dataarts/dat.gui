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

class GtColorController extends Controller {


  setValue(newValue) {
    this.object[this.property] = newValue;
    if (this.__onChange) {
      this.__onChange.call(this, newValue);
    }
    this.updateDisplay();
    return this;
  }
  setValue2(newValue) {
    this.value2 = newValue;
    if (this.object[this.property + 'bg']) {
      this.object[this.property + 'bg'] = this.value2;
    }
    if (this.__onChange) {
      this.__onChange.call(this, newValue);
    }
    this.updateDisplay();
    return this;
  }

  getValue() {
    return this.object[this.property];
  }

  constructor(object, property) {
    super(object, property);

    this.__color = new Color(this.getValue());
    this.value2 = '#FFee00';
    if (this.object[this.property + 'bg']) {
      this.value2 = this.object[this.property + 'bg'];
    }
    this.__color2 = new Color(this.value2);

    this.__temp = new Color(0);
    this.__temp2 = new Color(0);

    const _this = this;

    this.domElement = document.createElement('div');

    dom.makeSelectable(this.domElement, false);

    this.__selector = document.createElement('div');
    /* this.__selector.className = 'selector'; */

    this.__saturation_field = document.createElement('div');
    this.__saturation_field.className = 'saturation-field';
    this.__saturation_field2 = document.createElement('div');
    this.__saturation_field2.className = 'saturation-field';

    this.__field_knob = document.createElement('div');
    this.__field_knob.className = 'field-knob';
    this.__field_knob_border = '2px solid ';
    this.__field_knob2 = document.createElement('div');
    this.__field_knob2.className = 'field-knob';
    this.__field_knob_border2 = '2px solid ';

    this.__hue_knob = document.createElement('div');
    this.__hue_knob.className = 'hue-knob';
    this.__hue_knob2 = document.createElement('div');
    this.__hue_knob2.className = 'hue-knob';

    this.__hue_field = document.createElement('div');
    this.__hue_field.className = 'hue-field';
    this.__hue_field2 = document.createElement('div');
    this.__hue_field2.className = 'hue-field';

    this.__input = document.createElement('input');
    this.__input.type = 'text';
    this.__input_textShadow = '0 1px 1px ';
    this.__input2 = document.createElement('input');
    this.__input2.type = 'text';
    this.__input_textShadow2 = '0 1px 1px ';

    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) { // on enter
        onBlur.call(this);
      }
    });
    dom.bind(this.__input2, 'keydown', function(e) {
      if (e.keyCode === 13) { // on enter
        onBlur2.call(this);
      }
    });

    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input2, 'blur', onBlur2);

    /*
    dom.bind(this.__selector, 'mousedown', function( ) {
      dom
        .addClass(this, 'drag')
        .bind(window, 'mouseup', function( ) {
          dom.removeClass(_this.__selector, 'drag');
        });
    });
    */

    const valueField = document.createElement('div');
    const valueField2 = document.createElement('div');

    common.extend(this.__selector.style, {
      width: '200px',
      height: '102px',
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
      zIndex: 1
    });
    common.extend(this.__field_knob2.style, {
      position: 'absolute',
      left: '100',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border2 + (this.__color2.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });

    common.extend(this.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      left: '-15px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    common.extend(this.__hue_knob2.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      left: '9px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });

    common.extend(this.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    common.extend(this.__saturation_field2.style, {
      left: '100px',
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      position: 'absolute',
      top: '22px',
      cursor: 'pointer'
    });

    common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    common.extend(valueField2.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });

    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    linearGradient(valueField2, 'top', 'rgba(0,0,0,0)', '#000');

    common.extend(this.__hue_field.style, {
      width: '20px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      marginTop: '19px',
      left: '-20px'
    });
    common.extend(this.__hue_field2.style, {
      width: '20px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      marginTop: '19px',
      left: '200px'
    });

    hueGradient(this.__hue_field);
    hueGradient(this.__hue_field2);

    common.extend(this.__input.style, {
      outline: 'none',
//      width: '120px',
      textAlign: 'center',
//      padding: '4px',
        //      marginBottom: '6px',

      color: '#fff',
      border: 0,
      left: '-20px',
      position: 'absolute',
      fontWeight: 'bold',
      width: '120px',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    common.extend(this.__input2.style, {
      outline: 'none',
//      width: '120px',
      textAlign: 'center',
//      padding: '4px',
        //      marginBottom: '6px',

      color: '#fff',
      border: 0,
      left: '100px',
      position: 'absolute',
      fontWeight: 'bold',
      width: '120px',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });

    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
    dom.bind(this.__saturation_field2, 'mousedown', fieldDown2);
    dom.bind(this.__field_knob, 'mousedown', fieldDown);
    dom.bind(this.__field_knob2, 'mousedown', fieldDown2);

    dom.bind(this.__hue_field, 'mousedown', function(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
    });
    dom.bind(this.__hue_field2, 'mousedown', function(e) {
      setH2(e);
      dom.bind(window, 'mousemove', setH2);
      dom.bind(window, 'mouseup', fieldUpH2);
    });

    function fieldDown(e) {
      setSV(e);
      // document.body.style.cursor = 'none';
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
    }
    function fieldDown2(e) {
      setSV2(e);
      // document.body.style.cursor = 'none';
      dom.bind(window, 'mousemove', setSV2);
      dom.bind(window, 'mouseup', fieldUpSV2);
    }

    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      // document.body.style.cursor = 'default';
      onFinish();
    }
    function fieldUpSV2() {
      dom.unbind(window, 'mousemove', setSV2);
      dom.unbind(window, 'mouseup', fieldUpSV2);
      // document.body.style.cursor = 'default';
      onFinish2();
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
    function onBlur2() {
      const i = interpret(this.value);
      if (i !== false) {
        _this.__color2.__state = i;
        _this.setValue2(_this.__color2.toOriginal());
      } else {
        this.value = _this.__color2.toString();
      }
    }

    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      onFinish();
    }
    function fieldUpH2() {
      dom.unbind(window, 'mousemove', setH2);
      dom.unbind(window, 'mouseup', fieldUpH2);
      onFinish2();
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color2.toOriginal());
      }
    }
    function onFinish2() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }

    this.__saturation_field.appendChild(valueField);
    this.__selector.appendChild(this.__field_knob);
    this.__selector.appendChild(this.__field_knob2);
    this.__selector.appendChild(this.__saturation_field);

    this.__saturation_field2.appendChild(valueField2);
    this.__selector.appendChild(this.__saturation_field2);

    this.__selector.appendChild(this.__hue_field);
    this.__hue_field.appendChild(this.__hue_knob);
    this.__hue_field2.appendChild(this.__hue_knob2);
    this.__selector.appendChild(this.__hue_field2);

    this.domElement.appendChild(this.__input2);
    this.domElement.appendChild(this.__input);

    this.domElement.appendChild(this.__selector);

    this.updateDisplay();

    function setSV2(e) {
      e.preventDefault();

      const fieldRect = _this.__saturation_field2.getBoundingClientRect();
      let s = (e.clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      let v = 1 - (e.clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }

      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }

      _this.__color2.v = v;
      _this.__color2.s = s;

      _this.setValue2(_this.__color2.toOriginal());


      return false;
    }
    function setSV(e) {
      e.preventDefault();

      const fieldRect = _this.__saturation_field.getBoundingClientRect();
      let s = (e.clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      let v = 1 - (e.clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }

      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());


      return false;
    }

    function setH2(e) {
      e.preventDefault();

      const fieldRect = _this.__hue_field2.getBoundingClientRect();
      let h = 1 - (e.clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }

      _this.__color2.h = h * 360;

      _this.setValue2(_this.__color2.toOriginal());

      return false;
    }
    function setH(e) {
      e.preventDefault();

      const fieldRect = _this.__hue_field.getBoundingClientRect();
      let h = 1 - (e.clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }

      _this.__color.h = h * 360;

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
    common.extend(this.__temp2.__state, this.__color2.__state);

    this.__temp.a = 1;
    this.__temp2.a = 1;

    const flip = (this.__color.v < 0.5 || this.__color.s > 0.5) ? 255 : 0;
    const _flip = 255 - flip;
    const flip2 = (this.__color2.v < 0.5 || this.__color2.s > 0.5) ? 255 : 0;
    const _flip2 = 255 - flip2;

    common.extend(this.__field_knob.style, {
      marginLeft: 100 * this.__color.s - 7 + 'px',
      marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
      backgroundColor: this.__temp.toHexString(),
      border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
    });
    common.extend(this.__field_knob2.style, {
      marginLeft: 100 * this.__color2.s - 7 + 'px',
      marginTop: 100 * (1 - this.__color2.v) - 7 + 'px',
      backgroundColor: this.__temp2.toHexString(),
      border: this.__field_knob_border2 + 'rgb(' + flip2 + ',' + flip2 + ',' + flip2 + ')'
    });

    this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
    this.__hue_knob2.style.marginTop = (1 - this.__color2.h / 360) * 100 + 'px';

    this.__temp.s = 1;
    this.__temp.v = 1;
    this.__temp2.s = 1;
    this.__temp2.v = 1;

    linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
    linearGradient(this.__saturation_field2, 'left', '#fff', this.__temp2.toHexString());

    this.__input.value = this.__color.toString();
    this.__input2.value = this.__color2.toString();

    common.extend(this.__input.style, {
      backgroundColor: this.__color.toHexString(),
      color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
      textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
    });
    common.extend(this.__input2.style, {
      backgroundColor: this.__color2.toHexString(),
      color: 'rgb(' + flip2 + ',' + flip2 + ',' + flip2 + ')',
      textShadow: this.__input_textShadow + 'rgba(' + _flip2 + ',' + _flip2 + ',' + _flip2 + ',.7)'
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
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

export default GtColorController;
