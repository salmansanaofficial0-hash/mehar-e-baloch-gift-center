import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Mehar-e-Baloch Gift Center' },
    tagline: { type: String, default: 'Gifts That Speak From The Heart' },
    logo: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
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
