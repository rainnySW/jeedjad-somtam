import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home({ t, lang, setEditingItem }) {
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    // Fetch menu and just grab top 3 for recommendations
    fetch('/api/menu')
      .then(r => r.json())
      .then(data => {
        const somtam = data.filter(i => i.category === 'Somtam');
        setRecommendations(somtam.slice(0, 2));
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Head>
        <title>{t('restaurantName')} - {t('navHome')}</title>
      </Head>
      
      <main className="w-full h-full pb-32 animate-fade-in-up">
        
        {/* Hero Section */}
        <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E63946] to-orange-600 rounded-b-[3rem] md:rounded-b-[5rem] shadow-xl">
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          
          {/* Background decoration */}
          <div className="absolute -top-20 -right-20 text-[20rem] opacity-10 rotate-12 blur-sm pointer-events-none">🥗</div>
          <div className="absolute -bottom-10 -left-10 text-[15rem] opacity-10 -rotate-12 blur-sm pointer-events-none">🌶️</div>

          <div className="relative z-20 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
            <img src="/icon.png" alt="Logo" className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-2xl border-4 border-white mb-6 object-cover bg-white" />
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-sm border border-white/20">
              Welcome to
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 drop-shadow-md">
              {t('restaurantName')}
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-medium mb-10 max-w-xl mx-auto leading-relaxed">
              {lang === 'th' 
                ? 'แซ่บซี๊ดถึงใจ นัวถึงเครื่องอีสานแท้ๆ สัมผัสรสชาติส้มตำต้นตำรับที่พร้อมเสิร์ฟถึงโต๊ะคุณ!' 
                : 'Experience the authentic, bold, and spicy flavors of traditional Thai Somtam right at your table.'}
            </p>
            <Link 
              href="/menu" 
              className="bg-white text-[#E63946] px-8 py-4 rounded-full font-black text-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              {t('exploreMenu')} <span>→</span>
            </Link>
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mt-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#2D2A26] dark:text-[#F5F5F4]">
                {t('chefsPick') || "Chef's Recommendations"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {lang === 'th' ? 'เมนูซิกเนเจอร์ยอดฮิตรสแซ่บจัดจ้านของเรา' : 'Our most popular and spicy signature dishes.'}
              </p>
            </div>
            <Link href="/menu" className="hidden sm:block text-[#E63946] font-bold hover:underline">
              {lang === 'th' ? 'ดูทั้งหมด' : 'View All'}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {recommendations.map((item, index) => (
              <div 
                key={item._id} 
                onClick={() => setEditingItem(item)}
                className="bg-white dark:bg-[#292524] rounded-2xl md:rounded-[2rem] p-3 md:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-800/50 flex flex-col gap-3"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-full h-32 md:h-56 rounded-xl md:rounded-[1.5rem] overflow-hidden bg-[#FDFBF7] dark:bg-[#1C1917] shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl md:text-7xl group-hover:scale-110 transition-transform duration-500">🌶️</div>
                  )}
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/90 dark:bg-[#1C1917]/90 backdrop-blur-md px-2 md:px-4 py-1 rounded-full font-black text-[#E63946] shadow-sm text-xs md:text-base">
                    ฿{item.price}
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 pb-1">
                  <div className="hidden md:flex items-center gap-2 mb-2">
                    <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] text-[10px] font-black uppercase px-2 py-1 rounded-md">
                      {item.category === 'Larb / Nam Tok' ? (lang === 'th' ? 'ลาบ / น้ำตก' : 'Larb / Nam Tok') : 
                       item.category === 'Somtam' ? (lang === 'th' ? 'ส้มตำ' : 'Somtam') :
                       item.category === 'Meats' ? (lang === 'th' ? 'เมนูย่าง/ทอด' : 'Meats') :
                       item.category === 'Sides' ? (lang === 'th' ? 'เครื่องเคียง' : 'Sides') : item.category}
                    </span>
                    <span className="text-[#E63946] text-xs font-bold">{lang === 'th' ? '⭐ ยอดนิยม' : '⭐ Popular'}</span>
                  </div>
                  <h3 className="text-sm md:text-xl font-black mb-1 md:mb-2 leading-tight line-clamp-2 md:line-clamp-none">{lang === 'th' && item.name_th ? item.name_th : item.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
                    {lang === 'th' && item.description_th ? item.description_th : item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/menu" className="inline-block py-3 px-8 bg-gray-100 dark:bg-gray-800 rounded-full text-[#E63946] font-bold w-full">
              {lang === 'th' ? 'ดูเมนูทั้งหมด' : 'View Full Menu'}
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
