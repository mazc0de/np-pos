import React, { useState } from 'react';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { usePin } from '../hooks/usePin';

export function PinSetupModal() {
  const { setPin } = usePin();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setError('PIN minimal 4 angka');
      return;
    }
    if (newPin !== confirmPin) {
      setError('PIN tidak cocok');
      return;
    }
    setPin(newPin);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} />
        </div>
        <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">Buat PIN Master</h3>
        <p className="text-center text-slate-500 mb-8 text-sm">
          PIN ini digunakan sebagai pengaman untuk mengedit atau menghapus transaksi.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Masukkan PIN Baru</label>
            <div className="relative">
              <input 
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                value={newPin}
                onChange={(e) => {
                  setError('');
                  setNewPin(e.target.value.replace(/[^0-9]/g, ''));
                }}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 text-center tracking-[0.5em] text-lg font-bold"
                placeholder="••••"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Konfirmasi PIN</label>
            <div className="relative">
              <input 
                type={showConfirmPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                value={confirmPin}
                onChange={(e) => {
                  setError('');
                  setConfirmPin(e.target.value.replace(/[^0-9]/g, ''));
                }}
                className={`w-full pl-4 pr-12 py-3 bg-slate-50 border rounded-xl outline-none focus:border-brand-500 text-center tracking-[0.5em] text-lg font-bold ${
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
              <p className="text-red-500 text-xs font-medium mt-1 text-center">PIN tidak sama</p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={!newPin || !confirmPin || newPin !== confirmPin}
            className="w-full py-4 bg-brand-900 text-white rounded-xl font-bold hover:bg-brand-800 disabled:opacity-50 transition-all shadow-lg shadow-brand-900/20 mt-4"
          >
            Simpan PIN
          </button>
        </form>
      </div>
    </div>
  );
}

interface PinVerifyModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
}

export function PinVerifyModal({ onSuccess, onCancel, title = "Masukkan PIN" }: PinVerifyModalProps) {
  const { verifyPin } = usePin();
  const [inputPin, setInputPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(inputPin)) {
      onSuccess();
    } else {
      setError('PIN salah!');
      setInputPin('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">{title}</h3>
        <p className="text-center text-slate-500 text-sm mb-6">Otorisasi dibutuhkan untuk tindakan ini.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div className="relative">
            <input 
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputPin}
              onChange={(e) => {
                setError('');
                setInputPin(e.target.value.replace(/[^0-9]/g, ''));
              }}
              className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 text-center tracking-[0.5em] text-2xl font-bold"
              placeholder="••••"
              maxLength={6}
              autoFocus
              required
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPin ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={!inputPin}
              className="flex-1 py-3 bg-brand-900 text-white rounded-xl font-bold hover:bg-brand-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Lanjut
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

