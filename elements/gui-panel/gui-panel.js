Polymer('gui-panel', {

    ready: function() {
        
        document.body.appendChild( this );

    },

    add: function( object, property ) {

        var row = document.createElement( 'gui-row' );

        var controller; 



        var value;

        // gui.add( object, 'property' ...
        if ( typeof object == 'object' ) {

            value = object[ property ];
        
        // gui.add( 0, 'anonymous-value' ...
        } else {

            value = object;

        }


        if ( typeof value == 'number' ) {

            controller = document.createElement( 'controller-number' );
            
            if ( arguments[ 2 ] !== undefined ) controller.min = arguments[ 2 ];
            if ( arguments[ 3 ] !== undefined ) controller.max = arguments[ 3 ];
            if ( arguments[ 4 ] !== undefined ) controller.step = arguments[ 4 ];

        }

        // gui.add( object, 'property' ...
        if ( typeof object == 'object' ) {
            controller.object = object;
            controller.property = property;
        } 

        row.name = property;

        controller.name = function( name ) {
            row.name = name;
        };

        controller.comment = function( comment ) {
            row.comment = comment;
        };

        row.appendChild( controller );
        this.appendChild( row );

        return controller;

    },

    listenAll: function() {

        console.warn( 'controller.listenAll() is deprecated. All controllers are listened for free.' );

    }

});