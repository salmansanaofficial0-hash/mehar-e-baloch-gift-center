import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Mehr-e-Baloch Cosmetics' },
    tagline: { type: String, default: 'Beauty, Elegance & Gifts For Her' },
    logo: { type: String, default: '/logo.png' },
    phone: { type: String, default: '0336-5415272' },
    phoneSecondary: { type: String, default: '0315-2846050' },
    owner: { type: String, default: 'Bilal Baloch' },
    email: { type: String },
    address: { type: String, default: 'New Star Plus Market, Shop# G-31, Near PTCL Office, Turbat' },
    instagram: { type: String, default: '@mehr.baloch.cosmatic' },
    tiktok: { type: String, default: '@mehr.baloch.cosmatic' },
    currency: { type: String, default: 'PKR' },
    shippingFee: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    stripeKey: { type: String },
    jazzcashKey: { type: String },
    easypaisaKey: { type: String },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
