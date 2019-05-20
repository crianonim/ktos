var express = require('express');
var router = express.Router();
// const auth = require('../service');
const auth=require("../lib/ktos-client")();
// router.use(auth.middleware)
// const http = require('http')
/* GET home page. */

router.post('/login', async (req, res) => {
  let authResult = await auth.authenticate(req.body.username, req.body.password);
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
router.get('/', async function (req, res, next) {
  let user=await auth.getUser(req);
  console.log(user);
  res.render('index', { title: 'Express', user});
});


module.exports = router;
