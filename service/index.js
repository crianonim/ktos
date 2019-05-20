const jwt=require('jsonwebtoken');


const SECRET="enigma1"
const DB=[
    {id:1,username:"criamon",name:"Jan",password:"1x",loggedIn:false},
    {id:2,username:"lucas",name:"Lucas",password:"BR",loggedIn:false}
]

module.exports={
    getUser,
    authenticate,
    createHeader,
    middleware,
}
function middleware(req,res,next){
    res.locals.user=getUser(req);
    next();
}
// use request or token string
function getUser(req){
    //console.log(req.headers)
    let token
    if (typeof req=="string"){
        token=req;
        console.log("Token from string")
    } else {
        if (req.headers.authorization){
            token=req.headers.authorization.split(" ")[1] // TODO
            console.log("Token from Header")
        }
        else if (req.cookies.token){
            token=req.cookies.token;
        }
        else {
            token=req.query.token;
            console.log("Token from url")
        }
    }
    console.log("TOKEN",token)
    try{
        let payload=jwt.verify(token,SECRET);
        return DB.find(user=>user.id==payload.id)
    } catch (err){
        return false;
    } 
   
}
function authenticate(username,password){
    let user=DB.find(user=>user.username==username && user.password==password);
    if (user){
        return jwt.sign({id:user.id},SECRET)
    }
    return false;
}
function createHeader(id){
   return {'Authorization':'Bearer '+jwt.sign({id},SECRET)}
}