var express = require('express');
var router = express.Router();
const auth = require('../service');

/* GET users listing. */
router.get('/login', function(req, res, next) {

  res.json(auth.authenticate(req.query.username,req.query.password))
});


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
