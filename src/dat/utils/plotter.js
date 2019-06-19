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
 * @author mrdoob / http://mrdoob.com/
 * Original code from stats.js r17: https://github.com/mrdoob/stats.js
 * Modified by MacroMan
 * Licence from that project:

 The MIT License

Copyright (c) 2009-2016 stats.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
const plotter = function(fg, bg, type) {
  let min = Infinity;
  let max = 0;
  const round = Math.round;
  const PR = round(window.devicePixelRatio || 1);

  const WIDTH = 160 * PR;
  const HEIGHT = 60 * PR;
  const GRAPH_X = 3 * PR;
  const GRAPH_Y = 3 * PR;
  const GRAPH_WIDTH = 154 * PR;
  const GRAPH_HEIGHT = 54 * PR;

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const context = canvas.getContext('2d');
  context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
  context.textBaseline = 'top';

  context.fillStyle = bg;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.fillStyle = fg;
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  context.fillStyle = bg;
  context.globalAlpha = 0.9;
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  return {
    dom: canvas,
    update: function(value, maxValue) {
      min = Math.min(min, value);
      max = Math.max(max, value);

      context.globalAlpha = 1;
      context.fillStyle = fg;

      // Move graph over 1px
      context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

      // Draw fg color
      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

      context.fillStyle = bg;
      context.globalAlpha = 0.9;

      // Blank out above the value
      context.fillRect(
        GRAPH_X + GRAPH_WIDTH - PR,
        GRAPH_Y,
        PR,
        round((1 - (value / maxValue)) * GRAPH_HEIGHT)
      );

      // Blank out below the value if line
      if (type === 'line') {
        context.fillRect(
          GRAPH_X + GRAPH_WIDTH - PR,
          round((1 - (value / maxValue)) * GRAPH_HEIGHT) + PR + 3,
          PR,
          round((value / maxValue) * GRAPH_HEIGHT)
        );
      }
    }
  };
};

export default plotter;