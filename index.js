var object = { 
    "listen4Free": 0,
    "step": 10,
    "straddleZero": 0,
    "maxIsNegative": -2,
    "hasComment": 0
};

// How do we kill polymer-ready ... 
document.addEventListener( 'polymer-ready', function() {

    var gui = new GUI();
    
    gui.add( object, 'listen4Free' );
    gui.add( object, 'listen4Free' );
    gui.add( object, 'listen4Free' );
    
    gui.add( object, 'hasComment' ).comment( 'Hi there.' );

    gui.add( -2, 'anonymousSlider', -5, -2 );

    gui.add( object, 'listen4Free' ).name( 'customName' )

    gui.add( object, 'step', 0, 50, 5 ).comment( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam semper dui metus, sed aliquet nulla fermentum nec. Sed massa felis, congue nec libero ut, condimentum hendrerit purus. Cras a cursus ante. Integer nec nibh vitae lacus convallis viverra in at urna. Donec hendrerit convallis lacus, nec condimentum neque aliquam ac. Sed suscipit leo vel ligula condimentum scelerisque. Aliquam fermentum sagittis nisi vitae accumsan. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In et dolor eros. Sed vel venenatis odio, quis porta mi. Ut sed commodo velit, in porta ante.' );

    gui.add( object, 'straddleZero', -1, 1, 0.01 ).comment( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam semper dui metus, sed aliquet nulla fermentum nec. ' );;

    gui.add( object, 'maxIsNegative', -5, -2 );

});