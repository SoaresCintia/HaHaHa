var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    express = require('express'),
    http = require('http'),
    fs = require('fs'),
    less = require('gulp-less'),
    livereload = require('connect-livereload'),
    refresh = require('gulp-livereload'),
    request = require('request');

var livereloadport = 35729,
    serverport = 5443,
    lrserver = require('tiny-lr')();

gulp.task('styles', function() {
  return gulp.src('styles/main.less')
        .pipe(plumber()) 
        .pipe(less())
        .pipe(gulp.dest('tmp/styles'))
        .pipe(refresh(lrserver));
});

gulp.task('html', function(){
    gulp.src('web/**/*.html')
        .pipe(refresh(lrserver));
});

gulp.task('js', function(){
    gulp.src('web/**/*.js')
        .pipe(refresh(lrserver));
});

gulp.task('default', function() {
    gulp.start('styles', 'serve', 'watch');
});

gulp.task('serve', function(){
  var server = express();
  server.use(livereload({port: livereloadport}));
  ['web', 'bower_components', 'tmp'].forEach(function(a){
      server.use(express.static(a));
  });

  http.createServer(server).listen(serverport);
  lrserver.listen(livereloadport);
});

gulp.task('watch', function() {
    gulp.watch('web/**/*.less', ['styles']);
    gulp.watch('web/**/*.html', ['html']);
    gulp.watch('web/**/*.js', ['js']);
});