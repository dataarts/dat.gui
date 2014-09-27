#!/usr/bin/env node

var http    = require( 'http' );
var fs      = require( 'fs' );
var path    = require( 'path' );

var colors  = require( 'colors' );
var argv    = require( 'yargs' ).argv;

var PORT = 7999;
var BASEPATH = process.argv[ 2 ] || './' ;
var OUTFILE = path.join( BASEPATH, argv.o || 'dat-gui.json' );

http.createServer( function ( req, res ) {

    switch ( req.method ) {

        case 'POST':

            var data = '';

            req.on( 'data', function( d ) {
                data += d;
            } );

            req.on( 'end', function() {

                res.writeHead( 200, { 'Access-Control-Allow-Origin': 'http://localhost' } );
                fs.writeFileSync( OUTFILE, data );

                var json = JSON.parse( data );
                var propertyCount = 0;

                for ( var i in json.values ) {
                    propertyCount += Object.keys( json.values[ i ] ).length;
                }

                log( 'Saved ' + propertyCount + ' properties.' );
                res.end();

            } );

            break;

        default:

            res.writeHead( 405 );
            res.end();

    }

} ).listen( PORT );

log( 'Running at ' + ( 'http://localhost:' + PORT ).magenta + '.' );
log( 'Writing to ' + OUTFILE.green + '.' );

function log( message ) {
    var d = new Date();
    var h = d.getHours() % 12;
    var m = d.getMinutes();
    if ( h < 10 ) h = '0'+h;
    if ( m < 10 ) m = '0'+m;
    var d = h + ':' + m;
    console.log( d.green + ' [ dat-gui-saver ] '.blue + message );
}