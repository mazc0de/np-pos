import { useState } from 'react';
import { usePin } from '../hooks/usePin';
import { KeyRound, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Settings() {
  const { pin, setPin, verifyPin } = usePin();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (pin && !verifyPin(oldPin)) {
      setError('PIN lama salah!');
      return;
    }

    if (newPin.length < 4) {
      setError('PIN baru minimal 4 angka.');
      return;
    }

    if (newPin !== confirmPin) {
      setError('Konfirmasi PIN baru tidak cocok.');
      return;
    }

    setPin(newPin);
    setSuccess('PIN berhasil diperbarui!');
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Pengaturan</h2>
        <p className="text-sm text-slate-500">Kelola preferensi toko dan keamanan</p>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-50 p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center">
            <KeyRound size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Ubah PIN Master</h3>
            <p className="text-sm text-slate-500">PIN master digunakan untuk menghapus transaksi dan tindakan kritis lainnya.</p>
          </div>
        </div>

        <form onSubmit={handleChangePin} className="space-y-5 max-w-sm">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-50 text-emerald-600 text-sm font-semibold p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
              <CheckCircle size={16} /> {success}
            </div>
          )}

          {pin && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">PIN Lama</label>
              <div className="relative">
                <input 
                  type={showOldPin ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={oldPin}
                  onChange={(e) => {
                    setError('');
                    setSuccess('');
                    setOldPin(e.target.value.replace(/[^0-9]/g, ''));
                  }}
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 tracking-[0.2em] font-bold"
                  placeholder="••••"
                  maxLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPin(!showOldPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showOldPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}
          
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">PIN Baru</label>
            <div className="relative">
              <input 
                type={showNewPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                value={newPin}
                onChange={(e) => {
                  setError('');
                  setSuccess('');
                  setNewPin(e.target.value.replace(/[^0-9]/g, ''));
                }}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 tracking-[0.2em] font-bold"
                placeholder="••••"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPin(!showNewPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Konfirmasi PIN Baru</label>
            <div className="relative">
              <input 
                type={showConfirmPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                value={confirmPin}
                onChange={(e) => {
                  setError('');
                  setSuccess('');
                  setConfirmPin(e.target.value.replace(/[^0-9]/g, ''));
                }}
                className={`w-full pl-4 pr-12 py-3 bg-slate-50 border rounded-xl outline-none focus:border-brand-500 tracking-[0.2em] font-bold ${
                  confirmPin.length > 0 && confirmPin !== newPin 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200'
                }`}
                placeholder="••••"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPin.length > 0 && confirmPin !== newPin && (
              <p className="text-red-500 text-xs font-medium mt-1">PIN tidak sama</p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={!newPin || !confirmPin || (!!pin && !oldPin) || newPin !== confirmPin}
            className="w-full py-4 bg-brand-900 text-white rounded-xl font-bold hover:bg-brand-800 disabled:opacity-50 transition-all shadow-lg shadow-brand-900/20 mt-4"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
