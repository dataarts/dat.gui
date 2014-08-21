/*

[ ] build without platform bundled

*/

var gulp    = require( 'gulp' ),
    $       = require( 'gulp-load-plugins' )( { 'pattern': '*' } ); // need the star for nib ... 

var paths = {
    main:   'gui.html',
    css:    'elements/**/*.styl',
    html:   'elements/**/*.html',
    js:     'elements/**/*.js',
    tests:  'tests/*'
}

gulp.task( 'css', function() {

    gulp.src( paths.css )
        .pipe( $.stylus( { use: [ $.nib() ] } ) )
        .pipe( gulp.dest( 'elements' ) );

} );

gulp.task( 'vulcanize', function() {

    gulp.src( paths.main )
        .pipe( $.vulcanize( { 
            dest: 'build', 
            inline: true
            // strip: true 
        } ) );

} );

gulp.task( 'readme', function() {
  
    gulp.src( 'README.md' ).pipe( $.markdown() ).pipe( gulp.dest( './' ) );

} );

gulp.task( 'test', function() {

    return gulp.src( 'tests/legacy.html' ).pipe( $.qunit() );

} );

gulp.task( 'build', [ 'css', 'vulcanize', 'test' ] );

gulp.task( 'default', function() {

    gulp.watch( [ paths.css ], [ 'css', 'vulcanize' ] );
    gulp.watch( [ paths.js, paths.main, paths.html ], [ 'vulcanize', 'test' ] );

    // gulp.watch( [ paths.tests, 'test' ] ); // not working? 

    gulp.watch( [ 'README.md' ], [ 'readme' ] );


} );



