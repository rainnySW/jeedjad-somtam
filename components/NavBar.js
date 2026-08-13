import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavBar({ cartCount, setIsCartOpen, t, lang, setLang, isDark, setIsDark }) {
  const router = useRouter();
  
  return (
    <>
      {/* PC: Floating Pill Island Navigation */}
      <div className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-16 bg-white/70 dark:bg-[#292524]/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-none z-40 px-6 items-center justify-between rounded-full border border-white/50 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 border-white/20">
            <img src="/icon.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-xl text-[#2D2A26] dark:text-[#F5F5F4] tracking-tight">{t('restaurantName')}</span>
        </div>
        
        <div className="flex items-center gap-2 h-full">
          <Link href="/" className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${router.pathname === '/' ? 'text-white bg-[#E63946] shadow-[0_4px_15px_rgba(230,57,70,0.3)]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'}`}>
            {t('navHome')}
          </Link>
          <Link href="/menu" className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${router.pathname === '/menu' ? 'text-white bg-[#E63946] shadow-[0_4px_15px_rgba(230,57,70,0.3)]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'}`}>
            {t('navMenu')}
          </Link>
          <Link href="/account" className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${router.pathname === '/account' ? 'text-white bg-[#E63946] shadow-[0_4px_15px_rgba(230,57,70,0.3)]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'}`}>
            {t('navAccount') || 'Profile'}
          </Link>
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
          <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm hover:scale-110 transition-transform">
            {isDark ? '🌙' : '☀️'}
          </button>
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')} className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-xs bg-[#2A9D8F]/10 text-[#2A9D8F] shadow-sm hover:scale-110 transition-transform">
            {lang === 'th' ? 'EN' : 'TH'}
          </button>
        </div>
      </div>

      {/* Mobile: Floating Bottom Dock */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[400px] h-16 bg-white/80 dark:bg-[#292524]/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-none z-40 px-6 flex justify-between items-center rounded-full border border-white/50 dark:border-white/5">
        <Link href="/" className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${router.pathname === '/' ? 'bg-[#E63946] text-white shadow-md -translate-y-2' : 'text-gray-500'}`}>
          <span className="text-xl">🏠</span>
        </Link>
        <Link href="/menu" className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${router.pathname === '/menu' ? 'bg-[#E63946] text-white shadow-md -translate-y-2' : 'text-gray-500'}`}>
          <span className="text-xl">📖</span>
        </Link>
        <Link href="/account" className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${router.pathname === '/account' ? 'bg-[#E63946] text-white shadow-md -translate-y-2' : 'text-gray-500'}`}>
          <span className="text-xl">👤</span>
        </Link>
      </div>

      {/* Mobile: Floating Top Brand Badge */}
      <div className="md:hidden fixed top-4 left-4 z-40">
         <div className="bg-white/80 dark:bg-[#292524]/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50 dark:border-white/5 flex items-center gap-2">
          <img src="/icon.png" alt="Logo" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
          <span className="font-extrabold text-sm text-[#2D2A26] dark:text-[#F5F5F4]">{t('restaurantName')}</span>
        </div>
      </div>
    </>
  );
}
