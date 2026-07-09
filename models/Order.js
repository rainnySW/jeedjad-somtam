import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  menu_item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  name: String,
  price_per_unit: Number,
  quantity: Number,
  subtotal: Number,
  special_instructions: String,
  options: Object
});

const OrderSchema = new mongoose.Schema({
  table_number: { type: String, required: true },
  items: [OrderItemSchema],
  total_amount: { type: Number, required: true },
  payment_slip_url: { type: String },
  status: { type: String, enum: ['Pending', 'Preparing', 'Served', 'Cancelled'], default: 'Pending' },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
