/// # Google Closure Compiler Service #
/// https://github.com/weaver/scribbles/blob/master/node/google-closure/lib/closure.js
/// Compress javascript with Node.js using the Closure Compiler
/// Service.

var sys = require('sys');

exports.compile = compile;

// Use the Google Closure Compiler Service to compress Javascript
// code.
//
// + code - String of javascript to compress
// + next - Function callback that accepts.
//
// This method will POST the `code` to the compiler service.  If an
// error occurs, `next()` will be called with an `Error` object as the
// first argument.  Otherwise, the `next()` will be called with `null`
// as the first argument and a String of compressed javascript as the
// second argument.
//
//     compile('... javascript ...', function(err, result) {
//       if (err) throw err;
//
//       ... do something with result ...
//     });
//
// Returns nothing.
function compile(code, next) {
  try {
    var qs = require('querystring'),
        http = require('http'),
        host = 'closure-compiler.appspot.com',
        body = qs.stringify({
          js_code: code.toString('utf-8'),
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          output_format: 'json',
          output_info: 'compiled_code'
        }),
        client = http.createClient(80, host).on('error', next),
        req = client.request('POST', '/compile', {
          'Host': host,
          'Content-Length': body.length,
          'Content-Type': 'application/x-www-form-urlencoded'
        });

    req.on('error', next).end(body);

    req.on('response', function(res) {
      if (res.statusCode != 200)
        next(new Error('Unexpected HTTP response: ' + res.statusCode));
      else
        capture(res, 'utf-8', parseResponse);
    });

    function parseResponse(err, data) {
      err ? next(err) : loadJSON(data, function(err, obj) {
        var error;
        if (err)
          next(err);
        else if ((error = obj.errors || obj.serverErrors || obj.warnings))
          next(new Error('Failed to compile: ' + sys.inspect(error)));
        else
          next(null, obj.compiledCode);
      });
    }
  } catch (err) {
    next(err);
  }
}

// Convert a Stream to a String.
//
// + input    - Stream object
// + encoding - String input encoding
// + next     - Function error/success callback
//
// Returns nothing.
function capture(input, encoding, next) {
  var buffer = '';

  input.on('data', function(chunk) {
    buffer += chunk.toString(encoding);
  });

  input.on('end', function() {
    next(null, buffer);
  });

  input.on('error', next);
}

// Convert JSON.load() to callback-style.
//
// + data - String value to load
// + next - Function error/success callback
//
// Returns nothing.
function loadJSON(data, next) {
  var err, obj;

  try {
    obj = JSON.parse(data);
  } catch (x) {
    err = x;
  }
  next(err, obj);
}