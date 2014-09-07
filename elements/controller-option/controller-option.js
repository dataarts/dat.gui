Polymer( 'controller-option', {

    ready: function() {
      
        this.options = {};

    },

    init: function( options ) {

        if ( Array.isArray( options ) ){

            options.forEach( function( opt ) {

                this.options[ opt ] = opt;

            }, this );

        } else {
            
            this.options = options;

        }

    },

    getKeys: function( object ) {

        if ( object ) return Object.keys( object );

    }
    

});
    