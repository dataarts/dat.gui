/* globals Polymer, Object, Array */


Polymer( 'dat-gui-option', {

    key: null,

    ready: function() {

        this.options = {};

    },

    init: function( options ) {

        if ( Array.isArray( options ) ) {

            options.forEach( function( opt ) {

                this.options[ opt ] = opt;

            }, this );

        } else {

            this.options = options;

        }

    },

    valueChanged: function() {

        for ( var i in this.options ) {
            if ( this.options[ i ] === this.value ) {
                this.key = i;
                break;
            }
        }

        this.super();

    },

    keyChanged: function() {

        this.value = this.options[ this.key ];

    },

    keys: function( object ) {

        if ( object ) {

            return Object.keys( object );

        }

    }


} );
