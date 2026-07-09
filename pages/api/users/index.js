import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    try {
      const newUser = await User.create({ name: 'Somtam Lover', tableNumber: null, orderCount: 0 });
      res.status(201).json(newUser);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  } else {
    res.status(405).end();
  }
}
