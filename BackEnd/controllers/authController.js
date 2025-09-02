const { registerUser, loginUser, findUserByEmail, saveResetToken, resetUserPassword } = require('../models/userModel');
const { generateToken } = require('../utils/jwt');
const response = require('../utils/responseTemplate');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json(response.error("User not found"));
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

        await saveResetToken(user.user_id, resetToken, expiry);

        // TODO: send email logic here
        // For now return token in response
        res.json(response.success("Password reset token generated", { resetToken }));
    } catch (err) {
        console.error(err);
        res.status(500).json(response.error("Server error"));
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await resetUserPassword(token, hashedPassword);

        if (!result) {
            return res.status(400).json(response.error("Invalid or expired token"));
        }

        res.json(response.success("Password reset successful"));
    } catch (err) {
        console.error(err);
        res.status(500).json(response.error("Server error"));
    }
};

module.exports = { register, login, forgotPassword, resetPassword };