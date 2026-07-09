import { getMenu } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const menu = await getMenu();
    res.status(200).json(menu);
  } else {
    res.status(405).end();
  }
}
