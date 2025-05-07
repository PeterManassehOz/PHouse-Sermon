const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage for audio and image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = file.mimetype.startsWith('image/') ? 'uploads/images/' : 'uploads/audio/';
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directories exist
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer
const upload = multer({ storage: storage });

module.exports = upload;
