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

import common from '../utils/common';

export default function(color) {
  if (color.a === 1 || common.isUndefined(color.a)) {
    let s = color.hex.toString(16);
    while (s.length < 6) {
      s = '0' + s;
    }
    return '#' + s;
  }

  return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';
}
