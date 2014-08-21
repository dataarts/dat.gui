Polymer('gui-panel', {

    docked: false,

    ready: function() {

        this.anon.values = {};

    },

    anon: function( name, initialValue ) {

        if ( arguments.length == 1 ) {
            return this.anon.values[ name ];
        }

        var args = [ this.anon.values, name ];
        args = args.concat( Array.prototype.slice.call( arguments, 2 ) );

        this.anon.values[ name ] = initialValue;

        return this.add.apply( this, args );

    },

    add: function( object, path ) {

        // Make controller

        var value = Path.get( path ).getValueFrom( object );

        if ( value == null || value == undefined ) {
            return console.error( object + ' doesn\'t have a value for path "' + path + '".' );
        }

        var args = Array.prototype.slice.call( arguments, 2 );

        var controller = Gui.getController( value, args );
        
        if ( !controller ) {
            return console.error( 'Unrecognized type: ', value );
        }

        controller.watch( object, path )
        controller.init.apply( controller, args );

        // Make row

        var row = document.createElement( 'gui-row' );
        row.name = path;

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