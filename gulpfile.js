import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import del from 'del';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import pimport from 'postcss-import';
import cssnano from 'cssnano';
import webpack from 'webpack-stream';
import bs from 'browser-sync';

import webpackConfig from './webpack.config.js';

// Environment

const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';

// Constants

const FAVICON_FILES = 'source/favicons/**';

const STATIC_FILES = [
  'source/fonts/**/*',
  'source/images/**/*',
];

// Clean

function clean() {
  return del('dist', { force: true });
}

// Templates

function templates() {
  return gulp.src('source/pages/**/*.pug', { base: 'source/pages' })
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
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

  return gulp.src('source/styles/styles.css', options)
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/assets/css', options))
    .pipe(bs.stream());
}

// Scripts

function scripts() {
  return webpack(webpackConfig(ENV))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(bs.stream());
}

// Copy

function copy() {
  return gulp.src(STATIC_FILES, { base: 'source' })
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets'))
    .pipe(bs.stream({ once: true }));
}

// Favicons

function favicons() {
  return gulp.src(FAVICON_FILES, { base: 'source/favicons' })
    .pipe(plumber())
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream({ once: true }));
}

// Watcher

function watcher() {
  gulp.watch('source/**/*.pug', gulp.series(templates));
  gulp.watch('source/styles/**/*.css', gulp.series(styles));
  gulp.watch('source/scripts/**/*.js', gulp.series(scripts));
  gulp.watch(STATIC_FILES, gulp.series(copy));
  gulp.watch(FAVICON_FILES, gulp.series(favicons));
}

// Server

function server() {
  bs.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist',
    },
  });
}

// Build

export const build = gulp.series(
  clean,
  gulp.parallel(
    templates,
    styles,
    scripts,
    copy,
    favicons,
  ),
);

// Start

export default gulp.series(
  build,
  gulp.parallel(
    watcher,
    server,
  ),
);
