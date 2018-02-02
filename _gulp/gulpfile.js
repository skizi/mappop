var gulp      = require('gulp');
var uglify    = require('gulp-uglify');
var stripDebug    = require('gulp-strip-debug'); // console alert
var concat    = require('gulp-concat');
var compass   =  require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var plumber   = require('gulp-plumber');
var source = require('vinyl-source-stream');// bundle の返したファイルストリームを vinyl に変換
var babelify = require('babelify');
var browserify = require('browserify');



//babel、es2015、reactの連携
//http://sota1235.hatenablog.com/entry/2015/11/07/132832
//http://mgi.hatenablog.com/entry/2015/11/01/135222

//それぞれのJSファイルを結合
gulp.task('concat_libs', function() {

  gulp.src([
    './_js/libs/jquery.js'
    ])
    .pipe(plumber())
    .pipe(concat("libs.js"))
    //.pipe(uglify())
    .pipe(gulp.dest('../books/app/assets/javascripts'));

});


gulp.task('concat', function() {

    browserify({
            entries: "./_js/Main.js",
            extensions: [".js"]
        })
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .on("error", function (err) {
            console.log("Error : " + err.message);
            this.emit("end");
        })
        .pipe(source("main.js"))
        .pipe(gulp.dest('../books/app/assets/javascripts/questions'));

});

//Sassファイル(Compass)をコンパイル
gulp.task('compass', function() {
    gulp.src([
        '_scss/**/*.scss'  //ディレクトリを保持したまま書き出し
    ])
    .pipe(plumber())
    .pipe(compass({
        config_file: '_scss/config.rb',
        css : '../htdocs/assets/css',
        sass: '_scss',
        comments: false
    }))
    //.pipe(minifyCSS())
    .pipe(gulp.dest('../books/app/assets/stylesheets'));
});



// デフォルトタスク
gulp.task('default', function() {

    //JSファイルの変更を監視
    gulp.watch('_js/**/*.js', function(event) {
        gulp.run('concat_libs');
    });

    gulp.watch('_js/**/*.js', function(event) {
        gulp.run('concat');
    });

    //Sassファイルの変更を監視
    gulp.watch('_scss/**', function(event) {
        gulp.run('compass');
    });

});