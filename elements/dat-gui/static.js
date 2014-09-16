( function( scope ) {

// {
//     autoPlace: true,
//     localStorage: false,
//     autoSave: false,
//     savePath: Gui.DEFAULT_SAVE_PATH,
//     load: {},
// }

var Gui = function( params ) {

    if ( !ready ) {
        Gui.error( 'Gui not ready. Use Gui.ready( callback )' );
    }

    var panel = document.createElement( 'dat-gui' );
    Gui.constructor.call( panel, params );
    return panel;

};

Gui.constructor = function( params ) {

    params = params || {};

    // Saving

    this.localStorage = scope.localStorage && ( params.localStorage || false );

    this.autoSave = params.autoSave || this.localStorage;
    this.savePath = params.savePath || Gui.DEFAULT_SAVE_PATH;

    if ( this.autoSave ) {

        this.addEventListener( 'change', Gui.debounce( this.save, this, 50 ) );

    }

    if ( params.autoSave && !this.localStorage ) {

        Gui.getJSON( this.savePath, this.unserialize, this );

    }

    if ( this.localStorage && scope.localStorage ) {

        var _this = this;
        setTimeout( function() {

            var data = localStorage.getItem( Gui.LOCAL_STORAGE_KEY );
            _this.unserialize( JSON.parse( data ) );

        }, 0 );

    }


    // Autoplace

    this.autoPlace = params.autoPlace !== false;

    if ( this.autoPlace ) {

        document.body.appendChild( this );

    }

    // Load

    if ( params.load ) {

        this.load( params.load );

    }


};


// Saving
// ------------------------------- 

Gui.DEFAULT_SAVE_PATH = 'http://localhost:7999/';

Gui.serialize = function( object ) {

    // "shallow" stringify
    var data = {};

    for ( var i in object ) {

        var val;

        try {
            val = JSON.stringify( object[ i ] );
            val = object[ i ];
        } catch (e) {}

        if ( val !== undefined ) {

            data[ i ] = val;

        }

    }

    return JSON.stringify( data );

};

Gui.getJSON = function( path, callback, scope ) {

    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', path, true );

    xhr.onreadystatechange = function() {

        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            callback.call( scope, JSON.parse( xhr.responseText ) );
        }

    };

    xhr.send( null );

};

Gui.postJSON = function( path, data, callback, scope ) {

    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', path, true );

    xhr.onreadystatechange = function() {

        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            callback.call( scope, xhr.responseText );
        }

    };

    xhr.send( JSON.stringify( data ) );
};

Gui.debounce = function( func, scope, wait ) {

    var timeout;

    return function() {

        var args = arguments;

        clearTimeout( timeout );

        timeout = setTimeout( function() {
            timeout = null;
            func.apply( scope, args );
        }, wait );

    };

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

function readyResolve( resolve ) {

    readyHandlers.forEach( function( fnc ) {
        fnc();
    } );

    if ( resolve !== undefined ) {
        resolve();
    }

}

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
