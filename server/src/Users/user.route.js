const express = require('express');
const { 
    registerUser, 
    loginUser, 
    resetUserPassword, 
    forgotPassword, 
    resetPasswordWithToken 
} = require('./user.controller');

const router = express.Router();

// Signup Route
router.post('/signup', registerUser);

// Login Route 
router.post('/login', loginUser);

// Reset Password Route
router.post('/reset-password', resetUserPassword);

// Forgot Password Route (Request Token)
router.post('/forgot-password', forgotPassword);

// Reset Password Using Token
router.post('/reset-password/:token', resetPasswordWithToken);

module.exports = router;
