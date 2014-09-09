/* globals Polymer */

// [ ] scrolling when docked
// [ ] scrolling when window short and not docked

Polymer( 'dat-gui', {

    docked: false,
    open: true,
    touch: ( 'ontouchstart' in window ) || ( !!window.DocumentTouch && document instanceof window.DocumentTouch ),

    
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
