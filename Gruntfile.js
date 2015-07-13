module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      client: {
        options: {
          port: 9000,
          base: './www',
          livereload: true,
          open: {
            target: 'http://localhost:9000',
            appName: 'Google Chrome',
          }
        }
      }
    },

    wiredep: {
      task: {
        src: ['www/index.html']
      }
    },

    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: ['www/**/*.js',
              '!www/lib/**/*',
              '!www/*.min.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 
              '!www/lib/**/*',
              'www/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    watch: {
      html: {
        files: ['www/**/*.html', '!www/lib/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['www/**/*.js', '!www/lib/**'],
        options: {
          livereload: true
        }
      },
      bower: {
        files: ['bower.json'],
        tasks:['wiredep']
      }
    }

  });
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-search');
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('default', ['wiredep','connect','watch']);

};