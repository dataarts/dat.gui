/* globals Polymer */

Polymer( 'gui-row', {

    comment: null,
    commentOpen: false,
    disabled: false,

    ready: function() {},

    openComment: function() {
        this.commentOpen = true;
    },

    closeComment: function() {
        this.commentOpen = false;
    }

} );
