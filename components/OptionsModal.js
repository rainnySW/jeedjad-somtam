import { useState, useEffect, useMemo } from 'react';

const ADDONS_DATA = [
  { id: 'Khanom Jeen (Rice Noodles)', en: 'Khanom Jeen (Rice Noodles)', th: 'ขนมจีน', price: 10 },
  { id: 'Salted Egg (ไข่เค็ม)', en: 'Salted Egg', th: 'ไข่เค็ม', price: 15 },
  { id: 'Pork Rind (แคบหมู)', en: 'Pork Rind', th: 'แคบหมู', price: 15 }
];

export default function OptionsModal({ item, onClose, onSave, lang, t }) {
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [spiciness, setSpiciness] = useState('Medium');
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    if (item) {
      setQty(item.quantity || 1);
      setInstructions(item.instructions || '');
      setSpiciness(item.options?.spiciness || 'Medium');
      setAddons(item.options?.addons || []);
    }
  }, [item]);

  const basePrice = useMemo(() => item?.basePrice || item?.price || 0, [item]);

  const addonsPrice = useMemo(() => {
    return addons.reduce((total, addonId) => {
      const addon = ADDONS_DATA.find(a => a.id === addonId);
      return total + (addon ? addon.price : 0);
    }, 0);
  }, [addons]);

  if (!item) return null;

  const handleSave = () => {
    onSave({
      ...item,
      basePrice: basePrice,
      price: basePrice + addonsPrice,
      quantity: qty,
      instructions,
      options: {
        spiciness: item.category === 'Somtam' ? spiciness : undefined,
        addons: item.category === 'Somtam' ? addons : undefined
      }
    });
    onClose();
  };

  const toggleAddon = (addon) => {
    if (addons.includes(addon)) {
      setAddons(addons.filter(a => a !== addon));
    } else {
      setAddons([...addons, addon]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white dark:bg-[#292524] w-full sm:w-[500px] max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 flex flex-col animate-slide-up-panel">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{item.uid ? (lang === 'th' ? 'แก้ไขออเดอร์' : 'Edit Order') : (lang === 'th' ? 'เพิ่มลงออเดอร์' : 'Add to Order')}</h2>
          <button onClick={onClose} className="text-2xl w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
        </div>

        <div className="flex gap-4 mb-6">
          {item.image_url && <img src={item.image_url} className="w-24 h-24 rounded-xl object-cover" />}
          <div>
            <h3 className="font-bold text-lg">{lang === 'th' && item.name_th ? item.name_th : item.name}</h3>
            <p className="font-bold text-[#E63946] mt-1">฿{basePrice}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">{lang === 'th' ? 'จำนวน' : 'Quantity'}</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full font-bold text-xl hover:bg-gray-200 dark:hover:bg-gray-700">-</button>
            <span className="text-xl font-bold w-6 text-center">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-10 h-10 bg-[#E63946]/10 text-[#E63946] rounded-full font-bold text-xl hover:bg-[#E63946]/20">+</button>
          </div>
        </div>

        {item.category === 'Somtam' && (
          <div className="mb-6 space-y-6 animate-fade-in">
            {/* Spiciness Level */}
            <div>
              <label className="block text-sm font-bold mb-3 flex justify-between">
                <span>{lang === 'th' ? 'ระดับความเผ็ด' : 'Spiciness Level'}</span>
                <span className="text-[#E63946]">🌶️</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'No Chili', en: 'No Chili', th: 'ไม่ใส่พริก' },
                  { id: 'Mild', en: 'Mild', th: 'เผ็ดน้อย' },
                  { id: 'Medium', en: 'Medium', th: 'เผ็ดกลาง' },
                  { id: 'Spicy', en: 'Spicy', th: 'เผ็ดมาก' }
                ].map(level => (
                  <button 
                    key={level.id}
                    onClick={() => setSpiciness(level.id)}
                    className={`py-2 px-1 text-sm font-bold rounded-xl border-2 transition-all ${spiciness === level.id ? 'border-[#E63946] bg-[#E63946]/10 text-[#E63946]' : 'border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'}`}
                  >
                    {lang === 'th' ? level.th : level.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div>
              <label className="block text-sm font-bold mb-3">{lang === 'th' ? 'เพิ่มเครื่อง' : 'Add-ons'}</label>
              <div className="space-y-2">
                {ADDONS_DATA.map(addon => (
                  <label key={addon.id} onClick={(e) => { e.preventDefault(); toggleAddon(addon.id); }} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-colors ${addons.includes(addon.id) ? 'bg-[#E63946] border-[#E63946]' : 'border-gray-300'}`}>
                        {addons.includes(addon.id) && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      <span className="font-bold text-sm">{lang === 'th' ? addon.th : addon.en}</span>
                    </div>
                    <span className="text-sm font-bold text-[#2A9D8F]">+฿{addon.price}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">{lang === 'th' ? 'ระบุข้อความพิเศษ' : 'Special Instructions'}</label>
          <textarea 
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#E63946]"
            rows="2"
            placeholder={lang === 'th' ? 'เช่น ไม่ใส่ถั่ว, ขอช้อนส้อม...' : 'No spicy, extra peanuts...'}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          ></textarea>
        </div>

        <button onClick={handleSave} className="w-full py-4 bg-[#E63946] text-white rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_15px_rgba(230,57,70,0.3)] flex items-center justify-center gap-2">
          <span className="text-2xl">🛒</span> <span>฿{(basePrice + addonsPrice) * qty}</span>
        </button>
      </div>
    </div>
  );
}
