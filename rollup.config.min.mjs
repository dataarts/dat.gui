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

import fs from 'fs';
import path from 'path';
import defaultConfig from './rollup.config.mjs';
import terser from '@rollup/plugin-terser';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const banner = fs.readFileSync(path.join(__dirname, 'licenseBanner.txt'));

export default Object.assign({}, defaultConfig, {
  output: {
    // TODO: Remove default exports, and this line, in v0.8.0.
    exports: 'named',
    file: './build/dat.gui.min.js',
    format: 'umd',
    name: 'dat',
    banner: banner
  },
  plugins: [...defaultConfig.plugins, terser({
    output: {
      // Preserve license commenting in minified build.
      comments: function(node, comment) {
        return comment.type === 'comment2';
      }
    }  
  })]
});