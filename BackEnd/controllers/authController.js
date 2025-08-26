const { registerUser, loginUser } = require('../models/userModel');
const { generateToken } = require('../utils/jwt');
const response = require('../utils/responseTemplate');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const { status, user_id } = await registerUser(name, email, password, role);

        if (status !== 'SUCCESS') {
            return res.status(400).json(response.error(status));
        }

        res.json(response.success('Registration successful', {
            user_id,
            name,
            email,
            role
        }));
    } catch (err) {
        console.error(err);
        res.status(500).json(response.error('Server error'));
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { status, user_id, role, name } = await loginUser(email, password);

        if (status !== 'SUCCESS') {
            return res.status(401).json(response.unauthorized(status));
        }

        const token = generateToken({ userId: user_id, name, role });

        res.json(response.success('Login successful', {
            user: { user_id, name, email, role },
            token
        }));
    } catch (err) {
        console.error(err);
        res.status(500).json(response.error('Server error'));
    }
};

module.exports = { register, login };