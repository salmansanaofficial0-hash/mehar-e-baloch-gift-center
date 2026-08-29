import express from 'express';
import Banner from '../models/Banner.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const banners = await Banner.find({ isActive: true });
  res.json(banners);
});

export default router;
