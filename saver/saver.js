#!/usr/bin/env node

var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    var filename = /\/([^/]+\.json)$/.exec(req.url);
    if (!filename) {
        filename = 'dat-gui.json';
    } else {
        filename = filename[1];
    }
    switch(req.method) {
        case 'GET':
            if (!fs.existsSync(filename)) {
                res.writeHead(404);
                res.end();
                return
            }
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost'});
            res.end(fs.readFileSync(filename, 'utf8'));
            break;
        case 'POST':
            var data = '';
            req.on('data', function(d) {data += d;})
            req.on('end', function() {
                res.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost'});
                fs.writeFileSync(filename, data);
                res.end();
            })
            break;
        default:
            res.writeHead(404);
            res.end();
    }
}).listen(7999);
