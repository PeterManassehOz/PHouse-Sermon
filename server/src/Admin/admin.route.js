const express = require('express');
const { registerAdmin, loginAdmin } = require('./admin.controller');


const router = express.Router();

// Register an Admin
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

module.exports = router;
