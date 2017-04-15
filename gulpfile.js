/*
  npm install -g gulp
  npm init
  npm install --save-dev plugin-name
*/

// gulp
var gulp = require('gulp');

// plugins
var clean = require('gulp-clean');
var minifyCss = require("gulp-minify-css");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var copy = require('gulp-copy');
var connect = require('gulp-connect');
var open = require('gulp-open');

// bases folder
var bases = {
  app: 'app/',
  dist: 'dist/',
};

// paths
var paths = {
  html: ['*.html'],
  favicon: ['favicon.ico'],
  css: ['css/*.css'],
  cssIeToCopy: ['css/ie/*'],
  cssImagesToCopy: ['css/images/*'],
  images: ['images/**/*'],
  libs: ['js/**/*.js'],
  externalLibs: ['lib/**/*'],
  fonts: ['fonts/**/*']
};

// Delete the dist directory
gulp.task('clean', function() {
 return gulp.src(bases.dist)
 .pipe(clean());
});

// Minify CSS
gulp.task('minify-css', function () {
  gulp.src(paths.css, {cwd: bases.app})
  .pipe(minifyCss())
  .pipe(gulp.dest(bases.dist + 'css/'));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
  gulp.src(paths.images, {cwd: bases.app})
  .pipe(imagemin())
  .pipe(gulp.dest(bases.dist + 'images/'));
});

// copy files to dist directly
gulp.task('copy', ['clean'], function() {
 // Copy HTML
 gulp.src(paths.html, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));

 // Copy favicon
 gulp.src(paths.favicon, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));

 // Copy CSS stuff
 gulp.src(paths.cssIeToCopy, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist + 'css/ie/'));
 gulp.src(paths.cssImagesToCopy, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist + 'css/images/'));

// Copy libs
gulp.src(paths.libs, {cwd: bases.app})
.pipe(gulp.dest(bases.dist + 'js/'));

// Copy external libs

gulp.src(paths.externalLibs, {cwd: bases.app})
.pipe(gulp.dest(bases.dist + 'lib/'));

// Copy font
gulp.src(paths.fonts, {cwd: bases.app})
.pipe(gulp.dest(bases.dist + 'fonts/'));


 // Copy styles
 // gulp.src(paths.css, {cwd: bases.app})
 // .pipe(gulp.dest(bases.dist + 'css'));

});

// server connect
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port: 30000,
    livereload: true
  });
});

// livereload config
gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});
gulp.task('css-watch', function () {
  gulp.src('./app/**/*.css')
    .pipe(connect.reload());
});
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/**/*.css'], ['css-watch']);
});

// open browser
gulp.task('open-browser', function(){
  gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:30000/', app: 'chrome'}));
});

// start server with livereload, and open website in browser
gulp.task('start', ['connect', 'watch', 'open-browser']);

// Default Task : build dist
gulp.task('default', ['clean', 'imagemin', 'minify-css', 'copy']);
