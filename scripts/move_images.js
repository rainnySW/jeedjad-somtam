const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const destDir = path.join(__dirname, '../public/menu');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const mappings = [
  { original: 'ขนมจีน[20].jpg', new: 'khanom-jeen.jpg' },
  { original: 'ข้าวสวย[15].jpg', new: 'steamed-rice.jpg' },
  { original: 'ข้าวเหนียว[15].jpg', new: 'sticky-rice.jpg' },
  { original: 'คอหมูย่าง[70].jpg', new: 'grilled-pork-neck.jpg' },
  { original: 'ตำกุ้งสด[80].jpg', new: 'somtam-fresh-shrimp.jpg' },
  { original: 'ตำข้าวโพด[50].jpg', new: 'corn-somtam.jpg' },
  { original: 'ตำปูปลาร้า[80].jpg', new: 'somtam-pu-plara.jpg' },
  { original: 'ตำไทย[50].jpg', new: 'thai-somtam.jpg' },
  { original: 'ตำไทยไข่เค็ม[60].jpg', new: 'thai-somtam-salted-egg.jpg' },
  { original: 'ต่ำถั่ว[50].jpg', new: 'long-bean-somtam.jpg' },
  { original: 'น้ำตกหมู[60].jpg', new: 'nam-tok-moo.jpg' },
  { original: 'ปีกไก่ทอดน้ำปลา[60].jpg', new: 'fried-chicken-wings.jpg' },
  { original: 'ลาบหมู[60].jpg', new: 'larb-moo.jpg' },
  { original: 'หมูแดดเดียว[60].jpg', new: 'sun-dried-pork.jpg' },
  { original: 'ไก่ย่าง[60].jpg', new: 'grilled-chicken.jpg' },
];

for (const map of mappings) {
  const srcPath = path.join(srcDir, map.original);
  const destPath = path.join(destDir, map.new);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${map.original} to ${map.new}`);
  } else {
    console.log(`Not found: ${srcPath}`);
  }
}
