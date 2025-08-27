const { verifyToken } = require('../utils/jwt');
const response = require('../utils/responseTemplate');

const authMiddleware = (requiredRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json(response.unauthorized('No token provided'));

        try {
            const decoded = verifyToken(token);
            req.user = decoded; // contains userId, name, role

            if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
                return res.status(403).json(response.forbidden('Access forbidden for your role'));
            }

            next();
        } catch (err) {
            return res.status(403).json(response.unauthorized('Invalid token'));
        }
    };
};

module.exports = authMiddleware;
