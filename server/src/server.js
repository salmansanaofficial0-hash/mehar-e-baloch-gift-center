import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './utils/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import customRequestRoutes from './routes/customRequestRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mehr-e-Baloch Cosmetics API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/banners', bannerRoutes);

app.use(notFound);
app.use(errorHandler);

// Create admin user on startup if doesn't exist
const ensureAdminExists = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@meharbaloch.com' });
    if (!adminExists) {
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@meharbaloch.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✓ Admin user created: admin@meharbaloch.com / admin123');
    } else {
      console.log('✓ Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

const startServer = async () => {
  await connectDB();
  await ensureAdminExists();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
