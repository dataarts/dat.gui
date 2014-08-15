Polymer('base-controller', {

    value: null,
    object: null,
    property: null,

    ready: function() {

        var _this = this;
        this._observer = function( changes ) {

            changes.forEach( function( c ) {

                if ( c.name == _this.property ) {
                    _this.value = _this.object[ _this.property ];
                }

            } );

        };
        
        this.update();

    },


    // Observers
    // ------------------------------- 

    objectChanged: function( oldObject, newObject ) {

        if ( oldObject && this.property ) {
            this.unbind( oldObject );
        }

        if ( newObject && this.property ) {
            this.bind();
        }

    },

    propertyChanged: function( oldProperty, newProperty ) {

        if ( oldProperty && this.object ) {
            this.unbind( this.object );
        }

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

    bind: function() {

        Object.observe( this.object, this._observer );
        this.value = this.object[ this.property ];
        
    },

    unbind: function( object ) {

        Object.unobserve( object, this._observer );

    },

    update: function() {},

        
    // Helpers
    // ------------------------------- 

    map: function( x, a, b, c, d ) {
        return ( x - a ) / ( b - a ) * ( d - c ) + c;
    }

});