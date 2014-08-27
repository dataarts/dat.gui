Gui.register( 'controller-boolean', function( value ) {
  
    return typeof value == 'boolean';

} );

Polymer( 'controller-boolean', {

    ready: function() {
        

    },

    change: function() {
        
        this.value = this.$.input.checked;

    },

    update: function() {

        // should i really have to do this?
        this.$.input.checked = this.value;

    }
    
    
    

});
