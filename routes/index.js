var express = require('express');
var router = express.Router();
const auth = require('../service');
router.use(auth.middleware)
const http=require('http')
/* GET home page. */
router.get('/secret', (req, res, next) => {
 let r=http.request({
    hostname:'localhost',
    port:3000,
    path:"/",
    method:"GET",
    headers: auth.createHeader(2),
    
    
  },(rsp)=>{
    console.log(rsp.statusCode);
    rsp.pipe(res)
  })
  r.on('error',(e)=>{
    res.send(e)
  });
  r.end();
})

router.get('/', function (req, res, next) {
  if (res.locals.user) {
    res.render('index', { title: 'Express', user: res.locals.user });
  } else {
    res.send("BAD");
  }
});


module.exports = router;
