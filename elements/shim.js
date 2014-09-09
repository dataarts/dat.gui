// Use gui.shim.js in production when you want to use dat.gui to recall values without any of the interface.
( function( scope ) {

    var Gui = function() {

        this.defined = {};

    };

    Gui.ready = function( fnc ) {

        fnc();

    };

    Gui.prototype.define = function( name, value ) {

        this.defined[ name ] = value;
        return controllerShim;

    };

    Gui.prototype.add = function( object, path ) {
      
        return controllerShim;

    };

    var identity = function() { return this; };

    var controllerShim = {
        on: identity
    };

    scope.Gui = Gui;

} )( this );