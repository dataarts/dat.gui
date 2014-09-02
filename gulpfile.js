/*

[ ] build without platform bundled

*/

var gulp    = require( 'gulp' ),
    stylus  = require( 'gulp-stylus' ),
    plates  = require( 'gulp-plates' ),
    rename  = require( 'gulp-rename' ),
    vulcan  = require( 'gulp-vulcanize' ),
    nib     = require( 'nib' ),
    fs      = require( 'fs' ),
    marked  = require( 'marked' ),
    karma   = require( 'karma' ).server;

var paths = {
    main:   'gui.html',
    css:    'elements/**/*.styl',
    html:   'elements/**/*.html',
    js:     'elements/**/*.js',
};

function stylus( src, dest ) {

    gulp.src( src )
        .pipe( stylus( { use: [ nib() ] } ) )
        .pipe( gulp.dest( dest ) );

}

gulp.task( 'docs', function() {
        
    stylus( 'docs/*.styl', 'docs' );

    var content = {
        readme: marked( fs.readFileSync( 'README.md', 'utf8' ) )
    }

    gulp.src( 'docs/template.html' )
        .pipe( plates( content ) )
        .pipe( rename( 'index.html' ) )
        .pipe( gulp.dest( './' ) );

} );

gulp.task( 'css', function() {

    stylus( paths.css, 'elements' );

} );

gulp.task( 'vulcanize', function() {

    gulp.src( paths.main )
        .pipe( vulcan( { 
            dest: 'build', 
            inline: true
            // strip: true 
        } ) );

} );

gulp.task( 'test', function( done ) {

    karma.start( {
        // browsers: [ 'Chrome' ],
        frameworks: [ 'jasmine' ],
        files: [
          '../platform/platform.js',
          'build/gui.html',
          'tests/*.js'
        ],
        // singleRun: true
    }, done );

} );

gulp.task( 'build', [ 'css', 'vulcanize', 'test', 'docs' ] );

gulp.task( 'default', function() {

    gulp.watch( [ paths.css ], [ 'css', 'vulcanize' ] );
    gulp.watch( [ paths.js, paths.main, paths.html ], [ 'vulcanize' ] );
    // gulp.watch( [ 'build/gui.html', 'tests/*.js' ], [ 'test' ] );
    gulp.watch( [ 'README.md', 'docs/*' ], [ 'docs' ] );

} );



