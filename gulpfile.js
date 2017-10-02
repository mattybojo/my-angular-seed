// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint')
  , templateCache = require('gulp-angular-templatecache')
  , sass = require('gulp-sass')
  , uglify = require('gulp-uglify')
  , clean = require('gulp-clean')
  , connect = require('gulp-connect')
  , jscs = require('gulp-jscs')
  , prettify = require('gulp-jsbeautifier')
  , usemin = require('gulp-usemin')
  , minifyHtml = require('gulp-htmlmin')
  , minifyCss = require('gulp-clean-css')
  , ngAnnotate = require('gulp-ng-annotate')
  , rev = require('gulp-rev')
  , imagemin = require('gulp-imagemin')
  , pngcrush = require('imagemin-pngcrush');


gulp.task('js-beautify', function() {
  'use strict';
  gulp.src('./assets/js/*.js')
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./assets/js'));
});

gulp.task('lint', function() {
  'use strict';
  return gulp.src('./assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('jscs', function() {
  'use strict';
  return gulp.src('./assets/js/*.js')
    .pipe(jscs());
});

gulp.task('sass', ['lint'], function() {
  'use strict';
  return gulp.src('./assets/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('assets/css'));
});

gulp.task('clean', ['sass'], function() {
  'use strict';
  return gulp.src(['dist/*'], {read: false})
    .pipe(clean());
});

gulp.task('copy', ['clean'], function() {
  'use strict';
  var filesToCopy = [
    './fonts/**/*.*',
    './js/iebs/**/*.*.'
  ];
  return gulp.src(filesToCopy, { base: './' })
    .pipe(gulp.dest('dist'));
});

gulp.task('image', ['copy'], function() {
  'use strict';
  return gulp.src('./images/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [
        {removeViewBox: false}
      ],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest('dist/images'));
});


gulp.task('predist1', ['image'], function() {
  'use strict';
  return gulp.src(['./views/*.html'])
    .pipe(templateCache('templates.js', {
      root: './views/',
      module: 'app'
    }))
    .pipe(gulp.dest('js/'));
});

gulp.task('predist2', ['predist1'], function() {
  'use strict';
  return gulp.src('./index.html')
    .pipe(usemin({
      css: [minifyCss(), 'concat'],
      html: [minifyHtml({empty: true})],
      js: [ngAnnotate(), uglify(), rev()]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('dist', ['predist2'], function() {
  'use strict';
  var fs = require('fs');
  fs.writeFile('assets/js/templates.js', '/* MOCK FILE - Used by gulp build process to store compiled AngularJS view templates */\n(function() {\n  "use strict";\n})();');
});

gulp.task('reload', function() {
  'use strict';
  return gulp.src('*')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  'use strict';
  gulp.watch('./assets/scss/*.scss', ['sass', 'reload']);
  gulp.watch('./index.html', ['reload']);
  gulp.watch('./app/components/*/*.html', ['reload']);
  gulp.watch('./app/components/*/*.js', ['reload']);
  gulp.watch('./app/app.module.js', ['reload']);
  gulp.watch('./app/app.route.js', ['reload']);
});

gulp.task('connect', function() {
  'use strict';
  return connect.server({
    port: 8080, // optional
    livereload: true
  });
});

gulp.task('default', ['watch', 'connect']);
