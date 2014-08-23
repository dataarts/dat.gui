/*

[ ] kill horizontal scroll when docked

*/

Polymer('gui-panel', {

    docked: false,
    open: true,

    ready: function() {

        this.anon.values = {};

        window.addEventListener( 'resize', this.checkHeight.bind( this ) );

    },

    anon: function() {

        if ( arguments.length == 1 ) {
            var name = arguments[ 0 ];
            return this.anon.values[ name ];
        }

        var initialValue = arguments[ 0 ];
        var name = arguments[ 1 ];

        var args = [ this.anon.values, name ];
        args = args.concat( Array.prototype.slice.call( arguments, 2 ) );

        this.anon.values[ name ] = initialValue;

        return this.add.apply( this, args );

    },

    add: function( object, path ) {

        // Make controller

        var value = Path.get( path ).getValueFrom( object );

        if ( value == null || value == undefined ) {
            return Gui.error( object + ' doesn\'t have a value for path "' + path + '".' );
        }

        var args = Array.prototype.slice.call( arguments, 2 );

        var controller = Gui.getController( value, args );
        
        if ( !controller ) {
            return Gui.error( 'Unrecognized type:', value );
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


    openChanged: function() {

        var y;
        if ( this.open ) {
            y = 0;
        } else { 
            y = -this.$.controllers.offsetHeight + 'px';
        }
        this.$.container.style.transform = 'translate3d(0, ' + y + ', 0)';

    },

    // Events
    // ------------------------------- 
    
    tapClose: function() {
        this.open = !this.open;
    },
    
    checkHeight: function() {
          
        if ( window.innerHeight < this.$.controllers.offsetHeight ) {
            this.docked = true;
        } else { 
            this.docked = false;
        }

    },

    // Legacy
    // -------------------------------     

    listenAll: function() {

        Gui.warn( 'controller.listenAll() is deprecated. All controllers are listened for free.' );

    },

    // domElement

});