import express from 'express';
import { Order, Product } from '../models/Order.js';
import Business from '../models/Business.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products - List available products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/orders - Create new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, discountCode } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.product}` });
      }
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        customization: item.customization,
      });
    }

    // Generate order number
    const orderNumber = `TR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      items: orderItems,
      subtotal,
      discount: 0,
      discountCode,
      shippingCost: subtotal > 50 ? 0 : 5.99, // Free shipping over $50
      total: subtotal + (subtotal > 50 ? 0 : 5.99),
      shippingAddress,
      status: 'pending',
    });

    res.status(201).json({ order, message: 'Order created successfully' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/my - Get my orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      $or: [
        { customer: req.user._id },
        { $where: req.user.role === 'admin' }, // Admin can see all
      ],
    }).populate('items.product');

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/orders/:id/payment - Simulate payment
router.post('/:id/payment', protect, async (req, res) => {
  try {
    const { method, transactionId } = req.body;
    
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.payment = {
      method,
      transactionId: transactionId || `TXN-${Date.now()}`,
      paidAt: new Date(),
      status: 'completed',
    };
    order.status = 'paid';
    await order.save();

    res.json({ order, message: 'Payment processed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
