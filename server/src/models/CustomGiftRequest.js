import mongoose from 'mongoose';

const customGiftRequestSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    occasion: { type: String, required: true },
    budget: { type: Number, required: true },
    description: { type: String, required: true },
    referenceImage: { type: String },
    status: { type: String, enum: ['new', 'reviewing', 'quoted', 'completed'], default: 'new' },
    notes: { type: String },
  },
  { timestamps: true }
);

const CustomGiftRequest = mongoose.model('CustomGiftRequest', customGiftRequestSchema);

export default CustomGiftRequest;
