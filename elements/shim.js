// Use gui.shim.js in production when you want to use dat.gui to recall values without any of the interface.
( function( scope ) {

<<<<<<< HEAD
    'use strict';

||||||| merged common ancestors
    'use strict';
    
=======
>>>>>>> 8d86460ebde6d3dda4dec6e7783f0223fca59d00
    var Gui = function() {

        this.vars = {};

    };

    Gui.ready = function( fnc ) {

        fnc();

    };

    Gui.prototype.var = function( name, value ) {

        this.vars[ name ] = value;
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
