
const jwt = require('jsonwebtoken');
const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is require' });
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401)
        .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

const isJudge = (req, res, next) => {
    if (!req.user || !req.user.judge) {
        return res.status(403).json({ message: 'Access restricted to judges only' });
    }
    next();
};

module.exports = ensureAuthenticated;
module.exports = isJudge;