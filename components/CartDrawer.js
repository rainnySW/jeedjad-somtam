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
                        <p className="text-xs opacity-70">Qty: {item.quantity}</p>
                        {item.options?.spiciness && (
                          <p className="text-[10px] text-[#E63946] font-bold mt-1">
                            🌶️ {item.options.spiciness}
                            {item.options.addons?.length > 0 && ` + ${item.options.addons.join(', ')}`}
                          </p>
                        )}
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => setEditingItem(item)} className="text-xs text-[#2A9D8F] font-bold">Edit</button>
                          <button onClick={() => removeItem(item.uid)} className="text-xs text-red-400 font-bold">Remove</button>
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
                    QR Code
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('transfer')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'transfer' ? 'bg-white dark:bg-[#292524] shadow-sm text-[#E63946]' : 'text-gray-500'}`}
                  >
                    Bank Transfer
                  </button>
                </div>

                {paymentMethod === 'qr' ? (
                  <div className="animate-fade-in">
                    <div className="bg-white p-4 rounded-xl inline-block shadow-sm">
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center border-4 border-dashed border-gray-300">
                        <span className="text-gray-400 font-bold">QR CODE</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in bg-white dark:bg-[#292524] p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-left max-w-[260px] mx-auto shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Kasikorn Bank (KBank)</p>
                    <p className="text-xl font-black text-[#E63946] mb-2 tracking-wider">012-3-45678-9</p>
                    <p className="text-sm font-bold">JeedJad Restaurant Co., Ltd.</p>
                  </div>
                )}
                
                <p className="text-sm font-bold text-[#E63946] mt-4 mb-4">Amount: ฿{cartTotal}</p>
                
                <div className="bg-white dark:bg-[#292524] p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-left">
                  <label className="block text-sm font-bold mb-2">Upload Payment Slip</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#E63946]/10 file:text-[#E63946] hover:file:bg-[#E63946]/20 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {checkoutStep === 'done' && (
            <div className="h-full flex flex-col items-center py-8 text-center animate-fade-in space-y-6">
              <div className="w-20 h-20 bg-[#2A9D8F]/20 text-[#2A9D8F] rounded-full flex items-center justify-center text-4xl mx-auto shrink-0">✓</div>
              <div>
                <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                <p className="opacity-70 text-sm">Table {lastOrder?.table} is being served.</p>
              </div>

              {lastOrder && (
                <div className="w-full bg-white dark:bg-[#292524] rounded-2xl p-6 text-left shadow-sm border border-gray-100 dark:border-gray-800 border-dashed relative">
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#FDFBF7] dark:bg-[#1C1917] rounded-full"></div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#FDFBF7] dark:bg-[#1C1917] rounded-full"></div>
                  
                  <h3 className="font-bold text-center border-b border-gray-100 dark:border-gray-700 border-dashed pb-4 mb-4">E-Receipt</h3>
                  
                  <div className="space-y-3 mb-4 text-sm">
                    {lastOrder.items.map(item => (
                      <div key={item.uid} className="flex justify-between items-start">
                        <div>
                          <span className="font-bold">{item.quantity}x</span> {lang === 'th' && item.name_th ? item.name_th : item.name}
                        </div>
                        <span className="font-bold">฿{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 border-dashed pt-4 flex justify-between font-bold text-lg">
                    <span>Total Paid</span>
                    <span className="text-[#2A9D8F]">฿{lastOrder.total}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}
                className="mt-4 px-6 py-4 bg-[#E63946] text-white rounded-xl font-bold w-full"
              >
                Done
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
                    <span>🗑️</span> Clear Cart
                  </button>
                ) : (
                  <div className="w-full p-3 bg-gray-50 dark:bg-[#1C1917] rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-3">
                    <span className="font-bold text-gray-500">Are you sure you want to clear?</span>
                    <div className="flex gap-2 w-full">
                      <button onClick={() => setIsConfirmingClear(false)} className="flex-1 py-2.5 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Nevermind.</button>
                      <button onClick={() => { setCart([]); setIsConfirmingClear(false); }} className="flex-1 py-2.5 text-white bg-red-500 rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity">Yes! Proceed</button>
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
