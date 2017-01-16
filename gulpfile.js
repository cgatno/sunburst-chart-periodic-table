// Require dependencies in alphabetical order
const babel = require('gulp-babel');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cleanCSS = require('gulp-clean-css');
const glob = require('glob');
const gulp = require('gulp');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// Right now, the default task just runs the build task
gulp.task('default', ['build'], () => {
});

// For the build task, run the 'javascript' and 'css' tasks which
// handle their respective build logics on their own
gulp.task('build', ['javascript', 'css'], () => {
});

// Task for bundling, transpiling and minifying JavaScript
gulp.task('javascript', () => {
  // Define files for bundling via browserify
  const jsFiles = glob.sync('src/**/*.js');

  // Run browserify as its own function with debugging
  // gulp-browserify is no longer supported and has quite a few issues in
  // newer versions of Gulp
  const b = browserify(
    {
      entries: jsFiles,
      debug: true,
    });

  return b.bundle()
    // Bundle using the browserify function then pass the resulting app.js file as a source
    // for further processing
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true })) // set up sourcemaps during transforms
      // Transpile using Babel
      .pipe(babel({
        presets: ['es2015'],
      }))
      // Minify using UglifyJS
      .pipe(uglify())
      // Log any errors while transforming JS
      .on('error', gutil.log)
    // Write sourcemap files and the final JS file for production
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js/'));
});

// Task for minifying CSS source files
gulp.task('css', () =>
   gulp.src('styles/*.css')
    .pipe(cleanCSS({ debug: true }))
    .pipe(gulp.dest('dist/css/'))
);
