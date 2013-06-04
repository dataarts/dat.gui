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

var fs = require('fs'),
    closure = require('./closure'),
    params,
    defined,
    third_party,
    request_counts,
    namespaces,
    next_load = '',
    next_path = '';

exports.build = build;
exports.file_exists = file_exists;
exports.read_file = read_file;
exports.tab = tab;

exports.license = read_file('license.txt');

function build(_params) {

  params = _params;

  defined = {};
  third_party = {};
  request_counts = {};
  namespaces = {};

  var deps = [];

  load_module(params.baseUrl + params.main + '.js', params.main);

  for (var i in defined) {
    if (params.verbose) console.log('Loaded: ' + defined[i].path);
    deps.push(defined[i].path);
    if (defined[i].module) {
      var namespace = i.substr(0, i.lastIndexOf('/'));
      namespaces[namespace] = true;
    }
  }

  var to_write = '';
  var ensured = {};


  for (var name in params.paths) {
    var path = params.baseUrl + params.paths[name] + '.js';
    var str = read_file(path);
    if (str === false) {
      console.log('Failed to locate dependency \'' + name + '\' at ' + path);
      fail();
    }
    third_party[name] = str;
    to_write += third_party[name] + "\n\n";
    if (params.verbose) console.log('Loaded: ' + path);
    //deps.push(path);
  }

  // Ensure namespaces
  for (i in namespaces) {

    var split = i.split('/');

    for (var j = 0; j < split.length; j++) {
      var cur = [];
      if (j == 0 && !ensured[split[j]]) {
        to_write += '/** @namespace */\n';
        to_write += 'var ' + split[j] + ' = ' + split[j] + ' || {};\n\n';
        ensured[split[j]] = true;
      } else {
        for (var k = 0; k <= j; k++) {
          cur.push(split[k]);
        }
        var curn = cur.join('.');
        if (!ensured[curn]) {
          to_write += '/** @namespace */\n';
          to_write += curn + ' = ' + curn + ' || {};\n\n';
        }
        ensured[curn] = true;
      }
    }

  }

  var shared_count = 0;
  for (i in request_counts) {
    var count = request_counts[i];
    if (count > 1) {
      if (i in defined) {
        var new_shared = i.replace(/\//g, '.');
        var v = new_shared + ' = ' + defined[i].getClosure() + ';\n';
        to_write += v + "\n\n";
        defined[i].shared = new_shared;
        shared_count++;
      }
    }
  }
  

  to_write += params.shortcut + ' = ' + params.main.replace(/\//g, '.') + ' = ' + defined[params.main].getClosure() + ';';

  if (params.verbose) console.log('Exported: ' + params.main + ' to window.' + params.shortcut);

  if (params.minify) {

    console.log('Compiling minified source ...');


    closure.compile(to_write, function(error, code) {
      if (error) {
        console.log(error);
      } else {
        write(exports.license + code);
      }
      if (params.on_compile) {
        params.on_compile();
      }
    });

  } else {

    write(exports.license + "\n" + to_write);

  }

  return deps;

}

function define(deps, callback) {

  this.name = next_load;
  this.path = next_path;
  this.shared = false;

  defined[this.name] = this;

  if (Array.isArray(deps)) {

    this.deps = deps;
    this.callback = callback.toString();
    this.module = true;

    // Simple define call, just an object
  } else if (typeof deps === 'object') {

    var props = [];
    for (var i in deps) {
      props.push(i + ':' + deps[i].toString())
    }
    this.callback = '{' + props.join(',') + '}';
    this.module = true;

  } else {

    this.deps = deps;
    this.callback = callback;

  }

  this.getClosure = function() {
    if (this.shared) return this.shared;
    if (!this.deps || this.text) return this.callback;
    var arg_string = '(';
    var args = [];
    for (var i in this.deps) {
      var dep = this.deps[i];
      if (dep in defined) {
        var closure = defined[dep].getClosure();
        if (!defined[dep].shared && !defined[dep].text) {
          closure = defined[dep].name.replace(/\//g, '.') + ' = ' + closure;
        }
        args.push(closure);
      }
    }
    arg_string += args.join(',\n');
    arg_string += ')';
    return '(' + this.callback + ')' + arg_string;

  };

  this.recurseDeps = function() {

    if (!this.deps) return;

    for (var i in this.deps) {

      var dep = this.deps[i];

      if (dep in params.paths) continue;

      var path = params.baseUrl + dep;

      // Define module?
      if (file_exists(path + '.js')) {
        load_module(path + '.js', dep);

        // Text module?
      } else if (path.match(/text!/) != null) {
        load_text(path.replace('text!', ''), dep);
      }

      // up the request count
      if (dep in request_counts) {
        request_counts[dep]++
      } else {
        request_counts[dep] = 1;
      }

    }

  };

  this.recurseDeps();

}

function file_exists(path) {
  try {
    var stats = fs.lstatSync(path)
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

function read_file(path) {
  try {
    return fs.readFileSync(path).toString();
  } catch (e) {
    return false;
  }
}

function load_module(path, name) {
  name = name || path;
  if (name in defined) return;
  next_load = name;
  next_path = path;
  eval('new ' + read_file(path));
}

function load_text(path, name) {
  name = name || path;
  if (name in defined) return;
  var text = read_file(path);
  text = text.replace(/\r/g, "\\r");
  text = text.replace(/\n/g, "\\n");
  text = text.replace(/"/g, "\\\"");
  next_load = name;
  next_path = path;
  var d = new define([], '"' + text + '"');
  d.text = true;
  d.module = false;
}

function tab(str, tabs) {
  var lines = str.split("\n");
  for (var i in lines) {
    lines[i] = tabs + lines[i];
  }
  return lines.join("\n");
}

function write(str) {
  fs.writeFile(params.out, str);
  console.log('Saved to ' + params.out);
}

function fail() {
  console.log('Build failed.');
  process.exit(0);
}