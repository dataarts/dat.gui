Gui.register( 'controller-boolean', function( value ) {
  
    return typeof value == 'boolean';

} );

Polymer( 'controller-boolean', {

    ready: function() {
        

    },

    toggle: function() {

        console.log( 'hi' );
        this.value = !this.value;

    }
    
    
    
    

});
