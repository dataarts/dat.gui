describe( 'Gui', function() {

    it( 'exists', function() {

        expect( Gui ).toBeDefined();

    } );

    it( 'has a ready callback', function() {

        var ready = {
            ready: function() {}
        };

        spyOn( ready, 'ready' );

        runs( function() {
            Gui.ready( ready.ready );
        } );

        waits( 100 );

        runs( function() {
            expect( ready.ready ).toHaveBeenCalled();
        } );

    } );

    it( 'picks the right controller for the job', function() {

        function expectController( controllerType, value ) {
            expect( Gui.getController( value ).nodeName.toLowerCase() ).toBe( controllerType );
        }

        expectController( 'controller-number', 1234 );
        expectController( 'controller-string', 'string value' );
        expectController( 'controller-function', function(){} );
        expectController( 'controller-boolean', true );

        expectController( 'controller-color', '#00ff00' );
        expectController( 'controller-color', '#aba' );

        expectController( 'controller-color', 'rgba(255, 0, 255, 0.2)' );
        expectController( 'controller-color', 'rgb(255, 0, 255)' );

        expectController( 'controller-color', 'hsl(240, 100%, 50%)' );
        expectController( 'controller-color', 'hsla(255, 100%, 40%, 0.5)' );

    } );
  
} );