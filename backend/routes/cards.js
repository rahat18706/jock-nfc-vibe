import express from 'express';
import NfcCard from '../models/NfcCard.js';
import Business from '../models/Business.js';
import { protect, businessOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/cards - Get cards for current business
router.get('/', protect, businessOnly, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) return res.status(404).json({ error: 'Business not found' });

    const cards = await NfcCard.find({ business: business._id }).sort({ createdAt: -1 });
    res.json({ cards });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cards/:cardId - Get single card
router.get('/:cardId', protect, businessOnly, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const card = await NfcCard.findOne({ cardId: req.params.cardId, business: business._id });
    
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json({ card });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
