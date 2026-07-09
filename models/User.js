import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tableNumber: { type: String },
  orderCount: { type: Number, default: 0 },
  preferences: {
    LanguageSetting: { type: String, default: 'th' },
    ThemeSetting: { type: String, default: 'light' }
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
