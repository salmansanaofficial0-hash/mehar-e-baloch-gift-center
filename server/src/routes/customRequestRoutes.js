import express from 'express';
import { body, validationResult } from 'express-validator';
import CustomGiftRequest from '../models/CustomGiftRequest.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer routes
router.post(
  '/',
  [
    body('customerName').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('occasion').notEmpty().withMessage('Occasion is required'),
    body('budget').isNumeric().withMessage('Budget must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const request = await CustomGiftRequest.create(req.body);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.get('/:email', async (req, res) => {
  try {
    const requests = await CustomGiftRequest.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const requests = await CustomGiftRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await CustomGiftRequest.countDocuments(query);
    res.json({ requests, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await CustomGiftRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/admin/:id/notes', protect, adminOnly, async (req, res) => {
  try {
    const { notes } = req.body;
    const request = await CustomGiftRequest.findByIdAndUpdate(req.params.id, { notes }, { new: true });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const request = await CustomGiftRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
