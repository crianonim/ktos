let ktosAPIURL = "http://localhost:3000/api/";
const http = require('http')

console.log("NOWA")
let count = 1;
const head = `<html>
<head>
    <title>Login</title>
</head>
<body>
  

`;
const foot=`</body>
    </html>`
function loginRouter(express) {
    if (!express) return;
    let router = express.Router();
   
    
    router.post('/', async (req, res) => {
        let authResult = await authenticate(req.body.username, req.body.password);
        console.log(authResult);
        if (authResult) {
            res.cookie('token', authResult);
            res.redirect('/')
        }
        res.send(formHtml());

    })

    router.get('/logout', (req, res) => {
        res.clearCookie('token');
        res.redirect('/');
    })
    router.get('/', (req, res) => {
       
        res.send(formHtml());
    })

    return router;
}
function formHtml(){
    return head+`
    <form method="post">
     <input name="username">
     <input name="password">
     <input type="submit">
     </form>
    
    `+foot
}

function middleware(req, res, next) {

}
function authenticate(username, password) {
    return new Promise((resolve, reject) => {
        http.request(ktosAPIURL + '/authenticate?username=' + username + '&password=' + password, (res) => {
            // console.log(res)
            let data = '';
            res.setEncoding('utf8')
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve(JSON.parse(data));
            })
        }).end();
    })
}
function getUser(req) {
    return new Promise((resolve, reject) => {
        let token = getToken(req);
        console.log(ktosAPIURL + token)
        http.request(ktosAPIURL + token, (res) => {
            // console.log(res)
            let data = '';
            res.setEncoding('utf8')
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve(JSON.parse(data));
            })
        }).end();
    })
}
function getToken(req) {
    //console.log(req.headers)
    let token
    if (typeof req == "string") {
        token = req;
        console.log("Token from string")
    } else {
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1] // TODO
            console.log("Token from Header")
        }
        else if (req.cookies.token) {
            token = req.cookies.token;
        }
        else {
            token = req.query.token;
            console.log("Token from url")
        }
    }
    return token;
}
module.exports = function (url) {
    if (url) {
        ktosAPIURL = url;
    }
    console.log(++count, url, ktosAPIURL)
    return {
        authenticate,
        getUser,
        loginRouter
    }

}

