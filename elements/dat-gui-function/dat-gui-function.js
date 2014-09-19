/* globals Gui, Polymer */


Gui.register( 'dat-gui-function', function( value ) {

    return typeof value == 'function';

} );



Polymer( 'dat-gui-function', {

    tap: function() {
        this.value.apply( this.object );
    }

} );
