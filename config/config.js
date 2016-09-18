var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'cabify-time3'
    },
    port: 9000,
    db: 'mongodb://localhost/cabify-time3-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'cabify-time3'
    },
    port: 3000,
    db: 'mongodb://localhost/cabify-time3-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'cabify-time3'
    },
    port: 3000,
    db: 'mongodb://localhost/cabify-time3-production'
  }
};

module.exports = config[env];
