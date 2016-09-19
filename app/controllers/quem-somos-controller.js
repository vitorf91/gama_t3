var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/quemsomos', router);
};

router.get('/', function (req, res, next) {
    res.render('quemsomos', {
      title: 'Quem Somos'
  });
});
