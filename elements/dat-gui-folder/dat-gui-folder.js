/* globals Polymer */

Polymer( 'dat-gui-folder', {

    parent: null,
    open: false,

    add: function() {
        var controller = this.parent.add.apply( this.parent, arguments );
        this.appendChild( controller.row );
        return controller;
    },

    var: function() {
        var controller = this.parent.var.apply( this.parent, arguments );
        this.appendChild( controller.row );
        return controller;
    },


    // Events
    // ------------------------------- 
    
    tap: function() {
        this.open = !this.open
    }

} );
