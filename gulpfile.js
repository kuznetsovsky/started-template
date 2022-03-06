import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';

function templates() {
  return gulp.src('source/views/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('dist'));
}

function watcher() {
  gulp.watch('source/views/**/*.pug', gulp.series(templates));
}

export const build = gulp.series(
  templates,
);

export default gulp.series(
  build,
  gulp.parallel(
    watcher,
  ),
);
