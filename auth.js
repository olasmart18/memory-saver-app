// function to respond to unauthorized user
function sendUnauthorized(res) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Access to memories"' });
    res.end('Authentication required');
}

// functon to authenticate user.
const auth = (req, res, next) => {
   // authorizaton from header
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

module.exports = auth;
