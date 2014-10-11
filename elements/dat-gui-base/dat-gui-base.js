/* globals Gui, Polymer, PathObserver */

Polymer( 'dat-gui-base', {

    ready: function() {

        this.update();

    },


    // Overrides
    // ------------------------------- 

    // Update the UI
    update: function() {},

    // Process arguments from gui.add
    init: function() {},

    // Return a valid JSON representation of value
    serialize: function() {

        return JSON.stringify( this.value );

    },

    // Parse and set JSON representation of value;
    unserialize: function( obj ) {

        this.value = JSON.parse( obj );

    },


    // Observers
    // -------------------------------

    ignore: function() {

        // todo: makes the data binding one way

    },

    watch: function( object, path ) {

        this.object = object;
        this.path = path;

        this.bind( 'value', new PathObserver( this.object, this.path ) );

    },

    valueChanged: function() {

        if ( this.__firstChange ) {
            this.fire( 'change', this.value );
        }
        this.__firstChange = true;

        this.update();

    },


    // Helpers
    // -------------------------------

    on: function( event, listener ) {

        this.addEventListener( event, listener );
        return this;

    },

    map: function( x, a, b, c, d ) {

        return ( x - a ) / ( b - a ) * ( d - c ) + c;

    },


    // Legacy
    // -------------------------------

    listen: function() {

        Gui.warn( 'controller.listen() is deprecated. All controllers are listened for free.' );

        return this;

    },

    getValue: function() {

        return this.value;

    },

    setValue: function( v ) {

        this.value = v;
        return this;

    },

    onChange: function( v ) {

        var _this = this;

        this.addEventListener( 'change', function( e ) {

            v( e.detail );

        } );

        return this;

    },

    onFinishChange: function( v ) {

        return this.onChange( v );

    },

    disable: function( disabled ) {
        
        if ( disabled === undefined ) {
            disabled = true;
        }

        this.row.disabled = disabled;

        return this;

    }

} );
