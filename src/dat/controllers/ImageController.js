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

import Controller from './Controller';
import dom from '../dom/dom';
import common from '../utils/common';

/**
 * @class Represents a image loaded throught its path, contains
 * the preview to the image path. Another image can be loaded by
 * clicking or dragging another image in the preview.
 *
 * @extends dat.controllers.Controller
 *
 * @param {Object} object The object to be manipulated
 * @param {string} property The name of the property to be manipulated
 */
class ImageController extends Controller {
  constructor(object, property) {
    super(object, property);

    this.__fileReader = new FileReader();

    const _this = this;

    this.__image = document.createElement('img');
    this.__imagePreview = document.createElement('img');
    this.__input = document.createElement('input');

    common.extend(this.__imagePreview.style, {
      display: 'block',
      width: 'calc(100% + 5px)',
      padding: '4px 0',
      marginLeft: '-5px'
    });

    common.extend(this.__input.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      opacity: '0',
      cursor: 'pointer',
    });

    dom.bind(this.__image, 'load', imageLoaded);
    dom.bind(this.__input, 'change', fileUploaded);
    dom.bind(this.__fileReader, 'loadend', fileLoaded);

    function imageLoaded() {
      _this.__imagePreview.src = _this.__image.src;

      if (_this.__onChange) {
        _this.__onChange.call(_this, _this.__image);
      }
    }

    function fileUploaded() {
      const file = _this.__input.files[0];
      if (!file) {
        return;
      }
      _this.__fileReader.readAsDataURL(file);
    }

    function fileLoaded() {
      _this.__image.src = _this.__fileReader.result;
    }

    this.__image.src = object[property];
    this.__imagePreview.src = object[property];
    this.__input.type = 'file';

    this.domElement.appendChild(this.__imagePreview);
    this.domElement.appendChild(this.__input);
  }

  updateDisplay() {
    if (this.isModified()) {
      const newValue = this.getValue();
      this.__image.src = newValue;
      this.initialValue = newValue;
    }
    return super.updateDisplay();
  }
}

export default ImageController;
