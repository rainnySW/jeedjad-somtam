import { createOrder, getActiveOrders, updateOrderStatus } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } else if (req.method === 'GET') {
    const orders = await getActiveOrders();
    res.status(200).json(orders);
  } else if (req.method === 'PUT') {
    const { id, status } = req.body;
    await updateOrderStatus(id, status);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
