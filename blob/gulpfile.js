const gulp = require("gulp");
const zip = require("gulp-zip");

const version = require("./package.json").version;
const zipFileName = `azurestoragejs.blob-${version}.zip`;

gulp.task("zip", function(done) {
  gulp
    .src([
      "browser/azure-storage.blob.js",
      "browser/azure-storage.blob.min.js",
      "browser/*.txt"
    ])
    .pipe(zip(zipFileName))
    .pipe(gulp.dest("browser"))
    .on("end", done)
    .on("error", done);
});
