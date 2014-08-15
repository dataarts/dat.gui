/* jshint node: true */
"use strict";

var gulp = require("gulp"),
    stylus = require("gulp-stylus"),
    nib = require("nib"),
    watch = require("gulp-watch"),
    argv = require("yargs").argv

function compileCss() {
    var deferred = Q.defer();

    gulp.src("elements/*.styl")
        .pipe(stylus({use: [nib()]}))
        .pipe(gulp.dest("elements"))
        .on("end", function() {
            deferred.resolve();
        });

    return deferred.promise;
}

gulp.task("stylus", function () {
    if (argv.watch) {
        watch({glob: "elements/*.styl"}, function(files) {
            return files
                .pipe(stylus({use: [nib()]}))
                .pipe(gulp.dest("elements"));
        });
    } else {
        return compileCss();
    }
});
