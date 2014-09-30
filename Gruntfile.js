// 'app/views/**/*.erb'

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch : {
            assets: {
                files: ['public/stylesheets/**/*.css', 'public/javascripts/**/*.js'],
                tasks: [],
                options: {
                    livereload: true
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['watch']);

};
