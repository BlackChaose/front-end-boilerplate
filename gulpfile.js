var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify-es').default;
//var uglify=require('gulp-uglify');
var gutil = require('gulp-util');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var concat = require('gulp-concat');
var onlyProductionJS = [
  // 'js/jquery-3.3.1.min.js',
  'prod/js/popper.min.js',
  'prod/js/bootstrap.min.js',
  'prod/js/jquery.fancybox.js',
  'prod/js/owl.carousel.js',
  'prod/js/jquery.inputmask.bundle.min.js',
  // 'js/lakomka.js',
];
var onlyProductionCSS = [
  'prod/css/bootstrap-custom.css',
  'prod/css/jquery.fancybox.css',
  'prod/css/owl.carousel.min.css',
  'prod/css/owl.theme.default.css',
  'prod/css/lakomka.css'
];
gulp.task('hello', function() {
  console.log('hello work');
});
gulp.task('sass', function() {
  return gulp.src('src/scss/lakomka.scss').pipe(sass()) //using gulp-sass
      .pipe(gulp.dest('src/css'));
});
gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['sass']);
});
gulp.task('useref', function() {
  return gulp.src('app/*.html').
      pipe(useref()).
      pipe(gulpIf('*.js', uglify())).
      pipe(gulpIf('*.css', cssnano({zindex: false}))).
      on('error', function(err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      }).
      pipe(gulp.dest('dist'));
});
gulp.task('imagemin', function() {
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)').pipe(cache(imagemin({
    interlaced: true,
  }))).pipe(gulp.dest('prod/images'));
});
gulp.task('fonts', function() {
  return gulp.src('fonts/**/*').pipe(gulp.dest('dist/fonts'));
});
gulp.task('clean:dest', function() {
  return del.sync('prod/*');
});
gulp.task('jsmin', function() {
  return gulp.src('src/js/*.js').
      pipe(gulpIf('*.js', uglify())).
      on('error', function(err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      }).
      pipe(gulp.dest('prod/js'));
});
gulp.task('cssmin', function() {
  return gulp.src('src/css/*.css').
      pipe(gulpIf('*.css', cssnano({zindex: false}))).
      on('error', function(err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      }).
      pipe(gulp.dest('prod/css'));
});
gulp.task('assemblyJS', function() {
  return gulp.src(onlyProductionJS).
      pipe(concat('lakomka.assm.js')).
      pipe(gulp.dest('prod_assembly/js'));
});
gulp.task('assemblyCSS', function() {
  return gulp.src(onlyProductionCSS).
      pipe(concat('lakomka.assm.css')).
      pipe(gulp.dest('prod_assembly/css'));
});
gulp.task('copyJS', function () {
  gulp.src('prod_assembly/js/*.js')
  .pipe(gulp.dest('../assets/js'));
});
gulp.task('copyCSS', function () {
  gulp.src('prod_assembly/css/*.css')
  .pipe(gulp.dest('../assets/css'));
});
gulp.task('copyIMG', function () {
  gulp.src('prod/images/*')
  .pipe(gulp.dest('../assets/images'));
});
gulp.task('clean:assets', function() {
  return del.sync('../assets/*');
});
gulp.task('clean:prods', function() {
  return del.sync('prod/*','prod_assembly');
});
gulp.task('copyJS_notAss',function(){
  gulp.src(['prod/js/others_scripts.js','prod/js/lakomka.js','prod/js/jquery-3.3.1.min.js'])
      .pipe(gulp.dest('../assets/js'));
});
gulp.task('build_min', ['cssmin','jsmin',/*'imagemin'*/]);
gulp.task('build_ass', ['assemblyJS','assemblyCSS']);
//gulp.task('build', gulp.series('build_min', 'build_ass','clean:assets','copyJS','copyCSS','copyIMG'));