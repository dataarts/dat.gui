describe( 'Gui', function() {

    it( 'exists', function() {

        expect( Gui ).toBeDefined();

    } );

    it( 'has a ready callback', function() {

        var ready = {
            ready: function() {}
        };

        spyOn( ready, 'ready' );

        expect( Gui.ready ).toBeDefined();

        runs( function() {
            Gui.ready( ready.ready );
        } );

        waits( 100 );

        runs( function() {
            expect( ready.ready ).toHaveBeenCalled();
        } );

    } );

    it( 'picks the right controller for the job', function() {

        expectController( 'dat-gui-number', 1234 );
        expectController( 'dat-gui-string', 'string value' );
        expectController( 'dat-gui-function', function() {} );
        expectController( 'dat-gui-boolean', true );

        expectController( 'dat-gui-option', 'hey', [ 'hey', 'hi', 'ho' ] );
        expectController( 'dat-gui-option', 'a', { a: 'a', b: 'b', c: 'c' } );

        // expectController( 'controller-color', '#00ff00' );
        // expectController( 'controller-color', '#aba' );

        // expectController( 'controller-color', 'rgba(255, 0, 255, 0.2)' );
        // expectController( 'controller-color', 'rgb(255, 0, 255)' );

        // expectController( 'controller-color', 'hsl(240, 100%, 50%)' );
        // expectController( 'controller-color', 'hsla(255, 100%, 40%, 0.5)' );

    } );


    function expectController( controllerType, value ) {

        var gui = new Gui();

        // test using gui.add

        var params = {
            'name': value
        };

        var args = Array.prototype.slice.call( arguments, 2 );
        args.unshift( 'name' );
        args.unshift( params );

        var controller = gui.add.apply( gui, args );
        expect( controller.nodeName.toLowerCase() ).toBe( controllerType );

        // test using gui.anon

        var gui = new Gui();

        args = Array.prototype.slice.call( arguments, 2 );
        args.unshift( value );
        args.unshift( 'name' );

        controller = gui.var.apply( gui, args );
        expect( controller.nodeName.toLowerCase() ).toBe( controllerType );

    }

} );
