
// const auth = (req, res, next) => {
//     const { username, password } = req.headers;
    // const authHeader = req.headers.authorization;

//     if (username !== "admin" || password !== "password") {
//         res.writeHead(401, { 'Content-Type': 'text/plain' });
//         res.end('Authentication required');
//     } else {
//         next();
//     }
// };

// module.exports = auth;


// auth.js

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        sendUnauthorized(res);
        return;
    }

    const auth = authHeader.split(' ')[1];
    const [username, password] = Buffer.from(auth, 'base64').toString().split(':');

    if (username === 'admin' && password === 'password') {
        next();
    } else {
        sendUnauthorized(res);
    }
};

function sendUnauthorized(res) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Access to memories"' });
    res.end('Authentication required');
}

module.exports = auth;
