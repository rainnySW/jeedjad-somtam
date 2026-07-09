import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Menu({ t, lang, setEditingItem, quickAddToCart }) {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(setMenu).catch(console.error);
  }, []);

  const categories = ['All', ...new Set(menu.map(i => i.category))];
  
  const categoryTranslations = {
    'All': { en: 'All', th: 'ทั้งหมด' },
    'Somtam': { en: 'Somtam', th: 'ส้มตำ' },
    'Meats': { en: 'Meats', th: 'เมนูย่าง/ทอด' },
    'Sides': { en: 'Sides', th: 'เครื่องเคียง' },
    'Larb / Nam Tok': { en: 'Larb / Nam Tok', th: 'ลาบ / น้ำตก' }
  };
  const getCategoryName = (cat) => categoryTranslations[cat] ? categoryTranslations[cat][lang] || cat : cat;
  
  const filteredMenu = menu.filter(i => {
    const matchCategory = category === 'All' || i.category === category;
    const matchSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (i.name_th && i.name_th.includes(searchQuery));
    return matchCategory && matchSearch;
  });

  return (
    <>
      <Head>
        <title>{t('restaurantName')} - {t('navMenu')}</title>
      </Head>
      <main className="p-4 md:p-8 max-w-6xl mx-auto pb-32 animate-fade-in-up">
        
        {/* Header */}
        <div className="mb-8 mt-4 md:mt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            {t('navMenu')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {lang === 'th' ? 'เลือกเมนูโปรดของคุณและเพิ่มลงในออเดอร์ได้เลย' : 'Select your favorites and add them to your order.'}
          </p>
        </div>

        {/* Search & Compact Categories */}
        <div className="mb-8 space-y-3">
          {/* Search Bar */}
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder={lang === 'th' ? "ค้นหาเมนู..." : "Search menu..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#292524] border border-gray-100 dark:border-gray-800 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[#E63946] shadow-sm text-sm"
            />
          </div>

          {/* Compact Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat 
                    ? 'bg-[#E63946] text-white shadow-sm' 
                    : 'bg-white dark:bg-[#292524] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
                }`}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredMenu.map(item => (
            <div 
              key={item._id} 
              onClick={() => setEditingItem(item)}
              className="bg-white dark:bg-[#292524] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col"
            >
              <div className="relative h-32 md:h-48 w-full overflow-hidden bg-gray-50 dark:bg-[#1C1917]">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl group-hover:scale-110 transition-transform duration-500">🥗</div>
                )}
                {/* Price Tag */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 dark:bg-[#292524]/90 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full font-bold text-[#E63946] shadow-sm text-xs md:text-sm">
                  ฿{item.price}
                </div>
              </div>
              <div className="p-3 md:p-5 flex flex-col flex-1">
                <div className="text-[9px] md:text-[10px] uppercase font-bold text-[#2A9D8F] mb-1">{getCategoryName(item.category)}</div>
                <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 leading-tight line-clamp-2 md:line-clamp-none">{lang === 'th' && item.name_th ? item.name_th : item.name}</h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 md:mb-4 flex-1">
                  {lang === 'th' && item.description_th ? item.description_th : item.description}
                </p>
                <button 
                  onClick={(e) => { e.stopPropagation(); quickAddToCart(item); }}
                  className="w-full py-2 md:py-3 bg-[#E63946]/5 dark:bg-[#E63946]/10 text-center rounded-lg md:rounded-xl font-bold text-xs md:text-sm text-[#E63946] hover:bg-[#E63946] hover:text-white transition-colors cursor-pointer"
                >
                  {t('addToOrder')}
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </>
  );
}
