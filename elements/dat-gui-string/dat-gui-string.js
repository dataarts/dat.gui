/* globals Gui, Polymer */


Gui.register( 'dat-gui-string', function( value ) {

    return typeof value == 'string';

} );

Polymer( 'dat-gui-string', {

    click: function( e ) {

        this.$.input.select();

    },

    keydown: function( e ) {

        if ( e.keyCode == 13 ) {

            this.$.input.blur();
            
        }

    }

} );
