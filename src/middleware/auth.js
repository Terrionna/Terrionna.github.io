// Login checks for Testify.
// These run before a controller and decide if the request can continue.
const jwt = require('jsonwebtoken');

// Checks for a valid token and saves its contents on req.auth.
const requireAuth = (req, res, next) => {
    // The token comes in the Authorization header as: Bearer <token>
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    // Reject the request if there is no token.
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Login required' });
    }

    try {
        // Check the signature and the expiry.
        req.auth = jwt.verify(token, process.env.JWT_SECRET);
        // Continue to the controller.
        return next();
    } catch (err) {
        // The token is invalid or expired.
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Checks that the user is an admin.
const requireAdmin = (req, res, next) => {
    // 403 means signed in but not an admin.
    if (!req.auth || req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    return next();
};

module.exports = { requireAuth, requireAdmin };