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
      { name: 'Cosmetics', slug: 'cosmetics', description: 'Makeup, skincare, and beauty essentials' },
      { name: 'Jewelry', slug: 'jewelry', description: 'Gold and fashion jewelry' },
      { name: 'Handbags', slug: 'handbags', description: 'Stylish bags and purses' },
      { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel for her' },
      { name: 'Perfumes', slug: 'perfumes', description: 'Fragrances and body mists' },
      { name: 'Gift Hampers', slug: 'gift-hampers', description: 'Curated gift baskets and hampers' },
    ]);

    await Product.insertMany([
      {
        name: 'Luxury Gift Hamper',
        slug: 'luxury-gift-hamper',
        description: 'A premium gifting basket with cosmetics, perfumes, and elegant packaging for birthdays and special occasions.',
        shortDescription: 'Luxury hamper for milestone celebrations',
        category: categories[5]._id,
        price: 3500,
        comparePrice: 4200,
        stock: 15,
        featured: true,
        bestSeller: true,
        images: ['https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=1200&q=80'],
        occasion: 'Birthday',
        tags: ['luxury', 'hamper'],
        rating: 4.8,
        numReviews: 12,
      },
      {
        name: 'Gold Necklace Set',
        slug: 'gold-necklace-set',
        description: 'Elegant gold-plated necklace set perfect for gifting and special occasions.',
        shortDescription: 'Premium gold jewelry set',
        category: categories[1]._id,
        price: 8500,
        comparePrice: 9800,
        stock: 10,
        featured: true,
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80'],
        occasion: 'Wedding',
        tags: ['jewelry', 'gold'],
        rating: 4.6,
        numReviews: 8,
      },
      {
        name: 'Designer Handbag',
        slug: 'designer-handbag',
        description: 'Stylish leather handbag — a perfect gift for the fashion-forward woman.',
        shortDescription: 'Trendy designer handbag',
        category: categories[2]._id,
        price: 4200,
        comparePrice: 5000,
        stock: 20,
        featured: true,
        images: ['https://images.unsplash.com/photo-1584917865442-de89af76a83a?auto=format&fit=crop&w=1200&q=80'],
        occasion: 'Everyday',
        tags: ['handbag', 'fashion'],
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
