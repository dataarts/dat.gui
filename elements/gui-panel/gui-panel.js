Polymer('gui-panel', {

    ready: function() {
        
        document.body.appendChild( this );

    },

    add: function( object, property ) {

        var row = document.createElement( 'gui-row' );
        row.name = property;

        var controller; 

        if ( typeof object[ property ] == 'number' ) {

            controller = document.createElement( 'controller-number' );
            
            if ( arguments[ 2 ] !== undefined ) controller.min = arguments[ 2 ];
            if ( arguments[ 3 ] !== undefined ) controller.max = arguments[ 3 ];
            if ( arguments[ 4 ] !== undefined ) controller.step = arguments[ 4 ];

        }

        controller.object = object;
        controller.property = property;

        controller.name = function( name ) {
            row.name = name;
        };

        row.appendChild( controller );
        this.appendChild( row );

        return controller;

    },

    listenAll: function() {

        console.warn( 'controller.listenAll() is deprecated. All controllers are listened for free.' );

    }

});