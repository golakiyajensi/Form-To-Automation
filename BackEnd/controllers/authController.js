const {
  registerUser,
  loginUser,
  findUserByEmail,
  setUserOtpById,
  setUserOtpByEmail,
  getUserByEmail,
  verifyUserByEmailAndOtp,
  clearOtpByEmail,
  getUserById,
} = require("../models/userModel");
const { generateToken } = require("../utils/jwt");
const response = require("../utils/responseTemplate");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

require("dotenv").config();

// Nodemailer (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Helper: 6-digit OTP
const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const otpExpiry = (ms = 60 * 1000) => new Date(Date.now() + ms);

// === REGISTER ===
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const { status, user_id } = await registerUser(name, email, password, role);

    if (status !== "SUCCESS") {
      return res.status(400).json(response.error(status));
    }

    // Generate OTP + save
    const otp = genOtp();
    const expiry = otpExpiry();
    await setUserOtpById(user_id, otp, expiry);

    // Send OTP email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
          <h2>Hi ${name}, welcome!</h2>
          <p>Your verification code is:</p>
          <div style="font-size:28px;font-weight:bold;letter-spacing:4px">${otp}</div>
          <p>This code expires in <b>60 seconds</b>.</p>
        </div>
      `,
    });

    // Notify admin of new registration
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "New user registered",
        html: `<p>User <b>${name}</b> (${email}) has just registered.</p>`,
      });
    }

    return res.json(
      response.success(
        "Registration successful. OTP sent to email. Please verify to continue.",
        {
          user_id,
          name,
          email,
          role,
          require_verification: true,
        }
      )
    );
  } catch (err) {
    console.error(err);
    res.status(500).json(response.error("Server error"));
  }
};

// === LOGIN ===
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { status, user_id, role, name } = await loginUser(email, password);
    if (status !== "SUCCESS") {
      return res.status(401).json(response.unauthorized(status));
    }

    const userRow = await getUserByEmail(email);
    if (!userRow) return res.status(404).json(response.error("User not found"));

    if (userRow.is_verified !== 1) {
      const otp = genOtp();
      const expiry = otpExpiry();
      await setUserOtpByEmail(email, otp, expiry);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email to login",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
            <h2>Hi ${name}, verify your email</h2>
            <p>Your verification code is:</p>
            <div style="font-size:28px;font-weight:bold;letter-spacing:4px">${otp}</div>
            <p>This code expires in <b>60 seconds</b>.</p>
          </div>
        `,
      });

      return res.status(401).json(
        response.unauthorized("Email not verified. OTP sent to your email.", {
          require_verification: true,
          email,
        })
      );
    }

    const token = generateToken({ userId: user_id, name, role });
    res.json(
      response.success("Login successful", {
        user: { user_id, name, email, role },
        token,
      })
    );
  } catch (err) {
    console.error(err);
    res.status(500).json(response.error("Server error"));
  }
};

// === VERIFY OTP ===
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .json(
        response.validationError([{ field: "email/otp", message: "Email and OTP are required" }])
      );
  }

  try {
    const result = await verifyUserByEmailAndOtp(email, otp);
    if (!result.ok) {
      const msg =
        result.reason === "OTP_EXPIRED"
          ? "OTP expired. Please request a new one."
          : result.reason === "INVALID_OTP"
          ? "Invalid OTP."
          : "Verification failed.";
      return res.status(400).json(response.error(msg));
    }

    return res.json(response.success("Email verified successfully."));
  } catch (err) {
    console.error(err);
    res.status(500).json(response.error("Server error"));
  }
};

// === RESEND OTP ===
const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json(response.validationError([{ field: "email", message: "Email is required" }]));
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json(response.error("User not found"));
    if (user.is_verified === 1) return res.status(400).json(response.error("User already verified."));

    if (user.otp_expiry && new Date(user.otp_expiry) > new Date()) {
      return res
        .status(429)
        .json(response.error("An OTP is already active. Please wait until it expires."));
    }

    const otp = genOtp();
    const expiry = otpExpiry();
    await setUserOtpByEmail(email, otp, expiry);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your new verification code",
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
               <h2>Verification code</h2>
               <div style="font-size:28px;font-weight:bold;letter-spacing:4px">${otp}</div>
               <p>This code expires in <b>60 seconds</b>.</p>
             </div>`,
    });

    return res.json(response.success("OTP resent to your email."));
  } catch (err) {
    console.error(err);
    res.status(500).json(response.error("Server error"));
  }
};

// === FORGOT / RESET PASSWORD ===
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json(response.error("User not found"));

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour
    await saveResetToken(user.user_id, resetToken, expiry);

    // send reset email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `<p>Click the link to reset your password: <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a></p>`,
    });

    res.json(response.success("Password reset email sent."));
  } catch (err) {
    console.error(err);
    res.status(500).json(response.error("Server error"));
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await resetUserPassword(token, hashedPassword);

    if (!result) return res.status(400).json(response.error("Invalid or expired token"));

    res.json(response.success("Password reset successful"));
  } catch (err) {
    console.error(err);
    res.status(500).json(response.error("Server error"));
  }
};

module.exports = {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
};
