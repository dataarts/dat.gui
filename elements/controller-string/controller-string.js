/* globals Gui, Polymer */
'use strict';

Gui.register( 'controller-string', function( value ) {

    return typeof value == 'string';

} );

Polymer( 'controller-string', {

    click: function( e ) {

        this.$.input.select();

    },

    keydown: function( e ) {

        if ( e.keyCode == 13 ) {

            this.$.input.blur();
            
        }

    }

} );
