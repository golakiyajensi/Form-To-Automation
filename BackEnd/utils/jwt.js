const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

// Generate token with role included
const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
