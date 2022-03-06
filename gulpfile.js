import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import del from 'del';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import pimport from 'postcss-import';
import cssnano from 'cssnano';
import webpack from 'webpack-stream';

import webpackConfig from './webpack.config.js';

// Environment

const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';

// Clean

function clean() {
  return del('dist', { force: true });
}

// Templates

function templates() {
  return gulp.src('source/views/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('dist'));
}

// Styles

function styles() {
  const options = { sourcemaps: IS_DEV };
  const plugins = [
    autoprefixer,
    pimport,
  ];

  if (IS_PROD) {
    plugins.push(
      cssnano({
        preset: 'default'
      }),
    );
  }

  return gulp.src('source/stylesheets/styles.css', options)
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css', options));
}

// Scripts

function scripts() {
  return webpack(webpackConfig(ENV))
    .pipe(gulp.dest('dist/js'));
}

// Copy

function copy() {
  return gulp
    .src('source/assets/**/*', {
      base: 'source/assets',
    })
    .pipe(plumber())
    .pipe(gulp.dest('dist'));
}

// Watcher

function watcher() {
  gulp.watch('source/views/**/*.pug', gulp.series(templates));
  gulp.watch('source/stylesheets/**/*.css', gulp.series(styles));
  gulp.watch('source/javascripts/**/*.js', gulp.series(scripts));
  gulp.watch('source/assets/**/*', gulp.series(copy));
}

// Build

export const build = gulp.series(
  clean,
  gulp.parallel(
    templates,
    styles,
    scripts,
    copy,
  ),
);

// Start

export default gulp.series(
  build,
  gulp.parallel(
    watcher,
  ),
);
