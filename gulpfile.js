var gulp    = require( 'gulp' ),
    stylus  = require( 'gulp-stylus' ),
    plates  = require( 'gulp-plates' ),
    rename  = require( 'gulp-rename' ),
    vulcan  = require( 'gulp-vulcanize' ),
    insert  = require( 'gulp-insert' ),
    replace = require( 'gulp-replace' ),
    clean   = require( 'gulp-clean' ),
    nib     = require( 'nib' ),
    fs      = require( 'fs' ),
    marked  = require( 'marked' ),
    karma   = require( 'karma' );

gulp.task( 'default', [ 'build' ], function() {
    
    karma.server.start( {
        frameworks: [ 'jasmine' ],
        files: [
          'build/gui.js',
          'tests/*.js'
        ]
    } );

    gulp.watch( [ 'elements/**/*.styl', 'elements/**/*.html', 'elements/**/*.js', 'gui.html' ], [ 'build' ] );
    gulp.watch( [ 'README.md', 'docs/*' ], [ 'docs' ] );

} );

gulp.task( 'build', [ 'vulcanize' ], function() {

    return gulp.src( 'build/gui.html' )
        .pipe( replace( /\\/g, "\\\\" ) )
        .pipe( replace( /'/g, "\\'" ) )
        .pipe( replace( /^(.*)$/gm, "'$1'," ) )
        .pipe( insert.wrap( 'document.write([', '].join("\\n"))' ) )
        .pipe( rename( 'gui.js' ) )
        .pipe( gulp.dest( 'build' ) );

} );

gulp.task( 'vulcanize', [ 'css' ], function() {

    return gulp.src( 'gui.html' )
        .pipe( vulcan( { 
            dest: 'build', 
            inline: true,
            strip: true 
        } ) );

} );

gulp.task( 'css', function() {

    return css( 'elements/*/*.styl', 'elements' );

} );

gulp.task( 'docs', function() {
        
    css( 'docs/*.styl', 'docs' );

    var content = {
        readme: marked( fs.readFileSync( 'README.md', 'utf8' ) )
    };

    gulp.src( 'docs/template.html' )
        .pipe( plates( content ) )
        .pipe( rename( 'index.html' ) )
        .pipe( gulp.dest( './' ) );

} );

gulp.task( 'clean', function() {

    return gulp.src( [ 'build/*', '**/*.css' ] )
               .pipe( clean() );

} );

function css( src, dest ) {

    return gulp.src( src )
        .pipe( stylus( { use: [ nib() ] } ) )
        .pipe( gulp.dest( dest ) );

}