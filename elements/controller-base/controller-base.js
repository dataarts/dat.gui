/* globals Gui, Polymer, PathObserver */


// [ ] onFinishChange()

Polymer( 'controller-base', {

    ready: function() {

        this.update();

    },

    update: function() {},

    init: function() {},


    // Observers
    // -------------------------------

    watch: function( object, path ) {

        this.object = object;
        this.path = path;

        this.bind( 'value', new PathObserver( this.object, this.path ));

    },

    valueChanged: function() {

        this.update();
        this.fire( 'change', this.value );

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

        Gui.warn( 'controller.listen() is deprecated. ' +
           'All controllers are listened for free.' );
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

        this.addEventListener( 'change', function( e ) {
            
            v( e.detail );

        } );

        return this;

    },

} );
