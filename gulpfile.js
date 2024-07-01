// gulpfile.js

var path = require('path')
var gulp = require('gulp')
var cleanCSS = require('gulp-clean-css')
var cssWrap = require('gulp-css-wrap')

var customThemeName = '.jdwl-admin-red'

// 生成带命名空间红色主题
gulp.task('red-css-wrap', function() {
  return gulp.src(path.resolve('node_modules/@lui/lui-ui/lib/theme-chalk-red/index.css'))
    .pipe(cssWrap({ selector: customThemeName }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('src/assets/styles/theme-red'))
})

// 生成红色主题对应字体
gulp.task('move-font', function() {
  return gulp.src(['node_modules/@lui/lui-ui/lib/theme-chalk-red/fonts/**']).pipe(gulp.dest('src/assets/styles/theme-red/fonts'))
})

gulp.task('default', gulp.series(['red-css-wrap', 'move-font']))
