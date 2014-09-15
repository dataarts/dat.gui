/* globals Polymer, Path, Gui */

// [ ] scrolling when docked
// [ ] scrolling when window short and not docked

Polymer( 'dat-gui', {

    docked: false,
    open: true,
    touch: ( 'ontouchstart' in window ) || ( !!window.DocumentTouch && document instanceof window.DocumentTouch ),

    ready: function() {

        this.vars = {};
        this.domElement = this; // legacy

    },

    // "Public" API
    // ------------------------------- 

    add: function( object, path ) {

        // Make controller

        var value = Path.get( path ).getValueFrom( object );

        if ( value === null || value === undefined ) {
            return Gui.error( object + ' doesn\'t have a value for path "' + path + '".' );
        }

        var args = Array.prototype.slice.call( arguments, 2 );
        var controller;

        if ( args[ 0 ] instanceof Array || typeof args[ 0 ] == 'object' ) {
            controller = document.createElement( 'dat-gui-option' );
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
        this.appendChild( row );

        return controller;

    },

    var: function() {

        var name, initialValue, args;

        if ( arguments.length == 1 ) {
            name = arguments[ 0 ];
            return this.vars[ name ];
        }

        initialValue = arguments[ 1 ];
        name = arguments[ 0 ];

        args = [ this.vars, name ];
        args = args.concat( Array.prototype.slice.call( arguments, 2 ) );

        this.vars[ name ] = initialValue;

        return this.add.apply( this, args );

    },

    remember: function( object ) {

        // todo

    },


    // Legacy
    // ------------------------------- 

    listAll: function() {

        Gui.warn( 'controller.listenAll() is deprecated. All controllers are listened for free.' );

    },


    // Observers
    // -------------------------------

    openChanged: function() {

        if ( this.open || this.docked ) {

            // let the style sheet take care of things
            this.$.container.style.transform = '';
            this.$.panel.style.transform = '';

        } else {

            // todo: need the rest of the vendor prefixes ...
            // wish i could pipe javascript variables into styl.
            var y = -this.$.controllers.offsetHeight + 'px';
            this.$.container.style.transform = 'translate3d( 0, ' + y + ', 0 )';

        }

        this.asyncFire( 'resize' );

    },

    dockedChanged: function() {

        this.openChanged();

    },


    // Events
    // -------------------------------

    tapClose: function() {
        this.open = !this.open;
    },

    toggleOpen: function() {
        this.open = !this.open;
    }

} );

( function( scope ) {

/* globals Path */

var Gui = function( params ) {


    if ( !ready ) {
        Gui.error( 'Gui not ready. Put your code inside Gui.ready()' );
    }

    params = params || {};

    // Properties

    this.localStorage = params.localStorage || false;

    // Make domElement

    var panel = document.createElement( 'dat-gui' );

    panel.autoPlace = params.autoPlace !== false;

    if ( panel.autoPlace ) {
        document.body.appendChild( panel );
    }

    return panel;

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
var readyPromise;

function readyResolve( resolve ) {

    readyHandlers.forEach( function( fnc ) {
        fnc();
    } );

    if ( resolve !== undefined ) {
        resolve();
    }

}


document.addEventListener( 'polymer-ready', function() {

    ready = true;
    if ( !readyPromise ) {
        readyResolve();
    }

} );

Gui.ready = function( fnc ) {

    if ( window.Promise && arguments.length === 0 ) {
        readyPromise = new Promise( readyResolve );
        return readyPromise;
    }

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
dat.controllers.Controller = constructor( 'dat-gui-base' );
dat.controllers.NumberController = constructor( 'dat-gui-number' );
dat.controllers.FunctionController = constructor( 'dat-gui-function' );
dat.controllers.ColorController = constructor( 'dat-gui-color' );
dat.controllers.BooleanController = constructor( 'dat-gui-boolean' );
dat.controllers.OptionController = constructor( 'dat-gui-option' );

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


})( this );
