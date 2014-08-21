(function( scope ) {

    var Gui = function() {
        var panel = document.createElement( 'gui-panel' );
        document.body.appendChild( panel );
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
    dat.controllers.Controller              = constructor( 'controller-base' );
    dat.controllers.NumberController        = constructor( 'controller-number' );
    dat.controllers.FunctionController      = constructor( 'controller-function' );
    dat.controllers.ColorController         = constructor( 'controller-color' );
    dat.controllers.BooleanController       = constructor( 'controller-boolean' );
    dat.controllers.OptionController        = constructor( 'controller-option' );

    dat.controllers.NumberControllerBox     = dat.controllers.NumberController;
    dat.controllers.NumberControllerSlider  = dat.controllers.NumberController;
    
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