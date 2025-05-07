const jwt = require('jsonwebtoken');
const User = require('../Users/user.model'); // Adjust path as necessary
const Admin = require('../Admin/admin.model'); // Adjust path as necessary

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        req.user = { id: decoded.id, isAdmin: decoded.isAdmin };

        if (decoded.isAdmin) {
            console.log('User is an admin');
            const admin = await Admin.findById(decoded.id);
            if (!admin) {
                console.log('Admin not found');
                return res.status(401).json({ message: 'Admin not found, authorization denied' });
            }
        } else {
            console.log('User is not an admin');
        }

        next();
    } catch (error) {
        console.log('Token verification failed:', error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware to restrict access to admins only
const adminAuthMiddleware = (req, res, next) => {
    if (req.user && req.user.isAdmin === true) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};

module.exports = { authMiddleware, adminAuthMiddleware };
