import dbConnect from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  await dbConnect();
  
  const { action, name, email, password } = req.body;
  
  if (action === 'register') {
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already exists' });
      
      const user = await User.create({ name, email, password });
      return res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email, preferences: user.preferences } });
    } catch (e) {
      return res.status(500).json({ error: 'Registration failed' });
    }
  } else if (action === 'login') {
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    try {
      const user = await User.findOne({ email, password });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      
      return res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email, preferences: user.preferences } });
    } catch (e) {
      return res.status(500).json({ error: 'Login failed' });
    }
  }
  
  return res.status(400).json({ error: 'Invalid action' });
}
