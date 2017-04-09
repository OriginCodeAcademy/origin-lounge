var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'), // allows gulp to run nodemon at time of serving
    jshint = require('gulp-jshint'), 
    livereload = require('gulp-livereload'),// auto-reload browser when files are changed 
    wiredep = require('wiredep').stream,
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),      // run a local dev server
    inject = require('gulp-inject'),    // inject app dependency includes on index.html
    open = require('gulp-open');      // open a URL in the browser

var jsSources = ['app/*.js', 'app/**/*.js'],
    cssSources = ['app/**/*.css'],
    htmlSources = ['**/*.html','app/**/*.html'];

// Watch
gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(cssSources, ['css']);
    gulp.watch(htmlSources, ['html']);
});

var paths = ['./bower_components/','./app/*.js','./app/**/*.js','./app/**/*.css'];


// gulp.task('develop', function () {
//   var stream = nodemon({ script: 'server.js'
//           , ext: 'html js'
//           , ignore: ['ignored.js']
//           })

//   stream
//       .on('restart', function () {
//         console.log('restarted!')
//       })
//       .on('crash', function() {
//         console.error('Application has crashed!\n')
//          stream.emit('restart', 10)  // restart the server in 10 seconds
//       })
// })

gulp.task('injectables', function() {
    var sources = gulp.src(paths, {read: false});
    return gulp.src('index.html')
        .pipe(wiredep())
        .pipe(inject(sources))
        .pipe(gulp.dest('.'));
});

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});

gulp.task('css', function() {
    gulp.src(cssSources)
        .pipe(connect.reload())
});

gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: true
    })
});

gulp.task('app', function(){
    var options = {
        uri: 'http://localhost:8080',
        app: 'chrome'
    };
    gulp.src('./index.html')
        .pipe(open(options));
});


//gulp.task('serve', ['connect', 'watch', 'injectables', 'app', 'develop']);
gulp.task('serve', ['connect', 'watch', 'injectables', 'app']);