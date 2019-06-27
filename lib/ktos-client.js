const http = require('http')

module.exports = function (url) {
    ktosAPIURL = url ? url : "http://localhost:3000/api/"
    if (url) {
        ktosAPIURL = url;
    } else {}
    console.log(++count, url, ktosAPIURL)
    return {
        authenticate,
        getUser,
        loginRouter
    }

}
let ktosAPIURL;
let count = 1;

function loginRouter(express) {
    if (!express) return;
    let router = express.Router();

    router.post('/', async (req, res) => {
        let authResult = await authenticate(req.body.username, req.body.password);
        console.log("AuthResult", authResult);
        if (authResult) {
            res.cookie('token', authResult);
            res.redirect('/')
        } else {
            res.send(formHtml());
        }
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

function formHtml() {
    return `
<html>
  <head>
        <title>Login</title>
  </head>
  <body>
    <form method="post">
      <input name="username">
      <input name="password">
      <input type="submit">
    </form>
  </body>
</html>`;
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
        } else if (req.cookies.token) {
            token = req.cookies.token;
        } else {
            token = req.query.token;
            console.log("Token from url")
        }
    }
    return token;
}