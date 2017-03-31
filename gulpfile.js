'use strict';

var del           = require('del');
var gulp          = require('gulp');
var livereload    = require('gulp-livereload');
var sourcemaps    = require('gulp-sourcemaps');
var sass          = require('gulp-sass');
var postcss       = require('gulp-postcss');
var autoprefixer  = require('autoprefixer');
var csswring      = require('csswring');
var watch         = require('gulp-watch');
var notification  = require('node-notifier');
var util          = require('gulp-util');

function handleErr(err)
{
    notification.notify({ title: 'Gulp Error', sound: true, message: err.message });
    util.log(util.colors.red('Gulp Error:'), err.message);
    this.emit('end');
}

gulp.task('default', [ 'clean', 'watch' ]);

gulp.task('clean', [ 'clean-css' ]);

gulp.task('build', [ 'build-css' ]);

gulp.task('build-dev', [ 'build-dev-css' ]);

gulp.task('watch', [ 'build-dev' ], function ()
{
    livereload.listen();
    gulp.watch('./frontend/sass/*.scss', [ 'build-dev-css' ]);
    gulp.watch('./craft/templates/**.*', function () {
        livereload.reload();
    });
});

gulp.task('clean-css', function ()
{
    return del([ './web/css/*' ]);
});

gulp.task('build-css', function ()
{
    return gulp.src('./frontend/sass/screen.scss')
        .pipe(sass())
        .pipe(postcss([ autoprefixer, csswring ]))
        .pipe(gulp.dest('./web/css'));
});

gulp.task('build-dev-css', [ 'clean-css' ], function ()
{
    return gulp.src('./frontend/sass/screen.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .on('error', handleErr)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./web/css'))
        .pipe(livereload());
});
