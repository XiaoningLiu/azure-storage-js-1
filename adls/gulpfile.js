const gulp = require("gulp");
const zip = require("gulp-zip");

const version = require("./package.json").version;
const zipFileName = `azurestoragejs.adls-${version}.zip`;

gulp.task("zip", () => {
  gulp
    .src([
      "browser/azure-storage.adls.js",
      "browser/azure-storage.adls.min.js",
      "browser/*.txt"
    ])
    .pipe(zip(zipFileName))
    .pipe(gulp.dest("browser"));
});
