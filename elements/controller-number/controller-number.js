/*

[ ] arrow keys

[ ] min( ) max( ) step( ) commands of yore

[x] only validate input box on blur, not on keydown
[x] enter key blurs
[x] decimals
[x] step
[x] dy to drag friction
[x] negative slider
[x] hover behavior

*/

Polymer('controller-number', {

    min: 0,
    max: 100,
    step: null,
    decimals: 3,
    value: 50,

    ready: function() {

        var _this = this;

        window.addEventListener( 'keydown', function( e ) {
            if ( e.keyCode == 18 ) _this._alt = true;
        }, false );

        window.addEventListener( 'keyup', function( e ) {
            if ( e.keyCode == 18 ) _this._alt = false;
        }, false );

        this.super();

    },


    // Observers
    // ------------------------------- 

    valueChanged: function() {

        if ( this.step !== null ) {
            this.value = Math.round( this.value / this.step ) * this.step;
        }

        this.value = Math.max( this.value, this.min );
        this.value = Math.min( this.value, this.max );
        
        this.super();
    },

    minChanged: function() {
        this.value = Math.max( this.value, this.min );
        this.update();
    },

    maxChanged: function() {
        this.value = Math.min( this.value, this.max );
        this.update();
    },

    update: function() {
        
        var ratio = this.map( this.value, this.min, this.max, 0, 1 );

        if ( this.min < 0 && this.max > 0 ) {

            this.$.container.classList.add( 'straddle-zero' );

            var zero = this.map( 0, this.min, this.max, 0, 1 );

            if ( this.value >= 0 ) {

                this.$.fill.style.left = zero * 100 + '%';
                this.$.fill.style.width = (ratio - zero) * 100 + '%';
                this.$.fill.style.right = '';

            } else { 

                this.$.fill.style.left = '';
                this.$.fill.style.width = (zero - ratio) * 100 + '%';
                this.$.fill.style.right = ( 1 - zero ) * 100 + '%';

            }

        } else { 

            this.$.container.classList.remove( 'straddle-zero' );

            if ( this.max > 0 ) {

                this.$.fill.style.left = 0;
                this.$.fill.style.width = ratio * 100 + '%';
                this.$.fill.style.right = '';

            } else { 

                this.$.fill.style.left = '';
                this.$.fill.style.width = ( 1 - ratio ) * 100 + '%';
                this.$.fill.style.right = 0;

            }

        }

        this.$.knob.style.left = ratio * 100 + '%';

        this.$.container.classList.toggle( 'positive', this.value >= 0 );
        this.$.container.classList.toggle( 'negative', this.value < 0 );

        this.super();

    },


    // Events
    // ------------------------------- 
    
    click: function( e ) {
        this.$.input.select();
    },

    down: function( e ) {
        e.preventDefault();
        this._rect = this.$.track.getBoundingClientRect();
        if ( !this._alt ) this.value = this.valueFromX( e.x );
    },

    up: function( e ) {
        // this.$.container.classList.add( 'transition' );
    },

    trackstart: function( e ) {
        // this.$.container.classList.remove( 'transition' );
        this._dragFriction = 1;
    },

    trackx: function( e ) {

        if ( this.step == null ) {

            var dv = this.valueFromDX( e.ddx );
            if ( this._alt ) dv /= 10;
            this.value += dv * this._dragFriction;

        } else {
            
            this.value = this.valueFromX( e.pageX );

        }
    },

    tracky: function( e ) {

        this._dragFriction = Math.max( 0.01, Math.min( 1, this.map( e.dy, 50, 300, 1, 0.1 ) ) );
        
    },

    blur: function( e ) {
        var v = parseFloat( this.$.input.value );
        if ( v === v ) {
            this.value = v;
        }
    },

    keydown: function( e ) {
        if ( e.keyCode == 13 ) {
            this.$.input.blur();
        }
    },


    // Filters
    // ------------------------------- 

    truncate: function( v ) {

        if ( v % 1 !== 0 && this.decimals !== null ) {
            return this.limitDecimals( v, this.decimals );
        } else { 
            return v;
        }

    },
    

    // Helpers
    // ------------------------------- 

    limitDecimals: function( v, maxDecimals ) {

        var str = v.toString();
        var numDecimals = str.substring( str.indexOf( '.' ) + 1 ).length;

        str = v.toFixed( Math.min( numDecimals, this.decimals ) );
        
        for ( var z, i = 0, l = str.length; i < l; i++ ) {
            if ( str.charAt( i ) !== '0' ) {
                z = i;
            }
        }

        return str.substring( 0, z+1 );

    },
    
    valueFromX: function( x ) {
        return this.map( x, this._rect.left, this._rect.right, this.min, this.max );
    },

    valueFromDX: function( dx ) {
        return this.map( dx, 0, this._rect.width, 0, this.max - this.min );
    }

});