import express from 'express';
import User from '../models/User.js';
import Business from '../models/Business.js';
import NfcCard from '../models/NfcCard.js';
import { Order, Product } from '../models/Order.js';
import ScanEvent from '../models/ScanEvent.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect, adminOnly);

// ============================================
// ADMIN DASHBOARD STATS
// ============================================
router.get('/stats', async (req, res) => {
  try {
    const [totalBusinesses, totalUsers, totalCards, totalOrders, totalScans] = await Promise.all([
      Business.countDocuments(),
      User.countDocuments({ role: 'business' }),
      NfcCard.countDocuments(),
      Order.countDocuments(),
      ScanEvent.countDocuments(),
    ]);

    const revenue = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customer', 'fullName email')
      .populate('business', 'name');

    res.json({
      stats: {
        totalBusinesses,
        totalUsers,
        totalCards,
        totalOrders,
        totalScans,
        totalRevenue: revenue[0]?.total || 0,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// BUSINESS MANAGEMENT
// ============================================

// GET /api/admin/businesses - List all businesses
router.get('/businesses', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }
    if (status === 'active') query.isActive = true;
    if (status === 'suspended') query.isSuspended = true;

    const businesses = await Business.find(query)
      .populate('owner', 'username email fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Business.countDocuments(query);

    res.json({ businesses, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/businesses - Admin creates new business + account
router.post('/businesses', async (req, res) => {
  try {
    const { username, password, email, fullName, businessName, category } = req.body;

    // Validate required fields
    if (!username || !password || !email || !fullName || !businessName || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check existing
    const existing = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create user account (admin sets credentials)
    const user = await User.create({
      username: username.toLowerCase().trim(),
      password, // Will be hashed by pre-save hook
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      role: 'business',
      createdBy: req.user._id,
    });

    // Create business
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const business = await Business.create({
      name: businessName,
      slug,
      category,
      owner: user._id,
    });

    res.status(201).json({
      message: 'Business and account created',
      business,
      credentials: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Admin create business error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/businesses/:id - Update business
router.put('/businesses/:id', async (req, res) => {
  try {
    const { isActive, isSuspended, suspendedReason, plan } = req.body;
    
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive, isSuspended, suspendedReason, plan } },
      { new: true }
    );

    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json({ business, message: 'Business updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/businesses/:id
router.delete('/businesses/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    // Delete associated data
    await Promise.all([
      NfcCard.deleteMany({ business: business._id }),
      User.findByIdAndDelete(business.owner),
      Business.findByIdAndDelete(business._id),
    ]);

    res.json({ message: 'Business and associated data deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// NFC CARD MANAGEMENT
// ============================================

// GET /api/admin/cards - All cards
router.get('/cards', async (req, res) => {
  try {
    const cards = await NfcCard.find()
      .populate('business', 'name slug')
      .sort({ createdAt: -1 });
    res.json({ cards });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/cards - Admin creates/assigns NFC card
router.post('/cards', async (req, res) => {
  try {
    const { cardId, businessId, destinationUrl, label } = req.body;

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    const card = await NfcCard.create({
      cardId,
      business: business._id,
      destinationUrl,
      label,
    });

    res.status(201).json({ card, message: 'Card created and assigned' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Card ID already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/cards/:id - Admin updates card
router.put('/cards/:id', async (req, res) => {
  try {
    const { isActive, destinationUrl, label } = req.body;
    const card = await NfcCard.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive, destinationUrl, label } },
      { new: true }
    );
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json({ card });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// ORDER MANAGEMENT
// ============================================

router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('customer', 'fullName email')
      .populate('business', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);
    res.json({ orders, total });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status, trackingNumber } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive, role } },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
