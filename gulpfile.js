/* gulpfile.js */

// Load some modules which are installed through NPM.
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var browserify = require("browserify");  // Bundles JS.
var babelify = require("babelify");
var del = require("del");  // Deletes files.
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var webserver = require("gulp-webserver");
var uglify = require("gulp-uglify");

var server = {
  host: "127.0.0.1",
  port: "9900"
};

// Define some paths.
var paths = {
  scss: ["./app/scss/**/*.scss"],
  appJs: ["./app/js/index.js"],
  js: ["./app/js/**/*.js"],
  jsx: ["./app/js/**/*.jsx"]
};

gulp.task("clean", function(done) {
  del(["tmp"], done);
});

// Our CSS task. It finds all our Stylus files and compiles them.
gulp.task("scss", function() {
  return gulp.src(paths.scss)
  .pipe(plumber())
  .pipe(sass())
  .pipe(gulp.dest("./static/css"));
});

// Our JS task. It will Browserify our code and compile React JSX files.
gulp.task("js", function() {
  // Browserify/bundle the JS.
  return browserify(paths.appJs, {debug: true})
    .transform(babelify.configure({
      stage: 0
    }))
    .bundle()
    .pipe(source("index.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    //.pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./static/"));
});

gulp.task("build", ["js", "scss"]);

gulp.task("webserver", ["build"], function() {
  gulp.src( "static/" )
    .pipe(webserver({
      host: server.host,
      port: server.port,
      livereload: true,
      directoryListing: false,
      fallback: "index.html"
    }));
});

// Rerun tasks whenever a file changes.
gulp.task("watch", ["build"], function() {
  gulp.watch(paths.jsx, ["js"]);
  gulp.watch(paths.js, ["js"]);
  gulp.watch(paths.scss, ["scss"]);
});

// The default task (called when we run `gulp` from cli)
//gulp.task("default", ["watch", "js"]);
gulp.task("default", ["watch", "webserver"]);
