var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    nib = require('nib'),
    fs = require('fs'),
    marked = require('marked'),
    karma = require('karma'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

gulp.task('default', ['docs', 'build']);

gulp.task('watch', ['default'], function() {

  karma.server.start({
    frameworks: ['jasmine'],
    files: [
      'build/gui.js',
      'tests/*.js'
    ]
  });

  gulp.watch(['elements/**/*.styl', 'elements/**/*.html',
  'elements/**/*.js', 'gui.html'], ['build']);

  gulp.watch(['README.md', 'docs/*'], ['docs']);

});

gulp.task('build', ['vulcanize'], function() {

  return gulp.src('build/gui.html')
         .pipe($.replace(/\\/g, '\\\\'))
         .pipe($.replace(/'/g, '\\\''))
         .pipe($.replace(/^(.*)$/gm, '\'$1\','))
         .pipe($.insert.wrap('document.write([', '].join("\\n"))'))
         .pipe(rename('gui.js'))
         .pipe(gulp.dest('build'));

});

gulp.task('vulcanize', ['css'], function() {

  return gulp.src('gui.html')
         .pipe($.vulcanize({
           dest: 'build',
           inline: true,
           strip: true
         }));

});

gulp.task('jscs', function() {
  return gulp.src('elements/**/*.js')
    .pipe($.jscs());
});

gulp.task('lint', function() {
  return gulp.src('elements/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('css', function() {

  return css('elements/**/*.styl', 'elements');

});

gulp.task('docs', function() {

  css('docs/*.styl', 'docs');

  var content = {
    readme: marked(fs.readFileSync('README.md', 'utf8'))
  };

  return gulp.src('docs/template.html')
    .pipe($.plates(content))
    .pipe($.rename('index.html'))
    .pipe(gulp.dest('./'));

});

gulp.task('clean', function() {

  return gulp.src(['build/*', '**/*.css'])
         .pipe($.clean());

});

function css(src, dest) {

  return gulp.src(src)
         .pipe($.stylus({ use: [nib()] }))
         .pipe(gulp.dest(dest));

}
