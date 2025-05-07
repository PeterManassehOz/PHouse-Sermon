const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('./admin.model');

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin with hashed password
        admin = new Admin({ name, email, password: hashedPassword });
        await admin.save();

        // Generate token
        const token = jwt.sign({ id: admin._id, isAdmin: true  }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send success response with token
        res.status(201).json({ message: "Admin registered successfully", token, admin });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        let admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ id: admin._id, isAdmin: true  }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send success response with token
        res.status(200).json({ message: "Login successful", token, admin });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { 
    registerAdmin,
    loginAdmin,
};
