const { src, dest, parallel, series, watch } = require('gulp');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const sass         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCss     = require('gulp-clean-css');
const pug          = require('gulp-pug');
const imagecomp    = require('compress-images');
const del          = require('del');

function browsersync () {
    browserSync.init({
        server: { baseDir : 'app/' },
        notify: false,
        online: true
    })
}

function scripts () {
    return src([
        'app/src/plugins/**/*.js',
        'app/src/js/app.js',
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(dest('app/assets/js/'))
    .pipe(browserSync.stream())
}

function styles () {
    return src([
        'app/src/plugins/**/*.css',
        'app/src/sass/main.scss',
    ])
    .pipe(sass())
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleanCss(( { level: { 1: { specialComment: 0 } }/*, format: 'beautify' */} )))
    .pipe(dest('app/assets/css/'))
    .pipe(browserSync.stream())
}

function html () {
    return src('app/src/pug/*.pug')
        .pipe(
            pug({
                pretty: '\t'
            })
        )
        .pipe(dest('app/'));
}

function startWhatch() {
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts)
    watch(['app/**/*.scss'], styles)
    watch('app/**/*.html').on('change', browserSync.reload)
    watch('app/**/*.pug', html);
}

async function images() {
    imagecomp(
        "app/src/images/**/*", // Берём все изображения из папки источника
        "app/assets/images/", // Выгружаем оптимизированные изображения в папку назначения
        { compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
        { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
        { png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (err, completed) { // Обновляем страницу по завершению
            if (completed === true) {
                browserSync.reload()
            }
        }
    )
}

function cleanimg() {
    return del('app/assets/images/**/*', { force: true }) // Удаляем все содержимое папки "app/images/dest/"
}

function buildcopy() {
    return src([ // Выбираем нужные файлы
        'app/assets/css/**/*.min.css',
        'app/assets/js/**/*.min.js',
        'app/assets/images/**/*',
        'app/**/*.html',
    ], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
        .pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.html = html;
exports.images = images;
exports.cleanimg = cleanimg;
exports.default = parallel(html, styles, scripts, browsersync, startWhatch)
exports.build = series(styles, scripts, buildcopy);