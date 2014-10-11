// Use gui.shim.js in production when you want to use dat.gui to recall values without any of the interface.
( function( scope ) {

var Gui = function() {

    this.vars = {};

    this.$ = {
        dockedContent: document.body
    };

    Object.defineProperties( this.$.dockedContent, {

        offsetWidth: {

            get: function() {
                return window.innerWidth;
            }

        },

        offsetHeight: {

            get: function() {
                return window.innerHeight;
            }

        }

    } );


};

Gui.ready = function( fnc ) {

    if ( window.Promise && arguments.length === 0 ) {
        return new Promise( function( resolve ) {
                resolve();
            } );
    }

    fnc();

};

Gui.prototype.addEventListener = function( evt, fnc ) {

    if ( evt == 'resize' ) {
        window.addEventListener( evt, fnc );
    }

};

Gui.prototype.var = function( name, value ) {

    this.vars[ name ] = value;
    return controllerShim;

};

Gui.prototype.folder = function( name ) {

    return this;

};

Gui.prototype.add = function( object, path ) {

    return controllerShim;

};

var identity = function() {
    return this;
};

var controllerShim = {
    on: identity,
    onChange: identity,
    disable: identity
};

scope.Gui = Gui;

})( this );
