describe('Gui', function() {

    it( 'exists', function() {

        expect( Gui ).toBeDefined();

    });

    it( 'has a ready callback', function() {

        var ready = {
            ready: function() {}
        };

        spyOn( ready, 'ready' );

        runs( function() {
            Gui.ready( ready.ready );
        } );

        waits( 10 );

        runs( function() {
            expect( ready.ready ).toHaveBeenCalled();
        } );

    } );
  
});