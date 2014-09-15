/* globals Gui, Polymer */


Gui.register( 'dat-gui-boolean', function( value ) {

    return typeof value == 'boolean';

} );

Polymer( 'dat-gui-boolean', {

    ready: function() {},

    toggle: function() {

        this.value = !this.value;

    }

} );
