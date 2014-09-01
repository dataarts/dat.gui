/*

[ ] build without platform bundled

*/

var gulp    = require( 'gulp' ),
    fs      = require( 'fs' ),
    $       = require( 'gulp-load-plugins' )( { 'pattern': '*' } );

var paths = {
    main:   'gui.html',
    css:    'elements/**/*.styl',
    html:   'elements/**/*.html',
    js:     'elements/**/*.js',
}

function stylus( src, dest ) {

    gulp.src( src )
        .pipe( $.stylus( { use: [ $.nib() ] } ) )
        .pipe( gulp.dest( dest ) );

}

gulp.task( 'css', function() {

    stylus( paths.css, 'elements' );

} );

gulp.task( 'vulcanize', function() {

    gulp.src( paths.main )
        .pipe( $.vulcanize( { 
            dest: 'build', 
            inline: true
            // strip: true 
        } ) );

} );

gulp.task( 'docs', function() {
        
    stylus( 'docs/*.styl', 'docs' );

    var content = {
        readme: $.marked( fs.readFileSync( 'README.md', 'utf8' ) )
    }

    gulp.src( 'docs/template.html' )
        .pipe( $.plates( content ) )
        .pipe( $.rename( 'index.html' ) )
        .pipe( gulp.dest( './' ) );

} );

gulp.task( 'test', function() {

} );

gulp.task( 'build', [ 'css', 'vulcanize', 'test', 'docs' ] );

gulp.task( 'default', function() {

    gulp.task( 'build' );

    gulp.watch( [ paths.css ], [ 'css', 'vulcanize' ] );
    gulp.watch( [ paths.js, paths.main, paths.html ], [ 'vulcanize', 'test' ] );
    gulp.watch( [ 'README.md', 'docs/*' ], [ 'docs' ] );

} );



