/*

[ ] onChange( )
[ ] onFinishChange( )

*/

Polymer('controller-base', {

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

        if ( this._observer ) {
            this._observer.close();            
            delete this._observer;
        }

        var _this = this;

        this._observer = new PathObserver( this.object, this.path );
        this._observer.open( function( newValue ) {

            _this.value = newValue;

        } );

        this.value = this.object[ this.path ];

    },

    valueChanged: function() {

        if ( this._observer ) {
            
            Path.get( this.path ).setValueFrom( this.object, this.value );

        }
        
        this.update();

    },


    // Helpers
    // ------------------------------- 

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

    }
        

});