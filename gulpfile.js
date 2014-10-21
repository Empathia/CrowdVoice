var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('default', function() {
    livereload.listen();
    gulp.watch('public/stylesheets/**/*.css', livereload.changed);
    gulp.watch('public/javascripts/**/*.js', livereload.changed);
    gulp.watch('app/views/**/*.erb').on('change', livereload.changed);
});

