module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON("package.json"),

    browserify: {
      test: {
        src: "test/dom-utils/*-test.js",
        dest: "test/dom-utils-test.js",
      }
    },

    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      src: {
        src: "src/**/*.js"
      },
    },

    mocha_phantomjs: {
      dist: {
        src: "test/dom-utils-test.html"
      }
    }
  })

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks("grunt-contrib-jshint")
  grunt.loadNpmTasks("grunt-browserify")
  grunt.loadNpmTasks("grunt-mocha-phantomjs")

  grunt.registerTask("test", [
    "jshint:src",
    "browserify",
    "mocha_phantomjs"
  ])

  grunt.registerTask("default", [
    "jshint:src",
    "test"
  ])

}