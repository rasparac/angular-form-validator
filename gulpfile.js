var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var src = './src/angular-form-validator.js';

gulp.task('default');


gulp.task('js-build', function() {
    return gulp.src(src)
        .pipe(uglify())
        .pipe(concat('angular-form-validator.min.js'))
        .pipe(gulp.dest('./dist/'));
});