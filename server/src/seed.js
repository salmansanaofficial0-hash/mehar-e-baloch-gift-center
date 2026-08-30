import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './utils/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import Banner from './models/Banner.js';

const seed = async () => {
  await connectDB();
  console.log('\n🌱 Starting database seeding...\n');

  // ------ CLEAN EXISTING DATA ------
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Coupon.deleteMany({});
  await Banner.deleteMany({});
  console.log('✓ Cleared existing data');

  // ------ USERS ------
  const admin = await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@meharbaloch.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
    isVerified: true,
  });

  const customer = await User.create({
    name: 'Test Customer',
    email: 'customer@test.com',
    password: 'Customer@123',
    role: 'customer',
    isVerified: true,
    phone: '0300-1234567',
  });
  console.log(`✓ Created admin: ${admin.email}`);
  console.log(`✓ Created customer: ${customer.email}`);

  // ------ CATEGORIES ------
  const perfumesCat = await Category.create({
    name: 'Perfumes & Fragrances',
    slug: 'perfumes-fragrances',
    description: 'Luxurious and long-lasting fragrances for every occasion',
    image: '/uploads/category-perfumes.jpg',
  });

  const skincareCat = await Category.create({
    name: 'Skincare',
    slug: 'skincare',
    description: 'Premium skincare products for a glowing look',
    image: '/uploads/category-skincare.jpg',
  });

  const giftsCat = await Category.create({
    name: 'Gift Sets',
    slug: 'gift-sets',
    description: 'Beautiful gift sets for birthdays, weddings, and special occasions',
    image: '/uploads/category-gifts.jpg',
  });

  const makeupCat = await Category.create({
    name: 'Makeup',
    slug: 'makeup',
    description: 'Cosmetics and makeup products for every look',
    image: '/uploads/category-makeup.jpg',
  });

  // Subcategories
  const lipCat = await Category.create({
    name: 'Lip Products',
    slug: 'lip-products',
    description: 'Lipsticks, glosses, liners and more',
    parentCategory: makeupCat._id,
  });

  const eyeCat = await Category.create({
    name: 'Eye Makeup',
    slug: 'eye-makeup',
    description: 'Mascaras, eyeliners, eyeshadows and more',
    parentCategory: makeupCat._id,
  });

  console.log('✓ Created categories and subcategories');

  // ------ PRODUCTS ------
  const products = await Product.create([
    {
      name: 'Rose Oud Perfume',
      slug: 'rose-oud-perfume',
      description: 'A divine blend of Turkish rose petals and aged Oud wood. This fragrance evokes luxury and sophistication, with a long-lasting trail that lingers beautifully.',
      shortDescription: 'A luxurious rose and oud fragrance',
      price: 1800,
      comparePrice: 2200,
      discountPrice: 1800,
      stock: 35,
      sku: 'PERF-001',
      category: perfumesCat._id,
      images: ['/uploads/rose-oud.jpg'],
      tags: ['perfume', 'oud', 'rose', 'luxury'],
      featured: true,
      bestSeller: true,
      discount: 18,
      status: 'active',
    },
    {
      name: 'Jasmine Blossom EDP',
      slug: 'jasmine-blossom-edp',
      description: 'Fresh and floral jasmine fragrance, perfect for daytime wear. Light, airy and incredibly feminine.',
      price: 1200,
      comparePrice: 1500,
      stock: 50,
      sku: 'PERF-002',
      category: perfumesCat._id,
      images: ['/uploads/jasmine.jpg'],
      tags: ['perfume', 'jasmine', 'floral'],
      featured: true,
      status: 'active',
      variants: [
        { size: '30ml', price: 800, stock: 20 },
        { size: '50ml', price: 1200, stock: 20 },
        { size: '100ml', price: 1800, stock: 10 },
      ],
    },
    {
      name: 'Vitamin C Brightening Serum',
      slug: 'vitamin-c-brightening-serum',
      description: 'A powerful antioxidant serum with 20% Vitamin C that fades dark spots and brightens skin tone. Lightweight, absorbs fast, and leaves a radiant glow.',
      price: 950,
      comparePrice: 1200,
      stock: 25,
      sku: 'SKIN-001',
      category: skincareCat._id,
      images: ['/uploads/vitamin-c-serum.jpg'],
      tags: ['serum', 'vitamin c', 'brightening', 'skincare'],
      featured: true,
      status: 'active',
    },
    {
      name: 'Hydrating Rosewater Toner',
      slug: 'hydrating-rosewater-toner',
      description: 'Alcohol-free rosewater toner that hydrates, soothes and balances skin pH. Ideal for all skin types.',
      price: 650,
      comparePrice: 850,
      stock: 40,
      sku: 'SKIN-002',
      category: skincareCat._id,
      images: ['/uploads/rosewater-toner.jpg'],
      tags: ['toner', 'rosewater', 'hydrating', 'skincare'],
      status: 'active',
    },
    {
      name: 'Luxury Eid Gift Set',
      slug: 'luxury-eid-gift-set',
      description: 'A complete luxury gift set including a premium perfume, moisturizing body lotion, exfoliating scrub, and a satin pouch. Perfect for Eid gifting.',
      price: 3500,
      comparePrice: 4500,
      stock: 15,
      sku: 'GIFT-001',
      category: giftsCat._id,
      images: ['/uploads/eid-gift-set.jpg'],
      tags: ['gift', 'eid', 'luxury', 'set'],
      featured: true,
      bestSeller: true,
      status: 'active',
    },
    {
      name: 'Bridal Beauty Gift Box',
      slug: 'bridal-beauty-gift-box',
      description: 'A curated bridal beauty collection for the special day. Contains rose face wash, brightening serum, moisturizer, and a beautiful floral perfume.',
      price: 4800,
      comparePrice: 6000,
      stock: 8,
      sku: 'GIFT-002',
      category: giftsCat._id,
      images: ['/uploads/bridal-gift.jpg'],
      tags: ['gift', 'bridal', 'wedding', 'luxury'],
      featured: true,
      status: 'active',
    },
    {
      name: 'Velvet Matte Lipstick',
      slug: 'velvet-matte-lipstick',
      description: 'Long-lasting velvet matte lipstick with rich pigmentation. Lightweight formula that does not dry out lips.',
      price: 450,
      comparePrice: 600,
      stock: 60,
      sku: 'LIP-001',
      category: lipCat._id,
      images: ['/uploads/matte-lipstick.jpg'],
      tags: ['lipstick', 'matte', 'makeup'],
      status: 'active',
      variants: [
        { color: 'Classic Red', price: 450, stock: 20 },
        { color: 'Berry Nude', price: 450, stock: 20 },
        { color: 'Dusty Rose', price: 450, stock: 20 },
      ],
    },
    {
      name: 'Kohl Eyeliner Kajal',
      slug: 'kohl-eyeliner-kajal',
      description: 'Intense black kajal for bold and dramatic eye looks. Waterproof and smudge-proof formula that lasts all day.',
      price: 280,
      stock: 3, // Low stock to test alert
      sku: 'EYE-001',
      category: eyeCat._id,
      images: ['/uploads/kajal.jpg'],
      tags: ['kajal', 'eyeliner', 'eye', 'makeup'],
      status: 'active',
    },
  ]);

  console.log(`✓ Created ${products.length} products`);

  // ------ COUPONS ------
  await Coupon.create([
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrderAmount: 500,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      usageLimit: 100,
      isActive: true,
    },
    {
      code: 'EID2025',
      type: 'fixed',
      value: 300,
      minOrderAmount: 1500,
      expiryDate: new Date('2025-12-31'),
      usageLimit: 50,
      isActive: true,
    },
    {
      code: 'FLAT500',
      type: 'fixed',
      value: 500,
      minOrderAmount: 3000,
      usageLimit: 20,
      isActive: true,
    },
  ]);
  console.log('✓ Created sample coupons');

  // ------ BANNERS ------
  await Banner.create([
    {
      title: 'Luxury Gifts for Every Occasion',
      subtitle: 'Free shipping on orders above Rs. 2000',
      image: '/uploads/banner-1.jpg',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      isActive: true,
    },
    {
      title: 'New Arrivals — Eid Collection 2025',
      subtitle: 'Discover our exclusive Eid gift sets',
      image: '/uploads/banner-2.jpg',
      buttonText: 'View Collection',
      buttonLink: '/shop?category=gift-sets',
      isActive: true,
    },
  ]);
  console.log('✓ Created sample banners');

  console.log('\n✅ Seeding complete!\n');
  console.log('   Admin Login:    admin@meharbaloch.com / Admin@123');
  console.log('   Customer Login: customer@test.com / Customer@123');
  console.log('\n   Coupons: WELCOME10, EID2025, FLAT500\n');

  mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  mongoose.connection.close();
  process.exit(1);
});
