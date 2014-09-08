var gulp        = require( 'gulp' ),
    nib         = require( 'nib' ),
    fs          = require( 'fs' ),
    marked      = require( 'marked' ),
    karma       = require( 'karma' ),
    browserSync = require( 'browser-sync' ),
    $           = require( 'gulp-load-plugins' )();

var paths = {
    build:  [ 'elements/**/*.styl', 'elements/**/*.html', 'elements/**/*.js' , 'gui.html' ],
    lint:   [ 'gulpfile.js', 'elements/**/*.js' ],
    test:   [ 'build/gui.js', 'tests/*.js' ],
    clean:  [ 'build/*', '**/*.css' ],
    docs:   [ 'README.md', 'docs/*' ]
};

gulp.task( 'default', [ 'docs', 'lint', 'build' ] );

gulp.task( 'watch', [ 'default' ], function() {

    karma.server.start( {
        frameworks: [ 'jasmine' ],
        files: paths.test
    } );

    gulp.watch( paths.docs, [ 'docs' ] );
    gulp.watch( paths.lint, [ 'lint' ] );
    gulp.watch( paths.build, [ 'build' ] );

} );

gulp.task( 'build', [ 'vulcanize' ], function() {

    return gulp.src( 'build/gui.html' )
       .pipe( $.replace( /\\/g, '\\\\' ) )
       .pipe( $.replace( /'/g, '\\\'' ) )
       .pipe( $.replace( /^(.*)$/gm, '\'$1\',' ) )
       .pipe( $.insert.wrap( 'document.write([', '].join("\\n"))' ) )
       .pipe( $.rename( 'gui.js' ) )
       .pipe( gulp.dest( 'build' ) );

} );

gulp.task( 'vulcanize', [ 'css' ], function() {

    return gulp.src( 'gui.html' )
        .pipe( $.vulcanize( {
            dest: 'build',
            inline: true,
            strip: true
        } ) )
       // clean up some vulcanize ... 
       .pipe( $.replace( /\n\n/gm, '' ) )
       .pipe( $.replace( /<!-- .* -->/gm, '' ) )
       .pipe( $.replace( /^<div hidden>undefined<\/div>\n/gm, '' ) )
       .pipe( gulp.dest( 'build' ) );

} );

gulp.task( 'lint', [ 'jscs', 'jshint' ] );

gulp.task( 'jscs', function() {

    return gulp.src( paths.lint )
       .pipe( $.jscs() );

} );

gulp.task( 'jshint', function() {

    return gulp.src( paths.lint )
        .pipe( browserSync.reload( { stream: true, once: true } ) )
        .pipe( $.jshint( '.jshintrc' ) )
        .pipe( $.jshint.reporter( 'jshint-stylish' ) )
        .pipe( $.if( !browserSync.active, $.jshint.reporter( 'fail' ) ) );

} );


gulp.task( 'css', function() {

    return css( 'elements/**/*.styl', 'elements' );

} );

gulp.task( 'docs', function() {

    css( 'docs/*.styl', 'docs' );

    var content = {
        readme: marked( fs.readFileSync( 'README.md', 'utf8' ) )
    };

    return gulp.src( 'docs/template.html' )
        .pipe( $.plates( content ) )
        .pipe( $.rename( 'index.html' ) )
        .pipe( gulp.dest( './' ) );

} );

gulp.task( 'clean', function() {

    return gulp.src( paths.clean )
        .pipe( $.rimraf() );

} );

function css( src, dest ) {

    return gulp.src( src )
        .pipe( $.stylus( { use: [ nib() ] } ) )
        .pipe( gulp.dest( dest ) );

}
