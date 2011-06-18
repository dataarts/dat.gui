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
    if(value == undefined && object.get) value = object.get(propertyName);

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
    for (var i = 0, l = DAT.GUI.allControllers.length; i < l; i++) {
        // apply to each controller
        DAT.GUI.allControllers[i].reset();
    }
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
