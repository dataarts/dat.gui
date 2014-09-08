/* globals Gui, Polymer */
'use strict';

Gui.register( 'controller-function', function( value ) {

    return typeof value == 'function';

} );

Polymer( 'controller-function', {

} );
