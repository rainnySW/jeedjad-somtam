import Head from 'next/head';

export default function Account({ t, lang, setLang, isDark, setIsDark }) {
  return (
    <>
      <Head>
        <title>{t('restaurantName')} - {t('navAccount')}</title>
      </Head>
      
      <main className="p-4 md:p-8 max-w-xl mx-auto pb-32 animate-fade-in-up mt-4 md:mt-8">
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          {t('navAccount') || 'Settings'}
        </h1>

        <div className="bg-white dark:bg-[#292524] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6">{lang === 'th' ? 'ตั้งค่าแอปพลิเคชัน' : 'App Settings'}</h2>
          
          <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800">
            <span className="font-bold text-gray-700 dark:text-gray-300">{lang === 'th' ? 'โหมดกลางคืน' : 'Dark Mode'}</span>
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`w-14 h-8 rounded-full transition-colors relative ${isDark ? 'bg-[#2A9D8F]' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center text-xs`}>
                {isDark ? '🌙' : '☀️'}
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="font-bold text-gray-700 dark:text-gray-300">{lang === 'th' ? 'ภาษา' : 'Language'}</span>
            <div className="flex gap-2 bg-gray-100 dark:bg-[#1C1917] p-1 rounded-xl">
              <button 
                onClick={() => setLang('en')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${lang === 'en' ? 'bg-white dark:bg-[#292524] shadow-sm text-[#E63946]' : 'text-gray-500'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('th')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${lang === 'th' ? 'bg-white dark:bg-[#292524] shadow-sm text-[#E63946]' : 'text-gray-500'}`}
              >
                TH
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
