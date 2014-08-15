var object = { 
    "listen4Free": 25,
    "step": 10,
    "straddleZero": 0,
    "maxIsNegative": -2,
};

// How do we kill polymer-ready ... 
document.addEventListener( 'polymer-ready', function() {

    var gui = new GUI();
    gui.add( object, 'listen4Free' );
    gui.add( object, 'listen4Free' );
    gui.add( object, 'listen4Free' );
    gui.add( object, 'listen4Free' ).name( 'customName' );
    gui.add( object, 'step', 0, 50, 5 );
    gui.add( object, 'straddleZero', -5, 5 );

    var c = gui.add( object, 'maxIsNegative', -5, -2 );

});