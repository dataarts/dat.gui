( function( scope ) {

    /* globals Path */
    'use strict';

    var Gui = function( params ) {

        if ( !ready ) {
            Gui.error( 'Gui not ready. Put your code inside Gui.ready()' );
        }

        params = params || {};

        // Properties

        this.defined = {};
        this.localStorage = params.localStorage || false;

        // Make domElement

        this.panel = document.createElement( 'gui-panel' );
        this.panel.autoPlace = params.autoPlace !== false;

        if ( this.panel.autoPlace ) {
            document.body.appendChild( this.panel );
        }

    };


    // Instance methods
    // -------------------------------

    Gui.prototype.add = function( object, path ) {

        // Make controller

        var value = Path.get( path ).getValueFrom( object );

        if ( value === null || value === undefined ) {
            return Gui.error( object + ' doesn\'t have a value for path "' + path + '".' );
        }

        var args = Array.prototype.slice.call( arguments, 2 );
        var controller;

        if ( args[ 0 ] instanceof Array || typeof args[ 0 ] == 'object' ) {
            controller = document.createElement( 'controller-option' );
        } else {
            controller = Gui.getController( value );
        }

        if ( !controller ) {
            return Gui.error( 'Unrecognized type:', value );
        }

        controller.watch( object, path );
        controller.init.apply( controller, args );

        // Make row

        var row = document.createElement( 'gui-row' );
        row.name = path;

        controller.row = row;

        controller.name = function( name ) {
            row.name = name;
        };

        controller.comment = function( comment ) {
            row.comment = comment;
        };

        row.appendChild( controller );
        this.panel.appendChild( row );

        return controller;

    };

    Gui.prototype.remember = function( object ) {


    };

    Gui.prototype.define = function() {

        var name, initialValue, args;

        if ( arguments.length == 1 ) {
            name = arguments[ 0 ];
            return this.defined[ name ];
        }

        initialValue = arguments[ 1 ];
        name = arguments[ 0 ];

        args = [ this.defined, name ];
        args = args.concat( Array.prototype.slice.call( arguments, 2 ) );

        this.defined[ name ] = initialValue;

        return this.add.apply( this, args );

    };

    Gui.prototype.listenAll = function() {

        Gui.warn( 'controller.listenAll() is deprecated. All controllers are listened for free.' );

    };


    // Register custom controllers
    // -------------------------------

    var controllers = {};

    Gui.register = function( elementName, test ) {

        controllers[ elementName ] = test;

    };


    // Returns a controller based on a value
    // -------------------------------

    Gui.getController = function( value ) {

        for ( var type in controllers ) {

            var test = controllers[ type ];

            if ( test( value ) ) {

                return document.createElement( type );

            }

        }

    };


    // Gui ready handler ... * shakes fist at polymer *
    // -------------------------------

    var ready = false;
    var readyHandlers = [];

    document.addEventListener( 'polymer-ready', function() {

        ready = true;
        readyHandlers.forEach( function( fnc ) {

            fnc();

        } );

    } );

    Gui.ready = function( fnc ) {

        if ( ready ) {
            fnc();
        } else {
            readyHandlers.push( fnc );
        }

    };


    // Console
    // -------------------------------

    Gui.error = function() {
        var args = Array.prototype.slice.apply( arguments );
        args.unshift( 'dat-gui ::' );
        console.error.apply( console, args );
    };

    Gui.warn = function() {
        var args = Array.prototype.slice.apply( arguments );
        args.unshift( 'dat-gui ::' );
        console.warn.apply( console, args );
    };


    // Old namespaces
    // -------------------------------

    var dat = {};

    dat.gui = {};
    dat.gui.GUI = Gui;
    dat.GUI = dat.gui.GUI;

    dat.color = {};
    dat.color.Color = function() {};

    dat.dom = {};
    dat.dom.dom = function() {};

    dat.controllers = {};
    dat.controllers.Controller          = constructor( 'controller-base' );
    dat.controllers.NumberController    = constructor( 'controller-number' );
    dat.controllers.FunctionController  = constructor( 'controller-function' );
    dat.controllers.ColorController     = constructor( 'controller-color' );
    dat.controllers.BooleanController   = constructor( 'controller-boolean' );
    dat.controllers.OptionController    = constructor( 'controller-option' );

    dat.controllers.NumberControllerBox = dat.controllers.NumberController;
    dat.controllers.NumberControllerSlider = dat.controllers.NumberController;

    function constructor( elementName ) {

        return function( object, path ) {
            var el = document.createElement( elementName );
            el.watch( object, path );
            return el;
        };

    }


    // Export
    // -------------------------------

    scope.dat = dat;
    scope.Gui = Gui;


} )( this );
