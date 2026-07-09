import { useState } from 'react';

export default function CartDrawer({ cart, setCart, isCartOpen, setIsCartOpen, setEditingItem, t, user, setUser, lang }) {
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, table, slip, done
  const [tempTable, setTempTable] = useState(user?.tableNumber || '');
  const [lastOrder, setLastOrder] = useState(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('table');
  };

  const handleConfirmOrder = async () => {
    if (!tempTable) return;
    
    // Save table to user
    setUser({ ...user, tableNumber: tempTable });

    const orderData = {
      table_number: tempTable,
      total_amount: cartTotal,
      items: cart.map(i => ({
        menu_item_id: i._id,
        name: i.name,
        price_per_unit: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
        special_instructions: i.instructions || '',
        options: i.options || {}
      }))
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
    } catch(e) { console.error(e) }
    
    setLastOrder({ items: [...cart], total: cartTotal, table: tempTable });
    setCart([]);
    setCheckoutStep('done');
  };

  const removeItem = (uid) => {
    setCart(cart.filter(i => i.uid !== uid));
  };

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
      )}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-[#292524] shadow-2xl z-50 flex flex-col transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-[#E63946] text-white">
          <h2 className="text-xl font-bold">{checkoutStep === 'cart' ? t('yourOrder') : t('checkoutTitle')}</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-2xl w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {checkoutStep === 'cart' && (
            <div className="space-y-4 animate-fade-in">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-10 font-medium">{t('emptyCart')}</div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.uid} className="flex gap-4 bg-white dark:bg-[#292524] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative group">
                      {item.image_url && <img src={item.image_url} className="w-16 h-16 rounded-lg object-cover" />}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-sm">{lang === 'th' && item.name_th ? item.name_th : item.name}</h3>
                          <span className="font-bold text-[#E63946]">฿{item.price * item.quantity}</span>
                        </div>
                        <p className="text-xs opacity-70">{lang === 'th' ? 'จำนวน' : 'Qty'}: {item.quantity}</p>
                        {item.options?.spiciness && (
                          <p className="text-[10px] text-[#E63946] font-bold mt-1">
                            🌶️ {
                                 {
                                   'No Chili': lang === 'th' ? 'ไม่ใส่พริก' : 'No Chili',
                                   'Mild': lang === 'th' ? 'เผ็ดน้อย' : 'Mild',
                                   'Medium': lang === 'th' ? 'เผ็ดกลาง' : 'Medium',
                                   'Spicy': lang === 'th' ? 'เผ็ดมาก' : 'Spicy'
                                 }[item.options.spiciness] || item.options.spiciness
                               }
                            {item.options.addons?.length > 0 && ` + ${item.options.addons.map(a => 
                                 ({
                                   'Khanom Jeen (Rice Noodles)': lang === 'th' ? 'ขนมจีน' : 'Khanom Jeen',
                                   'Salted Egg (ไข่เค็ม)': lang === 'th' ? 'ไข่เค็ม' : 'Salted Egg',
                                   'Pork Rind (แคบหมู)': lang === 'th' ? 'แคบหมู' : 'Pork Rind'
                                 }[a] || a)
                               ).join(', ')}`}
                          </p>
                        )}
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => setEditingItem(item)} className="text-xs text-[#2A9D8F] font-bold">{lang === 'th' ? 'แก้ไข' : 'Edit'}</button>
                          <button onClick={() => removeItem(item.uid)} className="text-xs text-red-400 font-bold">{lang === 'th' ? 'ลบ' : 'Remove'}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {checkoutStep === 'table' && (
            <div className="animate-fade-in space-y-6 pt-4">
              <div className="bg-white dark:bg-[#292524] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <label className="block text-sm font-bold mb-2">{t('tableNumber')}</label>
                <input 
                  type="number" 
                  value={tempTable}
                  onChange={(e) => setTempTable(e.target.value)}
                  className="w-full text-center text-2xl font-bold p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#E63946] focus:outline-none bg-transparent"
                  placeholder="0"
                />
              </div>

              <div className="text-center">
                <div className="flex bg-gray-100 dark:bg-[#1C1917] rounded-xl p-1 mb-4 w-fit mx-auto">
                  <button 
                    onClick={() => setPaymentMethod('qr')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'qr' ? 'bg-white dark:bg-[#292524] shadow-sm text-[#E63946]' : 'text-gray-500'}`}
                  >
                    {lang === 'th' ? 'คิวอาร์โค้ด' : 'QR Code'}
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('bank')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'bank' ? 'bg-white dark:bg-[#292524] shadow-sm text-[#E63946]' : 'text-gray-500'}`}
                  >
                    {lang === 'th' ? 'โอนเงินผ่านธนาคาร' : 'Bank Transfer'}
                  </button>
                </div>

                {paymentMethod === 'qr' ? (
                  <div className="animate-fade-in">
                    <div className="bg-white p-4 rounded-xl inline-block shadow-sm">
                      <img src="/qr-code.png" alt="Payment QR Code" className="w-48 h-48 object-cover rounded-lg" />
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in bg-white dark:bg-[#292524] p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-left max-w-[260px] mx-auto shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">K+</p>
                    <p className="text-xl font-black text-[#E63946] mb-2 tracking-wider">182-3-24795-6</p>
                    <p className="text-sm font-bold">JeedJad Restaurant Co., Ltd.</p>
                  </div>
                )}
                
                <p className="text-sm font-bold text-[#E63946] mt-4 mb-4">{lang === 'th' ? 'ยอดชำระ' : 'Amount'}: ฿{cartTotal}</p>
                
                <div className="bg-white dark:bg-[#292524] p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-left">
                  <label className="block text-sm font-bold mb-2">{lang === 'th' ? 'อัปโหลดสลิปโอนเงิน' : 'Upload Payment Slip'}</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const fileLabel = e.target.nextElementSibling.lastElementChild;
                        fileLabel.textContent = e.target.files[0] ? e.target.files[0].name : (lang === 'th' ? 'ไม่ได้เลือกไฟล์' : 'No file chosen');
                      }}
                    />
                    <div className="w-full text-sm text-gray-500 flex items-center pointer-events-none">
                      <span className="py-2 px-4 rounded-xl font-semibold bg-[#E63946]/10 text-[#E63946] mr-4 pointer-events-none">
                        {lang === 'th' ? 'เลือกไฟล์' : 'Choose File'}
                      </span>
                      <span className="pointer-events-none truncate pr-4">{lang === 'th' ? 'ไม่ได้เลือกไฟล์' : 'No file chosen'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {checkoutStep === 'done' && (
            <div className="h-full flex flex-col items-center py-8 text-center animate-fade-in space-y-6">
              <div className="w-20 h-20 bg-[#2A9D8F]/20 text-[#2A9D8F] rounded-full flex items-center justify-center text-4xl mx-auto shrink-0">✓</div>
              <div>
                <h2 className="text-2xl font-bold">{lang === 'th' ? 'ยืนยันออเดอร์แล้ว!' : 'Order Confirmed!'}</h2>
                <p className="opacity-70 text-sm">{lang === 'th' ? `กำลังเสิร์ฟอาหารที่โต๊ะ ${lastOrder?.table}` : `Table ${lastOrder?.table} is being served.`}</p>
              </div>

              {lastOrder && (
                <div className="w-full max-w-[300px] mx-auto bg-white rounded-none p-6 text-left shadow-[0_15px_35px_rgba(0,0,0,0.15)] relative animate-print-receipt origin-top mt-2 z-10">
                  {/* Zig-zag top */}
                  <div className="absolute top-0 left-0 w-full h-2 -translate-y-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDUsMCAxMCwxMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==')] bg-repeat-x bg-[length:10px_10px]"></div>
                  
                  {/* Zig-zag bottom */}
                  <div className="absolute bottom-0 left-0 w-full h-2 translate-y-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+')] bg-repeat-x bg-[length:10px_10px]"></div>
                  
                  <div className="text-center border-b-2 border-gray-300 border-dashed pb-4 mb-4 text-gray-800">
                    <h3 className="font-black text-2xl mb-1 tracking-widest uppercase">{lang === 'th' ? 'ใบเสร็จ' : 'RECEIPT'}</h3>
                    <p className="text-[10px] font-mono opacity-70 font-bold">JEEDJAD! SOMTAM</p>
                    <p className="text-[10px] font-mono opacity-70 mt-1">{new Date().toLocaleString()}</p>
                    <div className="inline-block mt-3 px-3 py-1 bg-gray-100 font-mono font-bold text-sm">TABLE {lastOrder?.table}</div>
                  </div>
                  
                  <div className="space-y-4 mb-6 text-sm font-mono text-gray-800">
                    {lastOrder.items.map(item => (
                      <div key={item.uid} className="flex justify-between items-start leading-snug">
                        <div className="pr-4 flex-1">
                          <span className="font-bold mr-2">{item.quantity}x</span> 
                          <span className="font-semibold">{lang === 'th' && item.name_th ? item.name_th : item.name}</span>
                          {item.options?.spiciness && (
                            <div className="text-[10px] opacity-70 ml-6 mt-1 flex items-center gap-1">
                              🌶️ {
                                 {
                                   'No Chili': lang === 'th' ? 'ไม่ใส่พริก' : 'No Chili',
                                   'Mild': lang === 'th' ? 'เผ็ดน้อย' : 'Mild',
                                   'Medium': lang === 'th' ? 'เผ็ดกลาง' : 'Medium',
                                   'Spicy': lang === 'th' ? 'เผ็ดมาก' : 'Spicy'
                                 }[item.options.spiciness] || item.options.spiciness
                               }
                            </div>
                          )}
                          {item.options?.addons?.map(a => (
                            <div key={a} className="text-[10px] opacity-70 ml-6 mt-0.5">
                              + {
                                 {
                                   'Khanom Jeen (Rice Noodles)': lang === 'th' ? 'ขนมจีน' : 'Khanom Jeen',
                                   'Salted Egg (ไข่เค็ม)': lang === 'th' ? 'ไข่เค็ม' : 'Salted Egg',
                                   'Pork Rind (แคบหมู)': lang === 'th' ? 'แคบหมู' : 'Pork Rind'
                                 }[a] || a
                               }
                            </div>
                          ))}
                        </div>
                        <span className="font-bold shrink-0">฿{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t-2 border-gray-300 border-dashed pt-4 flex justify-between font-black text-xl text-gray-900 font-mono">
                    <span>{lang === 'th' ? 'ยอดรวม' : 'TOTAL'}</span>
                    <span>฿{lastOrder?.total}</span>
                  </div>
                  
                  <div className="mt-8 text-center text-gray-400">
                    {/* Barcode Mock */}
                    <svg className="w-full h-10 opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <rect x="0" y="0" width="3" height="20" fill="currentColor"/>
                      <rect x="5" y="0" width="1" height="20" fill="currentColor"/>
                      <rect x="8" y="0" width="4" height="20" fill="currentColor"/>
                      <rect x="14" y="0" width="2" height="20" fill="currentColor"/>
                      <rect x="18" y="0" width="6" height="20" fill="currentColor"/>
                      <rect x="26" y="0" width="1" height="20" fill="currentColor"/>
                      <rect x="29" y="0" width="3" height="20" fill="currentColor"/>
                      <rect x="35" y="0" width="2" height="20" fill="currentColor"/>
                      <rect x="40" y="0" width="5" height="20" fill="currentColor"/>
                      <rect x="47" y="0" width="1" height="20" fill="currentColor"/>
                      <rect x="50" y="0" width="4" height="20" fill="currentColor"/>
                      <rect x="56" y="0" width="2" height="20" fill="currentColor"/>
                      <rect x="60" y="0" width="6" height="20" fill="currentColor"/>
                      <rect x="68" y="0" width="1" height="20" fill="currentColor"/>
                      <rect x="71" y="0" width="3" height="20" fill="currentColor"/>
                      <rect x="76" y="0" width="5" height="20" fill="currentColor"/>
                      <rect x="83" y="0" width="2" height="20" fill="currentColor"/>
                      <rect x="88" y="0" width="4" height="20" fill="currentColor"/>
                      <rect x="94" y="0" width="2" height="20" fill="currentColor"/>
                      <rect x="98" y="0" width="2" height="20" fill="currentColor"/>
                    </svg>
                    <p className="text-[10px] font-mono mt-2 tracking-[0.2em]">{lang === 'th' ? 'ขอบคุณที่ใช้บริการ' : 'THANK YOU'}</p>
                  </div>
                </div>
              )}

              <button 
                onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}
                className="mt-4 px-6 py-4 bg-[#E63946] text-white rounded-xl font-bold w-full"
              >
                {lang === 'th' ? 'เสร็จสิ้น' : 'Done'}
              </button>
            </div>
          )}
        </div>

        {cart.length > 0 && checkoutStep !== 'done' && (
          <div className="p-4 bg-white dark:bg-[#292524] border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>{t('total')}</span>
              <span>฿{cartTotal}</span>
            </div>
            {checkoutStep === 'cart' ? (
              <div className="space-y-3">
                <button onClick={handleCheckout} className="w-full py-4 bg-[#E63946] text-white rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all">
                  {t('proceedToPayment')}
                </button>
                
                {!isConfirmingClear ? (
                  <button onClick={() => setIsConfirmingClear(true)} className="w-full py-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex justify-center items-center gap-2">
                    <span>🗑️</span> {lang === 'th' ? 'ล้างตะกร้า' : 'Clear Cart'}
                  </button>
                ) : (
                  <div className="w-full p-3 bg-gray-50 dark:bg-[#1C1917] rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-3">
                    <span className="font-bold text-gray-500">{lang === 'th' ? 'คุณแน่ใจหรือไม่ว่าต้องการล้างตะกร้า?' : 'Are you sure you want to clear?'}</span>
                    <div className="flex gap-2 w-full">
                      <button onClick={() => setIsConfirmingClear(false)} className="flex-1 py-2.5 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">{lang === 'th' ? 'ยกเลิก' : 'Nevermind.'}</button>
                      <button onClick={() => { setCart([]); setIsConfirmingClear(false); }} className="flex-1 py-2.5 text-white bg-red-500 rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity">{lang === 'th' ? 'ยืนยัน' : 'Yes! Proceed'}</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setCheckoutStep('cart')} className="w-1/3 py-4 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
                  {t('goBack')}
                </button>
                <button onClick={handleConfirmOrder} disabled={!tempTable} className="w-2/3 py-4 bg-[#2A9D8F] text-white rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
                  {t('sendToKitchen')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
