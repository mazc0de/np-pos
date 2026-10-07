import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi, atau langsung masuk jika auto-confirm aktif.');
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan. Periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F9F9FB]">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 to-brand-700 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-brand-400/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 space-y-8 max-w-lg mt-auto mb-auto">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Mengelola <span className="text-brand-300">stok</span> dan kasir menjadi lebih <span className="text-brand-300">mudah</span>.
          </h1>
          <p className="text-brand-50/80 text-xl font-light">
            Platform terpadu untuk pencatatan transaksi cepat dan sinkronisasi inventori.
          </p>
        </div>

        <div className="relative z-10 text-brand-100/50 text-sm flex items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Aplikasi Kasir Web</span>
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <header className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isRegistering ? 'Buat Akun Baru' : 'Selamat Datang'}
            </h2>
            <p className="text-slate-500 mt-2">
              {isRegistering 
                ? 'Daftarkan toko Anda sebagai Admin.' 
                : 'Otentikasi perangkat untuk mulai shift kasir.'}
            </p>
          </header>

          <form onSubmit={handleAuth} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-600 text-sm font-semibold p-3 rounded-xl border border-emerald-100">
                {successMsg}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email Anda</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-slate-400" size={18} />
                </span>
                <input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@toko.com" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 text-slate-900 placeholder:text-slate-400" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-slate-400" size={18} />
                </span>
                <input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 text-slate-900 placeholder:text-slate-400" 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-brand-900 text-white rounded-2xl font-bold shadow-lg shadow-brand-900/20 hover:bg-brand-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>
                {loading 
                  ? 'Memproses...' 
                  : isRegistering ? 'Daftar Sekarang' : 'Masuk ke Sistem'}
              </span>
              {!loading && !isRegistering && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />}
              {!loading && isRegistering && <UserPlus className="group-hover:scale-110 transition-transform" size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun admin?'}
              <button 
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="ml-2 font-bold text-brand-600 hover:text-brand-800 hover:underline transition-all focus:outline-none"
              >
                {isRegistering ? 'Masuk di sini' : 'Daftar sekarang'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
