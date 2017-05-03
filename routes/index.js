var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Express' });
});

router.get('/partials/:name', function (req, res) {
  return res.render('partials/' + req.params.name);
});

module.exports = router;
