'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    sass: {
      dist: {
        files: {
          'app/assets/sass/output.css': 'app/assets/sass/style.scss'
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js',
          '!app/assets/components/**/*'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      css: {
        files: [
          'app/assets/sass/*.scss'
        ],
        tasks: ['sass'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: [
          'app/views/*.handlebars',
          'app/views/**/*.handlebars'
        ],
        tasks: ['clean', 'copy'],
        options: { livereload: reloadPort }
      },
      deps: {
        files: [
          './bower.json'
        ],
        tasks: ['wiredep', 'string-replace:bower']
      }
    },
    // injeta dependencias do bower no html principal
    wiredep: {
      task: {
        src: ['app/views/layouts/main.handlebars'],
        //ignorePath: '../../../assets'
      }
    },
    // copia as views originais para a pasta de producao
    copy: {
      task: {
        files: [
          { 
            expand: true,
            cwd: 'app/views/',
            src: ['**/*'], 
            dest: 'www/views/'
          }
        ]
      }
    },
    // exclui as views da pasta de producao antes de copiar novamente
    clean: {
      task: {
        src: 'www/'
      }
    },
    // replace nas referencias prs spontsr os csminhod absolutos
    // de css e js antes de executar o useminPrepare
    'string-replace': {
      dist: {
        files: [{
          expand: true,
          cwd: 'www/views/layouts/',
          src: '**/*.handlebars',
          dest: 'www/views/layouts/'
        }],
        options: {
          replacements: [{
            pattern: /<script src=\"/g,
            replacement: '<script src=\"app/assets/'
          },
          {
            pattern: /<link rel="stylesheet" href=\"/g,
            replacement: '<link rel="stylesheet" href=\"app/assets/'
          }]
        }
      },
      bower: {
        files: [{
          expand: true,
          cwd: 'app/views/layouts/',
          src: '**/*.handlebars',
          dest: 'app/views/layouts/'
        }],
        options: {
          replacements: [{
            pattern: /<script src=\"..\/..\/assets\/components/g,
            replacement: '<script src=\"components'
          },
          {
            pattern: /<link rel="stylesheet" href=\"..\/..\/assets\/components/g,
            replacement: '<link rel="stylesheet" href=\"components'
          }]
        }
      }
    },
    // altera o html principal na producao para apontar para os arquivos
    // minificados e concatenados
    usemin : {
      html: 'www/views/layouts/main.handlebars'
    },
    // identifica os arquivos que devem ser minificados e concatenados
    useminPrepare: {
      options: {
        root: 'www/views',
        dest: 'www/views'
      },
      html: 'www/views/layouts/main.handlebars'
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('deploy', [
    'clean',
    'copy',
    'string-replace',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'sass',
    'develop',
    'watch'
  ]);
};
