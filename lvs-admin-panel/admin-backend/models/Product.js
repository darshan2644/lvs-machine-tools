import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Product', productSchema);
