var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass');
    concat = require('gulp-concat');


// Files
var dist = 'app/dist/',
rootJsFiles = 'app/js/*.js',
appJsFiles = 'app/js/**/*.js';

gulp.task('sass', function() {
    return gulp.src(['app/scss/**/*.scss', 'app/scss/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(dist));
});

gulp.task('js', function() {
    return gulp.src(['!app/js/external/**/*', rootJsFiles, appJsFiles, 'app/js/**/**/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest(dist));
});

gulp.task('watch', function(){
    gulp.watch(['app/js/**/*', 'app/js/*', 'app/js/**/**/*.js'], ['js']);
    gulp.watch(['app/scss/**/*', '!app/scss/bootstrap/*'], ['sass']);
});

gulp.task('default', ['js', 'sass'], function(){
    console.log('Building and watching.')
});
