module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
        // sourceMap: true,
        // sourceMapName: 'public/dist/shortymcshortly.js.map',
        // sourceMapStyle: 'link'
      },
      client: {
        src: 'public/client/*.js',
        dest: 'public/dist/shortymcshortly.js'
      },
      dependencies: {
        src: [
          'public/lib/jquery.js',
          'public/lib/underscore.js',
          'public/lib/backbone.js',
          'public/lib/handlebars.js'
        ],
        dest: 'public/dist/dependencies.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        // sourceMap: true,
        // sourceMapIncludeSources: true,
        // sourceMapIn: 'public/dist/shortymcshortly.js.map'
      },
      client: {
        src: '<%= concat.client.dest %>',
        //.tmp is a best practice for intermediary files/garbage.
        dest: 'public/dist/shortymcshortly.min.js'
      },
      dependencies: {
        src: '<%= concat.dependencies.dest %>',
        //.tmp is a best practice for intermediary files/garbage.
        dest: 'public/dist/dependencies.min.js'
      },
      
    },

    jshint: {
      files: [
        // Add filespec list here
        '*.js',
        'app/*.js',
        'app/**/*.js',
        'lib/*.js',
        'public/*.js',
        'public/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          // 'test/*.js'
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
        // Add filespec list here
      target: {
        files: [{
          src: 'public/style.css',
          dest: 'public/dist/style.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'cssmin',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      // add your production server task here
  ]);

  grunt.registerTask('default', [
    'jshint',
    'mochaTest',
    'cssmin',
    'concat',
    'uglify'
  ]);


};
