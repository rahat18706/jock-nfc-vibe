import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken, protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// POST /api/auth/login
// Business owner logs in with admin-set credentials
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username (admin-set)
    const user = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated. Contact admin.' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ============================================
// POST /api/auth/register
// Admin creates new business account
// (Only admin can create accounts)
// ============================================
router.post('/register', protect, adminOnly, async (req, res) => {
  try {
    const { username, password, email, fullName, businessName, category } = req.body;

    // Validation
    if (!username || !password || !email || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username exists
    const existingUser = await User.findOne({ 
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      username: username.toLowerCase().trim(),
      password,
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      role: 'business',
      createdBy: req.user._id,
    });

    // If business info provided, create business too
    if (businessName && category) {
      const Business = (await import('../models/Business.js')).default;
      const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      await Business.create({
        name: businessName,
        slug,
        category,
        owner: user._id,
      });
    }

    res.status(201).json({
      message: 'Business account created successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ============================================
// POST /api/auth/logout
// ============================================
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// ============================================
// GET /api/auth/me
// Get current user profile
// ============================================
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// ============================================
// POST /api/auth/forgot-password
// Admin initiates password reset for business
// ============================================
router.post('/forgot-password', protect, adminOnly, async (req, res) => {
  try {
    const { username } = req.body;
    
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // In production: send email with reset link
    // For now, return token (admin would share with business owner)
    res.json({
      message: 'Password reset initiated',
      resetToken, // In production, send via email instead
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// POST /api/auth/reset-password
// Business owner resets password with token
// ============================================
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// PUT /api/auth/change-password
// Business owner changes their own password
// ============================================
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
