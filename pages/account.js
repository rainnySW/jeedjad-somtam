import Head from 'next/head';
import { useState } from 'react';

export default function Account({ t, lang, setLang, isDark, setIsDark, user, setUser }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isLoginMode ? 'login' : 'register', name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
      } else {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch(err) {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser({ _id: 'local_guest', name: 'Somtam Lover', isRegistered: false, orderCount: 0 });
    localStorage.removeItem('user');
  };

  return (
    <>
      <Head>
        <title>{t('restaurantName')} - Account</title>
      </Head>
      
      <main className="p-4 md:p-8 max-w-xl mx-auto pb-32 animate-fade-in-up mt-4 md:mt-8">
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          {t('navAccount') || 'Profile'}
        </h1>

        {/* Auth or Profile */}
        {user && user._id !== 'local_guest' ? (
          <div className="bg-white dark:bg-[#292524] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#E63946] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-[#1C1917] rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="font-bold text-gray-600 dark:text-gray-300">{lang === 'th' ? 'จำนวนออเดอร์ทั้งหมด' : 'Total Orders'}</span>
                <span className="font-black text-[#2A9D8F]">{user.orderCount || 0}</span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
            >
              {lang === 'th' ? 'ออกจากระบบ' : 'Log Out'}
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#292524] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <button 
                onClick={() => { setIsLoginMode(true); setError(''); }}
                className={`font-bold text-lg ${isLoginMode ? 'text-[#E63946]' : 'text-gray-400'}`}
              >
                {lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
              </button>
              <button 
                onClick={() => { setIsLoginMode(false); setError(''); }}
                className={`font-bold text-lg ${!isLoginMode ? 'text-[#E63946]' : 'text-gray-400'}`}
              >
                {lang === 'th' ? 'สมัครสมาชิก' : 'Register'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-bold rounded-lg">{error}</div>}
              
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-bold mb-2">{lang === 'th' ? 'ชื่อ' : 'Name'}</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} required={!isLoginMode} placeholder={lang === 'th' ? 'ชื่อของคุณ' : 'Your Name'} className="w-full p-3 bg-gray-50 dark:bg-[#1C1917] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E63946]" />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold mb-2">{lang === 'th' ? 'อีเมล' : 'Email'}</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" className="w-full p-3 bg-gray-50 dark:bg-[#1C1917] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E63946]" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">{lang === 'th' ? 'รหัสผ่าน' : 'Password'}</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" className="w-full p-3 bg-gray-50 dark:bg-[#1C1917] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E63946]" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-[#E63946] text-white rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all mt-4 shadow-sm disabled:opacity-50">
                {loading ? 'Processing...' : (isLoginMode ? (lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign In') : (lang === 'th' ? 'สมัครสมาชิก' : 'Create Account'))}
              </button>
            </form>
          </div>
        )}

        {/* Mobile-only Settings Section */}
        <div className="md:hidden bg-white dark:bg-[#292524] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6">App Settings</h2>
          
          <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800">
            <span className="font-bold text-gray-700 dark:text-gray-300">Dark Mode</span>
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
            <span className="font-bold text-gray-700 dark:text-gray-300">Language</span>
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
