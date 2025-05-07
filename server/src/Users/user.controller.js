const jwt = require('jsonwebtoken');
const User = require('./user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const registerUser = async (req, res) => {
    try {
        const { username, email, phcode, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ username, email, phcode, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin  }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(201).json({ token, user });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { phcode, password } = req.body;
        const user = await User.findOne({ phcode });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validity = await bcrypt.compare(password, user.password);
        if (!validity) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin  }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, user });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

const resetUserPassword = async (req, res) => {
    try {
        const { phcode, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ phcode });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin  }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: "Password reset successful", token, user });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

// 🔹 Request Password Reset (Generate Token)
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // 1 hour expiry

        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        
        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click the link below:
                   http://localhost:5173/reset-password/${resetToken}`
        };

            await transporter.sendMail(mailOptions)
            .then(() => {
                return res.status(200).json({ message: "Password reset token generated" });
            })
            .catch(error => {
                console.error("Email sending error:", error);
                return res.status(500).json({ message: "Email sending failed", error: error.message });
            });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};


// 🔹 Reset Password Using Token
const resetPasswordWithToken = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body; // Extract password and confirmPassword
        const { token } = req.params; // Extract token from URL

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Find user by reset token and ensure token hasn't expired
        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token fields
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};


module.exports = { 
    registerUser, 
    loginUser, 
    resetUserPassword, 
    forgotPassword, 
    resetPasswordWithToken 
};
