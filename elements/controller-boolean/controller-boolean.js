Gui.register( 'controller-boolean', function( value ) {
  
    return typeof value == 'boolean';

} );

Polymer( 'controller-boolean', {

    ready: function() {
        

    },

    change: function() {
        
        this.value = this.$.input.checked;

    }
    
    

});
