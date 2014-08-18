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
        this.$.comment.style.height = this.$.commentInner.offsetHeight + 'px';
    },

    closeComment: function() {
        this.commentOpen = false;
        this.$.comment.style.height = '';
    }

});