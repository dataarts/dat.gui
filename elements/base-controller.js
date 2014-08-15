/*

[ ] onChange( )
[ ] onFinishChange( )

*/

Polymer('base-controller', {

    value: null,
    object: null,
    property: null,

    ready: function() {

        var _this = this;
        this.update();

    },

    bind: function() {

        if ( this._observer ) {
            this._observer.close();            
            delete this._observer;
        }

        var _this = this;

        this._observer = new PathObserver( this.object, this.property );
        this._observer.open( function( newValue ) {

            _this.value = newValue;

        } );


        this.value = this.object[ this.property ];
        
    },

    update: function() {},

    listen: function() {

        console.warn( 'controller.listen() is deprecated. All controllers are listened for free.' );

    },


    // Observers
    // ------------------------------- 

    objectChanged: function( oldObject, newObject ) {


        if ( newObject && this.property ) {
            this.bind();
        }

    },

    propertyChanged: function( oldProperty, newProperty ) {

        if ( newProperty && this.object ) {
            this.bind();
        }

    },

    valueChanged: function() {

        if ( this.object && this.property ) {
            this.object[ this.property ] = this.value;
        }
        
        this.update();

    },


    // Helpers
    // ------------------------------- 

    map: function( x, a, b, c, d ) {
        return ( x - a ) / ( b - a ) * ( d - c ) + c;
    }

});