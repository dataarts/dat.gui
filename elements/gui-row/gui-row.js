/*

[ ] comment hover behavior

*/

Polymer('gui-row', {

    comment: null,

    commentOpen: false,

    ready: function() {


    },

    openComment: function() {
        this.commentOpen = true;
    },

    closeComment: function() {
        this.commentOpen = false;
    }

});