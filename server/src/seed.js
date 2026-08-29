import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mehar-e-baloch-gift-center');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@meharbaloch.com',
      password: 'admin123',
      role: 'admin',
    });

    const categories = await Category.insertMany([
      { name: 'Gift Baskets', slug: 'gift-baskets', description: 'Curated gifting hampers' },
      { name: 'Decor', slug: 'decor', description: 'Home and occasion decor' },
      { name: 'Personalized Gifts', slug: 'personalized-gifts', description: 'Custom keepsakes' },
      { name: 'Greeting Cards', slug: 'greeting-cards', description: 'Thoughtful messages' },
      { name: 'Toys', slug: 'toys', description: 'Fun and joyful gifts' },
      { name: 'Perfumes', slug: 'perfumes', description: 'Fragrant gift picks' },
    ]);

    await Product.insertMany([
      {
        name: 'Royal Celebration Hamper',
        slug: 'royal-celebration-hamper',
        description: 'A premium gifting basket with luxury treats and elegant packaging for birthdays and special occasions.',
        shortDescription: 'Luxury hamper for milestone celebrations',
        category: categories[0]._id,
        price: 3500,
        comparePrice: 4200,
        stock: 15,
        featured: true,
        bestSeller: true,
        images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80'],
        occasion: 'Birthday',
        tags: ['luxury', 'hamper'],
        rating: 4.8,
        numReviews: 12,
      },
      {
        name: 'Golden Bloom Vase',
        slug: 'golden-bloom-vase',
        description: 'A handcrafted floral vase designed for statement home decor and gifting.',
        shortDescription: 'Luxury decorative vase',
        category: categories[1]._id,
        price: 2200,
        comparePrice: 2800,
        stock: 20,
        featured: true,
        images: ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80'],
        occasion: 'Home Decor',
        tags: ['decor', 'vase'],
        rating: 4.6,
        numReviews: 8,
      },
      {
        name: 'Personalized Name Frame',
        slug: 'personalized-name-frame',
        description: 'Custom-made name frame for anniversaries, farewell gifts, and memorable surprises.',
        shortDescription: 'Custom engraved keepsake',
        category: categories[2]._id,
        price: 1800,
        comparePrice: 2400,
        stock: 25,
        featured: true,
        images: ['https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80'],
        occasion: 'Anniversary',
        tags: ['custom', 'personalized'],
        rating: 4.9,
        numReviews: 15,
      },
    ]);

    console.log('Seed complete. Admin email: admin@meharbaloch.com | password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
