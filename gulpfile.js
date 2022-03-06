import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import del from 'del';

function clean() {
  return del('dist', { force: true });
}

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
  clean,
  gulp.parallel(
    templates,
  ),
);

export default gulp.series(
  build,
  gulp.parallel(
    watcher,
  ),
);
