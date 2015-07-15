var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var del = require('del');
var mainBowerFiles = require('main-bower-files');

gulp.task('styles', function() {
    return gulp.src('web/sass/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer('last 3 versions', 'Explorer 8', 'iOS 6', 'Android 4'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('web/css'));
        //.pipe(notify({ message : 'styles task finished' }));
});

gulp.task('bower-styles', function() {
    return gulp.src(mainBowerFiles('**/*.css'))
        .pipe(concat('vendor.css'))
        .pipe(autoprefixer('last 3 versions', 'Explorer 8', 'iOS 6', 'Android 4'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('web/css'));
});

gulp.task('bower-scripts', function() {
    return gulp.src(mainBowerFiles(['**/jquery.js', '**/*.js', '!**/modernizr.js', '!**/GGS.js']))
        .pipe(concat('vendor.min.js', {
            newLine: ';'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('web/js'));
});

gulp.task('bower-head-scripts', function() {
    return gulp.src(mainBowerFiles('**/modernizr.js'))
        .pipe(uglify())
        .pipe(gulp.dest('web/js/vendor'));
});

gulp.task('bower-dev-scripts', function() {
    return gulp.src(mainBowerFiles('**/GGS.js'))
        .pipe(uglify())
        .pipe(gulp.dest('web/js/vendor/dev'));
});

gulp.task('scripts', function() {
    return gulp.src(['web/js/**/*.js', '!web/js/main.min.js', '!web/js/vendor.min.js', '!web/js/vendor/**'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.min.js', {
            newLine: ';'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('web/js'));
});

gulp.task('images', function() {
    return gulp.src('web/img/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('web/img'));
});

gulp.task('default', function() {
    gulp.start('styles', 'bower-styles', 'bower-scripts', 'bower-head-scripts', 'bower-dev-scripts', 'scripts', 'images');
});

gulp.task('watch', function() {
    gulp.watch('web/sass/**/*.scss', ['styles']);
    gulp.watch('web/js/**/*.js', ['scripts']);
    //gulp.watch('web/img/**/*', ['images']);
});