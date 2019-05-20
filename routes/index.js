var express = require('express');
var router = express.Router();
const auth = require('../service');
router.use(auth.middleware)
const http = require('http')
/* GET home page. */
router.get('/secret', (req, res, next) => {
  let r = http.request({
    hostname: 'localhost',
    port: 3000,
    path: "/",
    method: "GET",
    headers: auth.createHeader(2),


  }, (rsp) => {
    console.log(rsp.statusCode);
    rsp.pipe(res)
  })
  r.on('error', (e) => {
    res.send(e)
  });
  r.end();
})
router.post('/login', (req, res) => {
  let authResult = auth.authenticate(req.body.username, req.body.password);
  console.log(authResult);
  if (authResult) {
    res.cookie('token', authResult);
    res.redirect('/')
  }
  res.render('login')
})
router.get('/login', (req, res) => {
  res.render('login', {})
})
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
})
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: res.locals.user });
});


module.exports = router;
