/**
 * dat.gui Javascript Controller Library
 * http://dataarts.github.com/dat.gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var DAT = DAT || {};

DAT.GUI = function(parameters) {

  if (parameters == undefined) {
    parameters = {};
  }


  var paramsExplicitHeight = false;
  if (parameters.height == undefined) {
    parameters.height = 300;
  } else {
    paramsExplicitHeight = true;
  }

  var MIN_WIDTH = 240;
  var MAX_WIDTH = 500;

  var controllers = [];
  var listening = [];

  var autoListen = true;

  var listenInterval;

  // Sum total of heights of controllers in this gui
  var controllerHeight;

  var _this = this;

  var open = true;
  
  var width = 280;
  if (parameters.width != undefined) {
  	width = parameters.width;
  }

  // Prevents checkForOverflow bug in which loaded gui appearance
  // settings are not respected by presence of scrollbar.
  var explicitOpenHeight = false;

  // How big we get when we open
  var openHeight;

  var closeString = 'Close Controls';
  var openString = 'Open Controls';

  var name;

  var resizeTo = 0;
  var resizeTimeout;

  this.domElement = document.createElement('div');
  this.domElement.setAttribute('class', 'guidat');
  this.domElement.style.width = width + 'px';

  var curControllerContainerHeight = parameters.height;
  var controllerContainer = document.createElement('div');
  controllerContainer.setAttribute('class', 'guidat-controllers');
  controllerContainer.style.height = curControllerContainerHeight + 'px';

  // Firefox hack to prevent horizontal scrolling
  controllerContainer.addEventListener('DOMMouseScroll', function(e) {

    var scrollAmount = this.scrollTop;

    if (e.wheelDelta) {
      scrollAmount += e.wheelDelta;
    } else if (e.detail) {
      scrollAmount += e.detail;
    }

    if (e.preventDefault) {
      e.preventDefault();
    }

    e.returnValue = false;

    controllerContainer.scrollTop = scrollAmount;

  }, false);


  var toggleButton = document.createElement('a');
  toggleButton.setAttribute('class', 'guidat-toggle');
  toggleButton.setAttribute('href', '#');
  toggleButton.innerHTML = open ? closeString : openString;

  var toggleDragged = false;
  var dragDisplacementY = 0;
  var dragDisplacementX = 0;
  var togglePressed = false;

  var my, pmy, mx, pmx;

  var resize = function(e) {
    pmy = my;
    pmx = mx;
    my = e.pageY;
    mx = e.pageX;

    var dmy = my - pmy;

    if (!open) {
      if (dmy > 0) {
        open = true;
        curControllerContainerHeight = openHeight = 1;
        toggleButton.innerHTML = name || closeString;
      } else {
        return;
      }
    }

    // TODO: Flip this if you want to resize to the left.
    var dmx = pmx - mx;

    if (dmy > 0 &&
        curControllerContainerHeight > controllerHeight) {
      var d = DAT.GUI.map(curControllerContainerHeight, controllerHeight,
          controllerHeight + 100, 1, 0);
      dmy *= d;
    }

    toggleDragged = true;

    dragDisplacementY += dmy;
    openHeight += dmy;
    curControllerContainerHeight += dmy;
    controllerContainer.style.height = openHeight + 'px';

    dragDisplacementX += dmx;
    width += dmx;
    width = DAT.GUI.constrain(width, MIN_WIDTH, MAX_WIDTH);
    _this.domElement.style.width = width + 'px';

    checkForOverflow();

  };

  toggleButton.addEventListener('mousedown', function(e) {
    pmy = my = e.pageY;
    pmx = mx = e.pageX;
    togglePressed = true;
    e.preventDefault();
    dragDisplacementX = 0;
    dragDisplacementY = 0;
    document.addEventListener('mousemove', resize, false);
    return false;

  }, false);

  toggleButton.addEventListener('click', function(e) {
    e.preventDefault();
    return false;
  }, false);

  document.addEventListener('mouseup', function(e) {

    if (togglePressed && !toggleDragged) {
      _this.toggle();
    }

    if (togglePressed && toggleDragged) {

      if (dragDisplacementX == 0) {
        adaptToScrollbar();
      }

      if (openHeight > controllerHeight) {

        clearTimeout(resizeTimeout);
        openHeight = resizeTo = controllerHeight;
        beginResize();

      } else if (controllerContainer.children.length >= 1) {

        var singleControllerHeight = controllerContainer.children[0].
            offsetHeight;
        clearTimeout(resizeTimeout);
        var target = Math.round(curControllerContainerHeight /
            singleControllerHeight) * singleControllerHeight - 1;
        resizeTo = target;
        if (resizeTo <= 0) {
          _this.close();
          openHeight = singleControllerHeight * 2;
        } else {
          openHeight = resizeTo;
          beginResize();
        }
      }
    }

    document.removeEventListener('mousemove', resize, false);
    e.preventDefault();
    toggleDragged = false;
    togglePressed = false;

    return false;

  }, false);

  this.domElement.appendChild(controllerContainer);
  this.domElement.appendChild(toggleButton);

  if (parameters.domElement) {
    parameters.domElement.appendChild(this.domElement);
  } else if (DAT.GUI.autoPlace) {
    if (DAT.GUI.autoPlaceContainer == null) {
      DAT.GUI.autoPlaceContainer = document.createElement('div');
      DAT.GUI.autoPlaceContainer.setAttribute('id', 'guidat');

      document.body.appendChild(DAT.GUI.autoPlaceContainer);
    }
    DAT.GUI.autoPlaceContainer.appendChild(this.domElement);
  }

  this.autoListenIntervalTime = 1000 / 60;

  var createListenInterval = function() {
    listenInterval = setInterval(function() {
      _this.listen();
    }, this.autoListenIntervalTime);
  };

  this.__defineSetter__('autoListen', function(v) {
    autoListen = v;
    if (!autoListen) {
      clearInterval(listenInterval);
    } else {
      if (listening.length > 0) createListenInterval();
    }
  });

  this.__defineGetter__('autoListen', function(v) {
    return autoListen;
  });

  this.listenTo = function(controller) {
    // TODO: check for duplicates
    if (listening.length == 0) {
      createListenInterval();
    }
    listening.push(controller);
  };

  this.unlistenTo = function(controller) {
    // TODO: test this
    for (var i = 0; i < listening.length; i++) {
      if (listening[i] == controller) listening.splice(i, 1);
    }
    if (listening.length <= 0) {
      clearInterval(listenInterval);
    }
  };

  this.listen = function(whoToListenTo) {
    var arr = whoToListenTo || listening;
    for (var i in arr) {
      arr[i].updateDisplay();
    }
  };

  this.listenAll = function() {
    this.listen(controllers);
  }

  this.autoListen = true;

  var alreadyControlled = function(object, propertyName) {
    for (var i in controllers) {
      if (controllers[i].object == object &&
          controllers[i].propertyName == propertyName) {
        return true;
      }
    }
    return false;
  };

  var construct = function(constructor, args) {
    function C() {
      return constructor.apply(this, args);
    }

    C.prototype = constructor.prototype;
    return new C();
  };

  this.add = function() {


    if (arguments.length == 1) {
      var toReturn = [];
      for (var i in arguments[0]) {
        toReturn.push(_this.add(arguments[0], i));
      }
      return toReturn;
    }

    var object = arguments[0];
    var propertyName = arguments[1];

    // Have we already added this?
    if (alreadyControlled(object, propertyName)) {
      //  DAT.GUI.error('Controller for \'' + propertyName+'\' already added.');
      //  return;
    }

    var value = object[propertyName];

    // Does this value exist? Is it accessible?
    if (value == undefined) {
      DAT.GUI.error(object + ' either has no property \'' + propertyName +
          '\', or the property is inaccessible.');
      return;
    }

    var type = typeof value;
    var handler = handlerTypes[type];

    // Do we know how to deal with this data type?
    if (handler == undefined) {
      DAT.GUI.error('Cannot create controller for data type \'' + type + '\'');
      return;
    }

    var args = [this]; // Set first arg (parent) to this 
    for (var j = 0; j < arguments.length; j++) {
      args.push(arguments[j]);
    }

    var controllerObject = construct(handler, args);

    // Were we able to make the controller?
    if (!controllerObject) {
      DAT.GUI.error('Error creating controller for \'' + propertyName + '\'.');
      return;
    }

    // Success.
    controllerContainer.appendChild(controllerObject.domElement);
    controllers.push(controllerObject);
    DAT.GUI.allControllers.push(controllerObject);

    // Do we have a saved value for this controller?
    if (type != 'function' &&
        DAT.GUI.saveIndex < DAT.GUI.savedValues.length) {
      controllerObject.setValue(DAT.GUI.savedValues[DAT.GUI.saveIndex]);
      DAT.GUI.saveIndex++;
    }

    // Compute sum height of controllers.
    checkForOverflow();

    // Prevents checkForOverflow bug in which loaded gui appearance
    // settings are not respected by presence of scrollbar.
    if (!explicitOpenHeight) {
      openHeight = controllerHeight;
    }

    // Let's see if we're doing this on onload and lets *try* to guess how
    // big you want the damned box.
    if (!paramsExplicitHeight) {
      try {

        // Probably a better way to do this
        var caller = arguments.callee.caller;

        if (caller == window['onload']) {
          curControllerContainerHeight = resizeTo = openHeight =
              controllerHeight;
          controllerContainer.style.height = curControllerContainerHeight + 'px';
        }

      } catch (e) {}
    }


    return controllerObject;

  }

  var checkForOverflow = function() {
    controllerHeight = 0;
    for (var i in controllers) {
      controllerHeight += controllers[i].domElement.offsetHeight;
    }
    if (controllerHeight - 1 > openHeight) {
      controllerContainer.style.overflowY = 'auto';
    } else {
      controllerContainer.style.overflowY = 'hidden';
    }
  };

  var handlerTypes = {
    'number': DAT.GUI.ControllerNumber,
    'string': DAT.GUI.ControllerString,
    'boolean': DAT.GUI.ControllerBoolean,
    'function': DAT.GUI.ControllerFunction
  };

  this.reset = function() {
    // TODO ... Set all values back to their initials.
  }

  this.toggle = function() {
    open ? this.close() : this.open();
  };

  this.open = function() {
    toggleButton.innerHTML = name || closeString;
    resizeTo = openHeight;
    clearTimeout(resizeTimeout);
    beginResize();
    adaptToScrollbar();
    open = true;
  }

  this.close = function() {
    toggleButton.innerHTML = name || openString;
    resizeTo = 0;
    clearTimeout(resizeTimeout);
    beginResize();
    adaptToScrollbar();
    open = false;
  }

  this.name = function(n) {
    name = n;
    toggleButton.innerHTML = n;
  }

  // used in saveURL
  this.appearanceVars = function() {
    return [open, width, openHeight, controllerContainer.scrollTop]
  }

  var beginResize = function() {

    curControllerContainerHeight = controllerContainer.offsetHeight;
    curControllerContainerHeight += (resizeTo - curControllerContainerHeight)
        * 0.6;

    if (Math.abs(curControllerContainerHeight - resizeTo) < 1) {
      curControllerContainerHeight = resizeTo;
    } else {
      resizeTimeout = setTimeout(beginResize, 1000 / 30);
    }
    controllerContainer.style.height = Math.round(curControllerContainerHeight)
        + 'px';
    checkForOverflow();

  }

  var adaptToScrollbar = function() {
    // Clears lingering scrollbar column
    _this.domElement.style.width = (width - 1) + 'px';
    setTimeout(function() {
      _this.domElement.style.width = width + 'px';
    }, 1);
  };


  // Load saved appearance:

  if (DAT.GUI.guiIndex < DAT.GUI.savedAppearanceVars.length) {

    width = parseInt(DAT.GUI.savedAppearanceVars[DAT.GUI.guiIndex][1]);
    _this.domElement.style.width = width + 'px';

    openHeight = parseInt(DAT.GUI.savedAppearanceVars[DAT.GUI.guiIndex][2]);
    explicitOpenHeight = true;
    if (eval(DAT.GUI.savedAppearanceVars[DAT.GUI.guiIndex][0]) == true) {
      curControllerContainerHeight = openHeight;
      var t = DAT.GUI.savedAppearanceVars[DAT.GUI.guiIndex][3]

      // Hack.
      setTimeout(function() {
        controllerContainer.scrollTop = t;
      }, 0);

      if (DAT.GUI.scrollTop > -1) {
        document.body.scrollTop = DAT.GUI.scrollTop;
      }
      resizeTo = openHeight;
      this.open();
    }

    DAT.GUI.guiIndex++;
  }

  DAT.GUI.allGuis.push(this);

  // Add hide listener if this is the first DAT.GUI.

  if (DAT.GUI.allGuis.length == 1) {

    window.addEventListener('keyup', function(e) {
      // Hide on 'H'
      if (!DAT.GUI.supressHotKeys && e.keyCode == 72) {
        DAT.GUI.toggleHide();
      }
    }, false);

    if (DAT.GUI.inlineCSS) {
      var styleSheet = document.createElement('style');
      styleSheet.setAttribute('type', 'text/css');
      styleSheet.innerHTML = DAT.GUI.inlineCSS;
      document.head.insertBefore(styleSheet, document.head.firstChild);
    }

  }

};

// Do not set this directly.
DAT.GUI.hidden = false;

// Static members

DAT.GUI.autoPlace = true;
DAT.GUI.autoPlaceContainer = null;
DAT.GUI.allControllers = [];
DAT.GUI.allGuis = [];

DAT.GUI.supressHotKeys = false;

DAT.GUI.toggleHide = function() {
  if (DAT.GUI.hidden) {
    DAT.GUI.open();
  } else {
    DAT.GUI.close();
  }
}

DAT.GUI.open = function() {
  DAT.GUI.hidden = false;
  for (var i in DAT.GUI.allGuis) {
    DAT.GUI.allGuis[i].domElement.style.display = 'block';
  }
}

DAT.GUI.close = function() {
  DAT.GUI.hidden = true;
  for (var i in DAT.GUI.allGuis) {
    DAT.GUI.allGuis[i].domElement.style.display = 'none';
  }
}

DAT.GUI.saveURL = function() {
  var url = DAT.GUI.replaceGetVar('saveString', DAT.GUI.getSaveString());
  window.location = url;
};

DAT.GUI.scrollTop = -1;

DAT.GUI.load = function(saveString) {

  //DAT.GUI.savedAppearanceVars = [];
  var vals = saveString.split(',');
  var numGuis = parseInt(vals[0]);
  DAT.GUI.scrollTop = parseInt(vals[1]);
  for (var i = 0; i < numGuis; i++) {
    var appr = vals.splice(2, 4);
    DAT.GUI.savedAppearanceVars.push(appr);
  }

  DAT.GUI.savedValues = vals.splice(2, vals.length);

};

DAT.GUI.savedValues = [];
DAT.GUI.savedAppearanceVars = [];

DAT.GUI.getSaveString = function() {

  var vals = [], i;

  vals.push(DAT.GUI.allGuis.length);
  vals.push(document.body.scrollTop);


  for (i in DAT.GUI.allGuis) {
    var av = DAT.GUI.allGuis[i].appearanceVars();
    for (var j = 0; j < av.length; j++) {
      vals.push(av[j]);
    }
  }

  for (i in DAT.GUI.allControllers) {

    // We don't save values for functions.
    if (DAT.GUI.allControllers[i].type == 'function') {
      continue;
    }

    var v = DAT.GUI.allControllers[i].getValue();

    // Round numbers so they don't get enormous
    if (DAT.GUI.allControllers[i].type == 'number') {
      v = DAT.GUI.roundToDecimal(v, 4);
    }

    vals.push(v);

  }

  return vals.join(',');

};

DAT.GUI.getVarFromURL = function(v) {

  var vars = [], hash;
  var hashes = window.location.href.slice(
      window.location.href.indexOf('?') + 1).split('&');

  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    if (hash == undefined) continue;
    if (hash[0] == v) {
      return hash[1];
    }
  }

  return null;

};

DAT.GUI.replaceGetVar = function(varName, val) {

  var vars = [], hash;
  var loc = window.location.href;
  var hashes = window.location.href.slice(
      window.location.href.indexOf('?') + 1).split('&');

  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    if (hash == undefined) continue;
    if (hash[0] == varName) {
      return loc.replace(hash[1], val);
    }
  }

  if (window.location.href.indexOf('?') != -1) {
    return loc + '&' + varName + '=' + val;
  }

  return loc + '?' + varName + '=' + val;

};

DAT.GUI.saveIndex = 0;
DAT.GUI.guiIndex = 0;

DAT.GUI.showSaveString = function() {
  alert(DAT.GUI.getSaveString());
};

// Util functions

DAT.GUI.makeUnselectable = function(elem) {
  if (elem == undefined || elem.style == undefined) return;
  elem.onselectstart = function() {
    return false;
  };
  elem.style.MozUserSelect = 'none';
  elem.style.KhtmlUserSelect = 'none';
  elem.unselectable = 'on';

  var kids = elem.childNodes;
  for (var i = 0; i < kids.length; i++) {
    DAT.GUI.makeUnselectable(kids[i]);
  }

};

DAT.GUI.makeSelectable = function(elem) {
  if (elem == undefined || elem.style == undefined) return;
  elem.onselectstart = function() {
  };
  elem.style.MozUserSelect = 'auto';
  elem.style.KhtmlUserSelect = 'auto';
  elem.unselectable = 'off';

  var kids = elem.childNodes;
  for (var i = 0; i < kids.length; i++) {
    DAT.GUI.makeSelectable(kids[i]);
  }

};

DAT.GUI.map = function(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
};

DAT.GUI.constrain = function (v, o1, o2) {
  if (v < o1) v = o1;
  else if (v > o2) v = o2;
  return v;
};

DAT.GUI.error = function(str) {
  if (typeof console.error == 'function') {
    console.error('[DAT.GUI ERROR] ' + str);
  }
};

DAT.GUI.roundToDecimal = function(n, decimals) {
  var t = Math.pow(10, decimals);
  return Math.round(n * t) / t;
};

DAT.GUI.extendController = function(clazz) {
  clazz.prototype = new DAT.GUI.Controller();
  clazz.prototype.constructor = clazz;
};

DAT.GUI.addClass = function(domElement, className) {
  if (DAT.GUI.hasClass(domElement, className)) return;
  domElement.className += ' ' + className;
}

DAT.GUI.hasClass = function(domElement, className) {
  return domElement.className.indexOf(className) != -1;
}

DAT.GUI.removeClass = function(domElement, className) {
  var reg = new RegExp(' ' + className, 'g');
  domElement.className = domElement.className.replace(reg, '');
}

if (DAT.GUI.getVarFromURL('saveString') != null) {
  DAT.GUI.load(DAT.GUI.getVarFromURL('saveString'));
}
DAT.GUI.Controller = function() {

  this.parent = arguments[0];
  this.object = arguments[1];
  this.propertyName = arguments[2];

  if (arguments.length > 0) this.initialValue = this.propertyName[this.object];

  this.domElement = document.createElement('div');
  this.domElement.setAttribute('class', 'guidat-controller ' + this.type);

  this.propertyNameElement = document.createElement('span');
  this.propertyNameElement.setAttribute('class', 'guidat-propertyname');
  this.name(this.propertyName);
  this.domElement.appendChild(this.propertyNameElement);

  DAT.GUI.makeUnselectable(this.domElement);

};

DAT.GUI.Controller.prototype.changeFunction = null;
DAT.GUI.Controller.prototype.finishChangeFunction = null;

DAT.GUI.Controller.prototype.name = function(n) {
  this.propertyNameElement.innerHTML = n;
  return this;
};

DAT.GUI.Controller.prototype.reset = function() {
  this.setValue(this.initialValue);
  return this;
};

DAT.GUI.Controller.prototype.listen = function() {
  this.parent.listenTo(this);
  return this;
};

DAT.GUI.Controller.prototype.unlisten = function() {
  this.parent.unlistenTo(this); // <--- hasn't been tested yet
  return this;
};

DAT.GUI.Controller.prototype.setValue = function(n) {
  this.object[this.propertyName] = n;
  if (this.changeFunction != null) {
    this.changeFunction.call(this, n);
  }
  this.updateDisplay();
  return this;
};

DAT.GUI.Controller.prototype.getValue = function() {
  return this.object[this.propertyName];
};

DAT.GUI.Controller.prototype.updateDisplay = function() {
  
};

DAT.GUI.Controller.prototype.onChange = function(fnc) {
  this.changeFunction = fnc;
  return this;
};

DAT.GUI.Controller.prototype.onFinishChange = function(fnc) {
  this.finishChangeFunction = fnc;
  return this;
};

DAT.GUI.Controller.prototype.options = function() {
  var _this = this;
  var select = document.createElement('select');
  if (arguments.length == 1) {
    var arr = arguments[0];
    for (var i in arr) {
      var opt = document.createElement('option');
      opt.innerHTML = i;
      opt.setAttribute('value', arr[i]);
      if (arguments[i] == this.getValue()) {
        opt.selected = true;
      }
      select.appendChild(opt);
    }
  } else {
    for (var i = 0; i < arguments.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = arguments[i];
      opt.setAttribute('value', arguments[i]);
      if (arguments[i] == this.getValue()) {
        opt.selected = true;
      }
      select.appendChild(opt);
    }
  }

  select.addEventListener('change', function() {
    _this.setValue(this.value);
    if (_this.finishChangeFunction != null) {
      _this.finishChangeFunction.call(this, _this.getValue());
    }
  }, false);
  _this.domElement.appendChild(select);
  return this;
};

DAT.GUI.ControllerBoolean = function() {

  this.type = "boolean";
  DAT.GUI.Controller.apply(this, arguments);

  var _this = this;
  var input = document.createElement('input');
  input.setAttribute('type', 'checkbox');

  input.checked = this.getValue();
  this.setValue(this.getValue());

  this.domElement.addEventListener('click', function(e) {
    input.checked = !input.checked;
    e.preventDefault();
    _this.setValue(input.checked);
  }, false);

  input.addEventListener('mouseup', function(e) {
    input.checked = !input.checked; // counteracts default.
  }, false);

  this.domElement.style.cursor = "pointer";
  this.propertyNameElement.style.cursor = "pointer";
  this.domElement.appendChild(input);

  this.updateDisplay = function() {
    input.checked = _this.getValue();
  };


  this.setValue = function(val) {
    if (typeof val != "boolean") {
      try {
        val = eval(val);
      } catch (e) {
      }
    }
    return DAT.GUI.Controller.prototype.setValue.call(this, val);
  };

};
DAT.GUI.extendController(DAT.GUI.ControllerBoolean);

DAT.GUI.ControllerFunction = function() {

  this.type = "function";

  var _this = this;

  DAT.GUI.Controller.apply(this, arguments);

  this.domElement.addEventListener('click', function() {
    _this.fire();
  }, false);

  this.domElement.style.cursor = "pointer";
  this.propertyNameElement.style.cursor = "pointer";

  var fireFunction = null;
  this.onFire = function(fnc) {
    fireFunction = fnc;
    return this;
  }

  this.fire = function() {
    if (fireFunction != null) {
      fireFunction.call(this);
    }
    _this.object[_this.propertyName].call(_this.object);
  };

};
DAT.GUI.extendController(DAT.GUI.ControllerFunction);

DAT.GUI.ControllerNumber = function() {

  this.type = "number";

  DAT.GUI.Controller.apply(this, arguments);

  var _this = this;

  // If we simply click and release a number field, we want to highlight it.
  // This variable keeps track of whether or not we've dragged
  var draggedNumberField = false;
  
  var clickedNumberField = false;
  var draggingHorizontal = false;
  var draggingVertical = false;

  var y = 0, py = 0;

  var min = arguments[3];
  var max = arguments[4];
  var step = arguments[5];

  var defaultStep = function() {
      step = (max - min) * 0.01;
  };

  this.min = function() {
    var needsSlider = false;
    if (min == undefined && max != undefined) {
      needsSlider = true;
    }
    if (arguments.length == 0) {
      return min;
    } else {
      min = arguments[0];
    }
    if (needsSlider) {
      addSlider();
      if (step == undefined) {
        defaultStep();
      }
    }
    return _this;
  };

  this.max = function() {
    var needsSlider = false;
    if (min != undefined && max == undefined) {
      needsSlider = true;
    }
    if (arguments.length == 0) {
      return max;
    } else {
      max = arguments[0];
    }
    if (needsSlider) {
      addSlider();
      if (step == undefined) { 
        defaultStep();
      }
    }
    return _this;
  };

  this.step = function() {
    if (arguments.length == 0) {
      return step;
    } else {
      step = arguments[0];
    }
    return _this;
  };

  this.getMin = function() {
    return min;
  };

  this.getMax = function() {
    return max;
  };
  
  this.getStep = function() {
    if (step == undefined) {
      if (max != undefined && min != undefined) {
        return (max-min)/100;
      } else {
        return 1;
      }
    } else {
      return step;
    }
  }

  var numberField = document.createElement('input');
  numberField.setAttribute('id', this.propertyName);
  numberField.setAttribute('type', 'text');
  numberField.setAttribute('value', this.getValue());

  if (step) numberField.setAttribute('step', step);

  this.domElement.appendChild(numberField);

  var slider;

  var addSlider = function() {
    slider = new DAT.GUI.ControllerNumberSlider(_this, min, max, step, _this.getValue());
    _this.domElement.appendChild(slider.domElement);
  };

  if (min != undefined && max != undefined) {
    addSlider();
  }

  numberField.addEventListener('blur', function() {
    var val = parseFloat(this.value);
    if (slider) {
      DAT.GUI.removeClass(_this.domElement, 'active');
    }
    if (!isNaN(val)) {
      _this.setValue(val);
    }
  }, false);


  numberField.addEventListener('mousewheel', function(e) {
    e.preventDefault();
    _this.setValue(_this.getValue() + Math.abs(e.wheelDeltaY) / e.wheelDeltaY * _this.getStep());
    return false;
  }, false);

  numberField.addEventListener('mousedown', function(e) {
    py = y = e.pageY;
    clickedNumberField = true;
    DAT.GUI.makeSelectable(numberField);
    document.addEventListener('mousemove', dragNumberField, false);
    document.addEventListener('mouseup', mouseup, false);
  }, false);

  // Handle up arrow and down arrow
  numberField.addEventListener('keydown', function(e) {
    var newVal;
    switch (e.keyCode) {
      case 13:    // enter
        newVal = parseFloat(this.value);
        _this.setValue(newVal);
        break;
      case 38:    // up
        newVal = _this.getValue() + _this.getStep();
        _this.setValue(newVal);
        break;
      case 40:    // down
        newVal = _this.getValue() - _this.getStep();
        _this.setValue(newVal);
        break;
    }
  }, false);

  var mouseup = function(e) {
    document.removeEventListener('mousemove', dragNumberField, false);
    
    DAT.GUI.makeSelectable(numberField);
    if (clickedNumberField && !draggedNumberField) {
      //numberField.focus();
      //numberField.select();
    }
    draggedNumberField = false;
    clickedNumberField = false;
    if (_this.finishChangeFunction != null) {
      _this.finishChangeFunction.call(this, _this.getValue());
    }
    draggingHorizontal = false;
    draggingVertical = false;
    document.removeEventListener('mouseup', mouseup, false);
  };

  var dragNumberField = function(e) {

    py = y;
    y = e.pageY;
    var dy = py - y;

    

    if (!draggingHorizontal && !draggingVertical) {
      if (dy == 0) {
        draggingHorizontal = true;
      } else {
        draggingVertical = true;
      }
    }

    if (draggingHorizontal) {
      return true;
    }

    DAT.GUI.addClass(_this.domElement, 'active');

    DAT.GUI.makeUnselectable(_this.parent.domElement);
    DAT.GUI.makeUnselectable(numberField);

    draggedNumberField = true;
    e.preventDefault();

    var newVal = _this.getValue() + dy * _this.getStep();
    _this.setValue(newVal);
    return false;

  };

  this.options = function() {
    _this.noSlider();
    _this.domElement.removeChild(numberField);
    return DAT.GUI.Controller.prototype.options.apply(this, arguments);
  };

  this.noSlider = function() {
    if (slider) {
      _this.domElement.removeChild(slider.domElement);
    }
    return this;
  };

  this.setValue = function(val) {

    val = parseFloat(val);

    if (min != undefined && val <= min) {
      val = min;
    } else if (max != undefined && val >= max) {
      val = max;
    }

    return DAT.GUI.Controller.prototype.setValue.call(this, val);

  };

  this.updateDisplay = function() {
    numberField.value = DAT.GUI.roundToDecimal(_this.getValue(), 4);
    if (slider) slider.value = _this.getValue();
  };
};

DAT.GUI.extendController(DAT.GUI.ControllerNumber);

DAT.GUI.ControllerNumberSlider = function(numberController, min, max, step, initValue) {

  var clicked = false;
  var _this = this;

  var x, px;

  this.domElement = document.createElement('div');
  this.domElement.setAttribute('class', 'guidat-slider-bg');

  this.fg = document.createElement('div');
  this.fg.setAttribute('class', 'guidat-slider-fg');

  this.domElement.appendChild(this.fg);

  var onDrag = function(e) {
    if (!clicked) return;
    var pos = findPos(_this.domElement);
    var val = DAT.GUI.map(e.pageX, pos[0], pos[0] + _this.domElement
        .offsetWidth, numberController.getMin(), numberController.getMax());
    val = Math.round(val / numberController.getStep()) * numberController
        .getStep();
    numberController.setValue(val);
  };

  this.domElement.addEventListener('mousedown', function(e) {
    clicked = true;
    x = px = e.pageX;
    DAT.GUI.addClass(numberController.domElement, 'active');
    onDrag(e);
    document.addEventListener('mouseup', mouseup, false);
  }, false);

  var mouseup = function(e) {
    DAT.GUI.removeClass(numberController.domElement, 'active');
    clicked = false;
    if (numberController.finishChangeFunction != null) {
      numberController.finishChangeFunction.call(this,
          numberController.getValue());
    }
    document.removeEventListener('mouseup', mouseup, false);
  };

  var findPos = function(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while ((obj = obj.offsetParent));
      return [curleft,curtop];
    }
  };

  this.__defineSetter__('value', function(e) {
    this.fg.style.width = DAT.GUI.map(e, numberController.getMin(),
        numberController.getMax(), 0, 100) + "%";
  });

  document.addEventListener('mousemove', onDrag, false);

  this.value = initValue;

};
DAT.GUI.ControllerString = function() {

  this.type = "string";

  var _this = this;
  DAT.GUI.Controller.apply(this, arguments);

  var input = document.createElement('input');

  var initialValue = this.getValue();

  input.setAttribute('value', initialValue);
  input.setAttribute('spellcheck', 'false');

  this.domElement.addEventListener('mouseup', function() {
    input.focus();
    input.select();
  }, false);

  // TODO: getting messed up on ctrl a
  input.addEventListener('keyup', function(e) {
    if (e.keyCode == 13 && _this.finishChangeFunction != null) {
      _this.finishChangeFunction.call(this, _this.getValue());
      input.blur();
    }
    _this.setValue(input.value);
  }, false);

  input.addEventListener('mousedown', function(e) {
    DAT.GUI.makeSelectable(input);
  }, false);

  input.addEventListener('blur', function() {
    DAT.GUI.supressHotKeys = false;
    if (_this.finishChangeFunction != null) {
      _this.finishChangeFunction.call(this, _this.getValue());
    }
  }, false);

  input.addEventListener('focus', function() {
    DAT.GUI.supressHotKeys = true;
  }, false);

  this.updateDisplay = function() {
    input.value = _this.getValue();
  };

  this.options = function() {
    _this.domElement.removeChild(input);
    return DAT.GUI.Controller.prototype.options.apply(this, arguments);
  };

  this.domElement.appendChild(input);

};

DAT.GUI.extendController(DAT.GUI.ControllerString);
DAT.GUI.inlineCSS = '#guidat { position: fixed; top: 0; right: 0; width: auto; z-index: 1001; text-align: right; } .guidat { color: #fff; opacity: 0.97; text-align: left; float: right; margin-right: 20px; margin-bottom: 20px; background-color: #fff; } .guidat, .guidat input { font: 9.5px Lucida Grande, sans-serif; } .guidat-controllers { height: 300px; overflow-y: auto; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.1); } a.guidat-toggle:link, a.guidat-toggle:visited, a.guidat-toggle:active { text-decoration: none; cursor: pointer; color: #fff; background-color: #222; text-align: center; display: block; padding: 5px; } a.guidat-toggle:hover { background-color: #000; } .guidat-controller { padding: 3px; height: 25px; clear: left; border-bottom: 1px solid #222; background-color: #111; } .guidat-controller, .guidat-controller input, .guidat-slider-bg, .guidat-slider-fg { -moz-transition: background-color 0.15s linear; -webkit-transition: background-color 0.15s linear; transition: background-color 0.15s linear; } .guidat-controller.boolean:hover, .guidat-controller.function:hover { background-color: #000; } .guidat-controller input { float: right; outline: none; border: 0; padding: 4px; margin-top: 2px; background-color: #222; } .guidat-controller select { margin-top: 4px; float: right; } .guidat-controller input:hover { background-color: #444; } .guidat-controller input:focus, .guidat-controller.active input { background-color: #555; color: #fff; } .guidat-controller.number { border-left: 5px solid #00aeff; } .guidat-controller.string { border-left: 5px solid #1ed36f; } .guidat-controller.string input { border: 0; color: #1ed36f; margin-right: 2px; width: 148px; } .guidat-controller.boolean { border-left: 5px solid #54396e; } .guidat-controller.function { border-left: 5px solid #e61d5f; } .guidat-controller.number input[type=text] { width: 35px; margin-left: 5px; margin-right: 2px; color: #00aeff; } .guidat .guidat-controller.boolean input { margin-top: 6px; margin-right: 2px; font-size: 20px; } .guidat-controller:last-child { border-bottom: none; -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5); box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5); } .guidat-propertyname { padding: 5px; padding-top: 7px; cursor: default; display: inline-block; } .guidat-controller .guidat-slider-bg:hover, .guidat-controller.active .guidat-slider-bg { background-color: #444; } .guidat-controller .guidat-slider-bg .guidat-slider-fg:hover, .guidat-controller.active .guidat-slider-bg .guidat-slider-fg { background-color: #52c8ff; } .guidat-slider-bg { background-color: #222; cursor: ew-resize; width: 40%; margin-top: 2px; float: right; height: 21px; } .guidat-slider-fg { cursor: ew-resize; background-color: #00aeff; height: 21px; } ';
