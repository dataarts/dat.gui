'use strict';

Gui.ready( init );

function init() {

    var elements = document.querySelectorAll( '#readme h3' );

    for ( var i = 0; i < elements.length; i++ ) {

        var initExample = examples[ elements[i].id ] || examples['default'];

        elements[i].example = initExample();

    }

    sticky( elements );

}


        
// Sticky headers
// ------------------------------- 

function sticky( elements ) {

    for ( var el, i = 0, l = elements.length; i < l; i++ ) {

        el = elements[ i ];

        el.sticky = el.cloneNode( true );
        el.sticky.removeAttribute( 'id' );
        el.sticky.style.position = 'fixed';
        el.sticky.style.visibility = 'hidden';
        el.sticky.style.zIndex = i;
        el.sticky.classList.add( 'sticky' );

        el.parentElement.insertBefore( el.sticky, el );

        measure( el );

        if ( i > 0 ) {
            elements[ i - 1 ].next = el;
        }

    }

    function measure( el ) {

        el.top = el.offsetTop;
        el.sticky.height = el.sticky.offsetHeight;

    }

    function resize() {

        for ( var i = 0, l = elements.length; i < l; i++ ) {
            
            measure( elements[ i ] );

        }

    }

    function onScroll() {

        for ( var el, i = 0, l = elements.length; i < l; i++ ) {
            
            el = elements[ i ];

            var sticky = window.scrollY > el.top && window.scrollY <= el.next.top;
            el.sticky.style.visibility = sticky ? 'visible' : 'hidden';

            el.example.classList.toggle( 'sticky', sticky || el.bumped );

            if ( el.next ) el.next.bumped = false;

            if ( el.next && sticky ) {

                var bottom = window.scrollY + el.sticky.height;
                var bumped = bottom > el.next.top;

                el.sticky.style.marginTop = Math.round( Math.min( 0, el.next.top - bottom ) ) + 'px';
                el.sticky.classList.toggle( 'sticky-prev', bumped );

                el.next.classList.toggle( 'sticky-next', bumped );

                if ( bumped ) {

                    el.example.classList.remove( 'sticky' );
                    el.next.example.classList.add( 'sticky' );
                    el.next.bumped = true;

                }

            }

        }

    }

    document.addEventListener( 'scroll', onScroll );

    // should debounce
    window.addEventListener( 'resize', function() {
     
        resize();
        onScroll();

    } );

    onScroll();

}

// Smooth scroll

(function() {

    var body = document.body, timer;

    window.addEventListener('scroll', function() {
        
        clearTimeout( timer );

        if ( !body.classList.contains('disable-hover') ) {
            body.classList.add('disable-hover')
        }

        timer = setTimeout(function() {
            body.classList.remove('disable-hover')
        }, 150);

    }, false);

})();
