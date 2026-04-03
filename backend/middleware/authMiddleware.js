const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Auth failed" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed" });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

const employerMiddleware = (req, res, next) => {
    if (req.user.role !== 'EMPLOYER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Access denied. Employer only." });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware, employerMiddleware };