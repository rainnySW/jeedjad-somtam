import '@/styles/globals.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NavBar from '@/components/NavBar'
import CartDrawer from '@/components/CartDrawer'
import OptionsModal from '@/components/OptionsModal'
import TransitionLayout from '@/components/TransitionLayout'

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const [lang, setLangState] = useState('th')
  const [isLangChanging, setIsLangChanging] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()

  const setLang = (newLang) => {
    if (newLang === lang) return;
    setIsLangChanging(true);
    setTimeout(() => {
      setLangState(newLang);
      setTimeout(() => setIsLangChanging(false), 50);
    }, 300);
  };

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  
  const translations = {
    en: {
      restaurantName: "JeedJad!",
      navHome: "Home", navMenu: "Menu", navCart: "Cart", navAccount: "Settings",
      exploreMenu: "Explore Menu", chefsPick: "Chef's Pick",
      addToOrder: "Add to Order", yourOrder: "Your Order", checkoutTitle: "Payment",
      emptyCart: "Your cart is empty.", total: "Total", proceedToPayment: "Checkout",
      tableNumber: "Table Number", tablePlaceholder: "e.g., 5", paidVia: "Paid via",
      sendToKitchen: "Send to Kitchen", goBack: "Back", proceed: "Proceed"
    },
    th: {
      restaurantName: "จี๊ดจ๊าด",
      navHome: "หน้าหลัก", navMenu: "เมนู", navCart: "ตะกร้า", navAccount: "ตั้งค่า",
      exploreMenu: "ดูเมนู", chefsPick: "ทีเด็ดร้านเรา",
      addToOrder: "ใส่ตะกร้า", yourOrder: "รายการอาหาร", checkoutTitle: "ชำระเงิน",
      emptyCart: "ยังไม่มีรายการอาหาร", total: "รวม", proceedToPayment: "สั่งอาหาร",
      tableNumber: "หมายเลขโต๊ะ", tablePlaceholder: "เช่น 5", paidVia: "ชำระผ่าน",
      sendToKitchen: "ส่งเข้าครัว", goBack: "กลับ", proceed: "ดำเนินการ"
    }
  }
  const t = (key) => translations[lang]?.[key] || key

  useEffect(() => {
    const savedLang = localStorage.getItem('lang')
    if (savedLang) setLangState(savedLang)
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') setIsDark(true)
    
    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const dummyGuest = { _id: 'local_guest', name: 'Somtam Lover', isRegistered: false, tableNumber: null, orderCount: 0, preferences: { LanguageSetting: 'th', ThemeSetting: 'light' } };
      setUser(dummyGuest);
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSaveItem = (itemData) => {
    if (itemData.uid) {
      setCart(prev => prev.map(i => i.uid === itemData.uid ? itemData : i));
    } else {
      setCart(prev => {
        if (prev.length === 0) setTimeout(() => setIsCartOpen(true), 50);
        return [...prev, { ...itemData, quantity: itemData.quantity || 1, uid: Date.now() }];
      });
    }
  }

  const handleQuickAdd = (item) => {
    setCart(prev => {
      if (prev.length === 0) setTimeout(() => setIsCartOpen(true), 50);
      return [...prev, { 
        ...item, 
        uid: Date.now(), 
        quantity: 1, 
        options: item.category === 'Somtam' ? { spiciness: 'Medium', addons: [] } : undefined 
      }];
    });
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className={`fixed inset-0 bg-[#FDFBF7] dark:bg-[#1C1917] z-[100] transition-opacity duration-300 pointer-events-none flex items-center justify-center ${isLangChanging ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917] text-[#2D2A26] dark:text-[#F5F5F4] font-sans transition-colors duration-300 pb-28 pt-20 md:pb-8 md:pt-28">
        
        <NavBar cartCount={cartCount} setIsCartOpen={setIsCartOpen} t={t} lang={lang} setLang={setLang} isDark={isDark} setIsDark={setIsDark} />

        <div className="w-full relative overflow-x-hidden">
          <TransitionLayout>
            <Component 
              key={router.pathname}
              {...pageProps} 
              cart={cart} setCart={setCart}
              user={user} setUser={setUser}
              lang={lang} setLang={setLang}
              isDark={isDark} setIsDark={setIsDark}
              isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}
              setEditingItem={setEditingItem}
              quickAddToCart={handleQuickAdd}
              t={t}
            />
          </TransitionLayout>
          
          {cartCount > 0 && !isCartOpen && (
            <div className="fixed bottom-28 md:bottom-8 right-6 md:right-8 z-30 animate-fade-in">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-[#E63946] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(230,57,70,0.5)] hover:scale-110 active:scale-95 transition-all"
              >
                <span className="text-2xl">🛒</span>
                <span className="absolute -top-1 -right-1 bg-[#2A9D8F] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>
              </button>
            </div>
          )}

          <CartDrawer 
            cart={cart} setCart={setCart} 
            isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}
            setEditingItem={setEditingItem}
            t={t} user={user} setUser={setUser} lang={lang}
          />
          
          <OptionsModal 
            item={editingItem} onClose={() => setEditingItem(null)} onSave={handleSaveItem} lang={lang} t={t}
          />
        </div>
      </div>
    </div>
  )
}
