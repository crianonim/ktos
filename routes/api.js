var express = require('express');
var router = express.Router();
const auth = require('../service');
const http = require('http')

router.get('/',(req,res)=>{
    res.json("ktos API")
});
router.get('/authenticate',(req,res)=>{
    console.log(req.query)
    res.json(auth.authenticate(req.query.username,req.query.password))
})
router.get('/:token/',(req,res)=>{
    res.json( auth.getUser(req.params.token))
})

module.exports = router;