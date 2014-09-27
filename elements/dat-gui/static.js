( function( scope ) {

var Gui = function( params ) {

    if ( !ready ) {
        Gui.error( 'Gui not ready. Use Gui.ready( callback )' );
    }

    var panel = document.createElement( 'dat-gui' );
    Gui.constructor.call( panel, params );
    return panel;

};

Gui.constructor = function( params ) {

    var _this = this;

    params = params || {};

    // Saving

    this.localStorage = scope.localStorage && ( params.localStorage || false );

    this.loadPath = params.loadPath || params.savePath || Gui.DEFAULT_LOAD_PATH;
    this.savePath = params.savePath || Gui.DEFAULT_SAVE_PATH;


    // Bind save listener

    if ( params.save ) {

        this._debouncedSave = Gui.debounce( this.save, this, 50 );
        this.addEventListener( 'change', this._debouncedSave, false );

    }

    // Load initial data

    if ( params.load && !this.localStorage ) {

        Gui.getJSON( this.loadPath, function( data ) {

            Gui.log( 'Loaded data from ' + this.loadPath );
            this.unserialize( data );

        }, function( error ) {

                Gui.warn( 'Failed to load save data from ' + this.loadPath + ': "' + error + '"' );

            }, this );

    }

    // Get local storage, if that's your thing.

    if ( this.localStorage ) {

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


};


// Saving
// ------------------------------- 

Gui.DEFAULT_SAVE_PATH = 'http://localhost:7999/';
Gui.DEFAULT_LOAD_PATH = './dat-gui.json';

Gui.getJSON = function( path, success, error, scope ) {

    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', path, true );

    xhr.onreadystatechange = function() {

        if ( xhr.readyState == 4 ) {

            if ( xhr.status == 200 ) {

                try {
                    success.call( scope, JSON.parse( xhr.responseText ) );
                } catch (e) {
                    error.call( scope, e );
                }

            } else {
                error.call( scope, xhr.statusText );
            }

        }

    };

    xhr.send( null );

};

Gui.postJSON = function( path, data, success, error, scope ) {

    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', path, true );

    xhr.onreadystatechange = function() {

        if ( xhr.readyState == 4 ) {

            if ( xhr.status == 200 ) {
                success.call( scope, xhr.responseText );
            } else {
                error.call( scope, xhr.statusText );
            }

        }

    };

    xhr.send( JSON.stringify( data, null, 4 ) );

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

Gui.log = function() {
    var args = Array.prototype.slice.apply( arguments );
    args.unshift( 'dat-gui ::' );
    console.log.apply( console, args );
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
