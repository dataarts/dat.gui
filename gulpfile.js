/*

Main Gulp tasks
-----------------

    * default - dev

    * build - create a vulcanized compiled version after linting and formatting
    * dev - launch server, watch for code changes, lint, format
    * docs - compile the docs and update gh-pages
    * release - build js and docs and update version tag
    * test - run the tests
    * watch - watch for code changes and update styles but serve it yourself

Gulp tasks used by the main gulp tasks
--------------------------------------

    * clean - remove build files
    * style - convert stylus to css
    * fmt - format the js with esformater
    * lint - lint the js with jshint
    * readme - convert the readme.md into interactive html doc
    * reload - reload the webserver
    * serve - start the webserver
    * shim - create the shim loader
    * vulcanize - vulcanize the into one file

*/

var gulp = require( 'gulp' );

gulp.task( 'default', [ 'dev' ] );

gulp.task( 'build', [ 'readme', 'vulcanize', 'shim' ], function() {
    return gulp.src( 'build/dat-gui.html' )
        .pipe( $.replace( /\\/g, '\\\\' ) )
        .pipe( $.replace( /'/g, '\\\'' ) )
        .pipe( $.replace( /^(.*)$/gm, '\'$1\',' ) )
        .pipe( $.insert.wrap( 'document.write([', '].join("\\n"))' ) )
        .pipe( $.rename( 'dat-gui.js' ) )
        .pipe( gulp.dest( 'build' ) );

} );

gulp.task( 'dev', [ 'watch', 'serve' ] );

gulp.task( 'docs', [ 'style', 'readme' ] );

gulp.task( 'release', function() {
    console.log( 'Task not yet implemented.' );
} );

gulp.task( 'test', function() {

    karma.server.start( {
        frameworks: [ 'jasmine' ],
        files: paths.test
    } );

} );

gulp.task( 'watch', [ 'lint', 'build', 'test' ], function() {
    // watches and builds all tasks

    gulp.watch( paths.build, [ 'build' ] );
    gulp.watch( paths.docs, [ 'readme' ] );
    gulp.watch( paths.styl, [ 'style' ] );

    // gulp.watch( paths.html.concat( paths.styl )
    //     .concat( paths.js ).concat( paths.shim )
    //     .concat( paths.docs ), [ 'reload' ] );

    // fmt
    // $.watch( paths.js, {
    //     base: './'
    // } )
    //     .pipe( $.esformatter( formattingOptions ) )
    //     .pipe( gulp.dest( './' ) )
    //     .pipe( $.jshint( '.jshintrc' ) )
    //     .pipe( $.jshint.reporter( 'default' ) )
    //     .pipe( $.jshint.reporter( 'fail' ) );

} );

////////////////////////////////////////////////

gulp.task( 'clean', function() {
    return gulp.src( 'build/*' )
        .pipe( $.rimraf() );
} );

gulp.task( 'style', function() {
    return gulp.src( paths.styl, {
        base: './'
    } )
        .pipe( $.stylus( {
            use: [ nib() ]
        } ) )
        .pipe( gulp.dest( './' ) )
        .pipe( $.filter( '**/*.css' ) )
        .pipe( $.if( browserSync.active, browserSync.reload( {
            stream: true
        } ) ) );

} );

gulp.task( 'fmt', function() {

    // return gulp.src( paths.js, {
    //     base: './'
    // } )
    //     .pipe( $.esformatter( formattingOptions ) )
    //     .pipe( gulp.dest( './' ) );

} );

gulp.task( 'lint', [ 'fmt' ], function() {

    // return gulp.src( paths.js )
    //     .pipe( browserSync.reload( {
    //         stream: true,
    //         once: true
    //     } ) )
    //     .pipe( $.jshint( '.jshintrc' ) )
    //     .pipe( $.jshint.reporter( 'default' ) )
    //     .pipe( $.if( !browserSync.active, $.jshint.reporter( 'fail' ) ) );

} );

gulp.task( 'readme', function() {
    return gulp.src( 'README.md' )
        .pipe( $.marked( { // convert the markdown
            gfm: true, // use github flavor markdown
            highlight: function( code ) { // highlight the code
                return highlight.highlightAuto( code ).value;
            }
        } ) )
        .pipe( $.wrap( {
            src: 'docs/template.html'
        } ) )
        .pipe( $.rename( 'index.html' ) )
        .pipe( gulp.dest( './' ) );

} );

gulp.task( 'reload', function() {
    if ( browserSync.active ) {
        browserSync.reload();
    }
} );

gulp.task( 'serve', function() {
    browserSync.init( null, {
        browser: [ 'google-chrome', 'google chrome' ], // linux uses the -
        server: {
            baseDir: [ '..' ]
        },
        startPath: '/dat.gui/'
    } );
} );

gulp.task( 'shim', function() {

    return gulp.src( paths.shim )
        .pipe( $.uglify() )
        .pipe( $.rename( 'dat-gui.shim.js' ) )
        .pipe( gulp.dest( 'build' ) );

} );

gulp.task( 'vulcanize', [ 'style' ], function() {

    return gulp.src( 'dat-gui.html' )
        // must use the latest version of gulp-vulcanize otherwise it grabs the file from disk
        .pipe( $.insert.prepend( '<script src="../platform/platform.js"></script>\n' ) )
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

var nib = require( 'nib' ),
    highlight = require( 'highlight.js' ),
    karma = require( 'karma' ),
    browserSync = require( 'browser-sync' ),
    $ = require( 'gulp-load-plugins' )();

var paths = {
    docs: [ 'README.md', 'docs/template.html' ],
    js: [ 'gulpfile.js', 'elements/**/*.js' ],
    html: [ 'dat-gui.html', 'elements/**/*.html' ],
    shim: [ 'elements/shim.js' ],
    styl: [ 'docs/*.styl', 'elements/**/*.styl' ],
    test: [ 'build/dat-gui.js', 'tests/*.js' ]
};

paths.build = []
    .concat( paths.html )
    .concat( paths.styl )
    .concat( paths.js )
    .concat( paths.shim );

var formattingOptions = {
    'preset': 'jquery',
    'plugins': [
        'esformatter-quotes',
        'esformatter-semicolons',
        'esformatter-braces'
    ],
    'quotes': {
        'type': 'single',
        'avoidEscape': false
    },
    'indent': {
        'value': '    '
    },
    'whiteSpace': {
        'before': {
            'ArgumentListObjectExpression': 1,
            'ArgumentListFunctionExpression': 1,
            'ArgumentListArrayExpression': 1
        },
        'after': {
            'ArgumentListObjectExpression': 1,
            'ArgumentListFunctionExpression': 1,
            'ArgumentListArrayExpression': 1
        }
    }
};

