let gulp = require('gulp')
let gulpData = require("gulp-data")
let changed = require('gulp-changed')
let using = require('gulp-using')
let hb = require('gulp-hb')
let ext = require('gulp-ext-replace')
let minifyHtml = require('gulp-htmlmin')
let path = require('path')
let config = require('../config').html

gulp.task('html', ['envSetup'], function () {

    return new Promise((resolve, reject) => {
        let stream = gulp.src([config.src + '/**/*.hbs', "!" + config.partialsSrc + '/**/*.hbs'])
            .pipe(gulpData(function (file) {
                try {
                    return require(file.path.replace('.hbs', '.json'));
                } catch (e) {
                    console.log("No JSON for " + file.path)
                    return ({})
                }
            }))
            .pipe(gulpData(function (file) {
                return require('../../' + config.dataSrc + '/courses.json');
            }))
            .pipe(gulpData(function (file) {
                return require('../../' + config.dataSrc + '/bootcamps.json');
            }))
            .pipe(gulpData(function (file) {
                return require('../../' + config.dataSrc + '/reviews.json');
            }))
            .pipe(hb({
                    partials: config.partialsSrc + '/**/*.hbs',
                    data: [config.src + '/**/*.json', config.dataSrc + '/**/*.json']
                })
                    .helpers({
                        ifEquals: function (obj1, obj2, options) {
                            if (obj1 === obj2)
                                return options.fn(this);
                        }
                    })
            )
            .pipe(using())
            .pipe(ext('.html'))
            .pipe(minifyHtml({collapseWhitespace: true}))
            .pipe(gulp.dest(config.dest))

        stream.on('finish', resolve)
        stream.on('error', reject)
    })
})

