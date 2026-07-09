import dbConnect from './mongodb';
import Menu from '../models/Menu';
import Order from '../models/Order';

const localMenu = [
  { _id: "m1", name: "Khanom Jeen (Rice Noodles)", name_th: "ขนมจีน", price: 20, category: "Sides", image_url: "/menu/khanom-jeen.jpg", description: "Soft and fresh fermented rice noodles, perfect for pairing with spicy somtam or curries.", description_th: "ขนมจีนเส้นสด นุ่มอร่อย ทานคู่กับส้มตำเข้ากันสุดๆ", is_available: true },
  { _id: "m2", name: "Steamed Rice", name_th: "ข้าวสวย", price: 15, category: "Sides", image_url: "/menu/steamed-rice.jpg", description: "Fluffy steamed jasmine rice.", description_th: "ข้าวสวยหอมมะลิร้อนๆ นุ่มละมุน", is_available: true },
  { _id: "m3", name: "Sticky Rice", name_th: "ข้าวเหนียว", price: 15, category: "Sides", image_url: "/menu/sticky-rice.jpg", description: "Warm, perfectly steamed glutinous rice served in a traditional bamboo basket.", description_th: "ข้าวเหนียวนุ่มๆ ร้อนๆ เสิร์ฟในกระติ๊บ", is_available: true },
  { _id: "m4", name: "Grilled Pork Neck", name_th: "คอหมูย่าง", price: 70, category: "Meats", image_url: "/menu/grilled-pork-neck.jpg", description: "Juicy, tender grilled pork neck marinated in Thai spices. Served with a spicy dipping sauce.", description_th: "คอหมูย่างมันแทรก หมักเข้าเนื้อ ย่างเตาถ่านหอมๆ", is_available: true },
  { _id: "m5", name: "Somtam with Fresh Shrimp", name_th: "ตำกุ้งสด", price: 80, category: "Somtam", image_url: "/menu/somtam-fresh-shrimp.jpg", description: "Spicy papaya salad loaded with plump, fresh raw shrimp.", description_th: "ส้มตำแซ่บๆ ใส่กุ้งสดตัวโต เนื้อหวานเด้ง", is_available: true },
  { _id: "m6", name: "Corn Somtam", name_th: "ตำข้าวโพด", price: 50, category: "Somtam", image_url: "/menu/corn-somtam.jpg", description: "Sweet corn kernels pounded with spicy lime dressing, tomatoes, and peanuts.", description_th: "ส้มตำข้าวโพดหวานกรอบ รสชาติเปรี้ยวหวาน เผ็ดกำลังดี", is_available: true },
  { _id: "m7", name: "Somtam with Fermented Fish and Crab", name_th: "ตำปูปลาร้า", price: 80, category: "Somtam", image_url: "/menu/somtam-pu-plara.jpg", description: "Authentic Isaan-style papaya salad featuring pungent fermented fish sauce and salted crab.", description_th: "ส้มตำปูปลาร้าอีสานแท้ นัวแซ่บถึงใจ ขาดไม่ได้เลย", is_available: true },
  { _id: "m8", name: "Thai Somtam", name_th: "ตำไทย", price: 50, category: "Somtam", image_url: "/menu/thai-somtam.jpg", description: "Classic green papaya salad with peanuts, dried shrimp, cherry tomatoes, and a sweet, tangy, and spicy lime dressing.", description_th: "ส้มตำไทยรสจัดจ้าน เปรี้ยวหวานลงตัว พร้อมถั่วลิสงและกุ้งแห้ง", is_available: true },
  { _id: "m9", name: "Thai Somtam with Salted Egg", name_th: "ตำไทยไข่เค็ม", price: 60, category: "Somtam", image_url: "/menu/thai-somtam-salted-egg.jpg", description: "Our classic Thai Somtam topped with rich, creamy salted egg wedges.", description_th: "ส้มตำไทยใส่ไข่เค็ม รสชาติกลมกล่อมเข้ากันอย่างลงตัว", is_available: true },
  { _id: "m10", name: "Long Bean Somtam", name_th: "ตำถั่ว", price: 50, category: "Somtam", image_url: "/menu/long-bean-somtam.jpg", description: "Crunchy long beans pounded in a mortar with spicy fermented fish sauce.", description_th: "ส้มตำถั่วฝักยาวกรอบๆ ตำใส่ปลาร้านัวๆ", is_available: true },
  { _id: "m11", name: "Nam Tok Moo (Spicy Grilled Pork Salad)", name_th: "น้ำตกหมู", price: 60, category: "Larb / Nam Tok", image_url: "/menu/nam-tok-moo.jpg", description: "Grilled pork sliced and tossed with roasted rice powder, chili, mint, and lime juice.", description_th: "น้ำตกหมูย่างรสแซ่บ หอมข้าวคั่วและใบสะระแหน่", is_available: true },
  { _id: "m12", name: "Fried Chicken Wings with Fish Sauce", name_th: "ปีกไก่ทอดน้ำปลา", price: 60, category: "Meats", image_url: "/menu/fried-chicken-wings.jpg", description: "Crispy fried chicken wings marinated in premium fish sauce.", description_th: "ปีกไก่ทอดน้ำปลา กรอบนอกนุ่มใน เค็มกำลังดี", is_available: true },
  { _id: "m13", name: "Larb Moo (Spicy Minced Pork Salad)", name_th: "ลาบหมู", price: 60, category: "Larb / Nam Tok", image_url: "/menu/larb-moo.jpg", description: "Minced pork salad mixed with fresh herbs, chili, lime, and roasted rice powder.", description_th: "ลาบหมูรสเด็ด หอมเครื่องเทศและข้าวคั่ว", is_available: true },
  { _id: "m14", name: "Sun-dried Pork", name_th: "หมูแดดเดียว", price: 60, category: "Meats", image_url: "/menu/sun-dried-pork.jpg", description: "Marinated strips of pork, sun-dried and deep-fried to perfection.", description_th: "หมูแดดเดียวทอดหอมๆ เคี้ยวเพลิน ทานกับข้าวเหนียวร้อนๆ", is_available: true },
  { _id: "m15", name: "Grilled Chicken", name_th: "ไก่ย่าง", price: 60, category: "Meats", image_url: "/menu/grilled-chicken.jpg", description: "Thai style marinated grilled chicken served with spicy tamarind dipping sauce.", description_th: "ไก่ย่างหมักสมุนไพร หอมกรุ่น เสิร์ฟพร้อมน้ำจิ้มแจ่วรสเด็ด", is_available: true },
  { _id: "m16", name: "Spicy Bamboo Shoot Salad", name_th: "ซุปหน่อไม้", price: 60, category: "Larb / Nam Tok", image_url: "/menu/bamboo-shoot-salad.jpg", description: "Authentic Isaan spicy and sour shredded bamboo shoot salad with roasted rice powder and fresh herbs.", description_th: "ซุปหน่อไม้รสแซ่บ หอมข้าวคั่วและปลาร้านัวๆ", is_available: true }
];

let localOrders = [];
let localUsers = [];

export async function getMenu() {
  try {
    await dbConnect();
    const items = await Menu.find({}).lean();
    if (items.length === 0) return localMenu;
    return items.map(item => ({...item, _id: item._id.toString()}));
  } catch (e) {
    console.warn("MongoDB connection failed or empty, falling back to local menu");
    return localMenu;
  }
}

export async function createOrder(orderData) {
  try {
    await dbConnect();
    const order = await Order.create(orderData);
    return order;
  } catch (e) {
    console.warn("MongoDB connection failed, falling back to local orders");
    const newOrder = { _id: Date.now().toString(), ...orderData, created_at: new Date() };
    localOrders.push(newOrder);
    return newOrder;
  }
}

export async function getActiveOrders() {
  try {
    await dbConnect();
    const orders = await Order.find({ status: { $in: ['Pending', 'Preparing'] } }).sort({ created_at: 1 }).lean();
    return orders;
  } catch (e) {
    return localOrders.filter(o => ['Pending', 'Preparing'].includes(o.status));
  }
}

export async function updateOrderStatus(id, status) {
  try {
    await dbConnect();
    await Order.findByIdAndUpdate(id, { status });
    return true;
  } catch(e) {
    const order = localOrders.find(o => o._id === id);
    if (order) order.status = status;
    return true;
  }
}
