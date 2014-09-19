/* globals Polymer, Path, Gui */

// [ ] scrolling when docked
// [ ] scrolling when window short and not docked

Polymer( 'dat-gui', {

    docked: false,
    open: true,
    localStorage: false,
    touch: ( 'ontouchstart' in window ) || ( !!window.DocumentTouch && document instanceof window.DocumentTouch ),

    ready: function() {

        this.vars = {};

        this._controllersByObject = {};

        this.domElement = this; // legacy


        // this winds up triggering like all the time? 

        // var _this = this;
        // window.addEventListener( 'resize', function() {
        //     _this.asyncFire( 'resize' );
        // }, false );

    },

    // 
    // ------------------------------- 

    add: function( object, path ) {

        // Make controller

        var value = Path.get( path ).getValueFrom( object );

        if ( value === null || value === undefined ) {
            return Gui.error( object + ' doesn\'t have a value for path "' + path + '".' );
        }

        var args = Array.prototype.slice.call( arguments, 2 );
        var controller;

        if ( args[ 0 ] instanceof Array || typeof args[ 0 ] == 'object' ) {
            controller = document.createElement( 'dat-gui-option' );
        } else {
            controller = Gui.getController( value );
        }

        if ( !controller ) {
            return Gui.error( 'Unrecognized type:', value );
        }

        controller.watch( object, path );
        controller.init.apply( controller, args );

        // Make row ( todo: put row in controllers )

        var row = document.createElement( 'gui-row' );
        row.name = path;

        controller.row = row;

        controller.name = function( name ) {
            row.name = name;
        };

        controller.comment = function( comment ) {
            row.comment = comment;
        };

        row.appendChild( controller );
        this.appendChild( row );

        // Remember

        if ( object !== this.vars ) {

            var objectKey = Gui.serialize( object );
            var objectControllers = this._controllersByObject[ objectKey ];

            if ( !objectControllers ) {
                objectControllers = {};
                this._controllersByObject[ objectKey ] = objectControllers;
            }

            objectControllers[ controller.path ] = controller;

        }

        return controller;

    },

    remove: function( controller ) {

        this.removeChild( controller );

        // Forget

        var objectKey = Gui.serialize( controller.object );
        controller.objectKey = objectKey;

        var objectControllers = this._controllersByObject[ objectKey ];
        objectControllers.splice( objectControllers.indexOf( controller ), 1 );

    },

    var: function( name, initialValue ) {

        var args = [ this.vars, name ];
        args = args.concat( Array.prototype.slice.call( arguments, 2 ) );

        this.vars[ name ] = initialValue;

        return this.add.apply( this, args );

    },

    save: function() {

        if ( this.localStorage && window.localStorage ) {

            var data = JSON.stringify( this.serialize() );
            localStorage.setItem( Gui.LOCAL_STORAGE_KEY, data );

        } else {

            // todo: success
            Gui.postJSON( this.savePath, this.serialize(), this.saveSuccess, this.saveError, this );

        }

    },

    saveSuccess: function() {

        Gui.log( 'Saved data to ' + this.savePath );

    },

    saveError: function( error ) {

        Gui.warn( 'Failed to post data to ' + this.savePath + '. Disabling save.' );
        this.removeEventListener( 'change', this._debouncedSave, false );

    },

    unserialize: function( data ) {

        for ( var objectKey in this._controllersByObject ) {

            for ( var path in data.values[ objectKey ] ) {

                var value = data.values[ objectKey ][ path ];
                this._controllersByObject[ objectKey ][ path ].unserialize( value );

            }

        }

    },

    serialize: function() {

        // todo: return json of every controller's serialize.

        var data = {
            values: {},
            vars: {}, // todo
        };

        for ( var objectKey in this._controllersByObject ) {

            data.values[ objectKey ] = {};

            var controllers = this._controllersByObject[ objectKey ];

            for ( var path in controllers ) {
                data.values[ objectKey ][ path ] = controllers[ path ].serialize();
            }

        }

        return data;

    },

    // Legacy
    // ------------------------------- 

    remember: function( object ) {

        Gui.warn( 'gui.remember() is deprecated. You don\'t need to do it anymore. See Gui.serialize.' );

    },

    listenAll: function() {

        Gui.warn( 'gui.listenAll() is deprecated. All controllers are listened for free.' );

    },


    // Observers
    // -------------------------------

    openChanged: function() {

        if ( this.open || this.docked ) {

            // let the style sheet take care of things
            this.$.container.style.transform = '';
            this.$.panel.style.transform = '';

        } else {

            // todo: need the rest of the vendor prefixes ...
            // wish i could pipe javascript variables into styl.
            var y = -this.$.controllers.offsetHeight + 'px';
            this.$.container.style.transform = 'translate3d( 0, ' + y + ', 0 )';

        }

        this.asyncFire( 'resize' );

    },

    dockedChanged: function() {

        this.openChanged();

    },


    // Events
    // -------------------------------

    tapClose: function() {
        this.open = !this.open;
    },

    toggleOpen: function() {
        this.open = !this.open;
    }

} );
