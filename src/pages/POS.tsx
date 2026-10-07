import React, { useState, useRef } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useProducts } from '../hooks/useProducts';
import { useCheckout } from '../hooks/useCheckout';
import { useAuth } from '../hooks/useAuth';
import { Search, ShoppingCart, Trash2, User, CreditCard, Loader2, X, ScanLine, CheckCircle } from 'lucide-react';
import { Receipt } from '../components/Receipt';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { usePhysicalScanner } from '../hooks/usePhysicalScanner';

export default function POS() {
  const { items, addItem, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const { products, loading: productsLoading, refreshProducts } = useProducts();
  const { processCheckout, loading: checkoutLoading } = useCheckout();
  const { session } = useAuth();
  
  const cashierName = session?.user?.email?.split('@')[0] || 'Kasir';
  
  const [search, setSearch] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const scanTimeoutRef = useRef<number | null>(null);
  
  // State for printing receipt & preview
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    const product = products.find(p => 
      p.sku.toLowerCase() === search.toLowerCase() || 
      (p.barcode && p.barcode === search) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    
    if (product) {
      addItem(product);
      setSearch('');
    } else {
      alert('Produk tidak ditemukan');
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    // Prevent multiple scans of the same item within a short timeframe
    if (scanTimeoutRef.current) return;
    
    const product = products.find(p => p.barcode === decodedText || p.sku === decodedText);
    if (product) {
      addItem(product);
      setScanMessage({ text: `${product.name} ditambahkan!`, type: 'success' });
    } else {
      setScanMessage({ text: `Barcode tidak ditemukan: ${decodedText}`, type: 'error' });
    }

    scanTimeoutRef.current = window.setTimeout(() => {
      setScanMessage(null);
      scanTimeoutRef.current = null;
    }, 2000);
  };

  usePhysicalScanner({ onScan: handleScanSuccess });

  const handleOpenPreview = () => {
    const amount = paymentMethod === 'Tunai' ? (Number(paymentAmount) || getSubtotal()) : getSubtotal();
    const currentSubtotal = getSubtotal();
    
    if (paymentMethod === 'Tunai' && amount < currentSubtotal) {
      alert('Nominal pembayaran kurang dari total belanja');
      return;
    }
    
    setIsPreviewOpen(true);
  };

  const confirmCheckout = async () => {
    const amount = paymentMethod === 'Tunai' ? (Number(paymentAmount) || getSubtotal()) : getSubtotal();
    const currentSubtotal = getSubtotal();
    
    // Simpan snapshot keranjang sebelum di-clear oleh checkout
    const cartSnapshot = [...items];
    
    const result = await processCheckout(null, paymentMethod, amount);
    if (result.success) {
      setLastTransaction({
        transactionNumber: result.transactionNumber,
        cashierName: cashierName,
        items: cartSnapshot,
        subtotal: currentSubtotal,
        total: currentSubtotal,
        paymentAmount: amount,
        changeAmount: amount - currentSubtotal,
        paymentMethod
      });
      
      setPaymentAmount('');
      setIsPreviewOpen(false);
      refreshProducts();
      
      // Tunggu DOM merender struk lalu print
      setTimeout(() => {
        window.print();
      }, 100);
      
    } else {
      alert(`Gagal: ${result.error}`);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-300 print:hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Point of Sale</h2>
            <p className="text-sm text-slate-500">Mode Kasir Cepat</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200">
            <User size={18} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 capitalize">Kasir: {cashierName}</span>
          </div>
        </div>

        <div className="flex flex-1 gap-6 min-h-0">
          {/* Left: Product Search & Grid */}
          <div className="flex-1 flex flex-col bg-white rounded-[24px] shadow-sm border border-slate-50 p-6">
            <div className="flex gap-3 mb-6">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari Nama/SKU... (Tekan Enter)"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 text-slate-900"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </form>
              <button
                type="button"
                onClick={() => setIsScanning(true)}
                className="px-6 py-4 bg-brand-50 text-brand-700 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-100 transition-colors shrink-0"
              >
                <ScanLine size={20} />
                Kamera
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {productsLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="animate-spin mb-4" size={32} />
                  <p>Memuat produk...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <p>Belum ada data produk di database</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {products.map(product => (
                    <div 
                      key={product.id} 
                      onClick={() => addItem(product)}
                      className="p-4 border border-slate-100 rounded-2xl hover:border-brand-300 hover:shadow-md cursor-pointer transition-all active:scale-95 bg-white flex flex-col justify-between h-32"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-1">{product.sku}</p>
                        <h4 className="font-semibold text-slate-900 line-clamp-2 leading-tight">{product.name}</h4>
                      </div>
                      <div className="mt-2 flex items-end justify-between">
                        <span className="font-bold text-brand-700">{formatPrice(product.selling_price)}</span>
                        <span className="text-xs text-slate-500">Stok: {product.current_stock}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Cart */}
          <div className="w-[400px] bg-white rounded-[24px] shadow-sm border border-slate-50 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-brand-900" />
                <h3 className="text-lg font-bold text-slate-900">Keranjang</h3>
              </div>
              {items.length > 0 && (
                <button onClick={clearCart} className="text-xs font-bold text-brand-600 hover:text-brand-800">
                  Kosongkan
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto -mx-2 px-2">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <ShoppingCart size={48} className="mb-4 opacity-20" />
                  <p>Belum ada item di keranjang</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-semibold text-slate-900 truncate text-sm">{item.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{formatPrice(item.selling_price)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 text-slate-600 hover:text-brand-600">-</button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 text-slate-600 hover:text-brand-600">+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1">
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(getSubtotal())}</span>
              </div>
              
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Nominal Pembayaran</label>
                <input 
                  type="number"
                  placeholder={`Mín: ${getSubtotal()}`}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-brand-700">{formatPrice(getSubtotal())}</span>
              </div>
              
              <button 
                onClick={handleOpenPreview}
                disabled={items.length === 0 || checkoutLoading}
                className="w-full py-4 bg-brand-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-900/20"
              >
                {checkoutLoading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                {checkoutLoading ? 'Memproses...' : 'Preview Pesanan'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 print:hidden">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Konfirmasi Pesanan</h3>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="max-h-[50vh] overflow-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="text-left py-2 font-semibold">Item</th>
                    <th className="text-center py-2 font-semibold">Qty</th>
                    <th className="text-right py-2 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="py-3 text-slate-900 font-medium">{item.name}</td>
                      <td className="py-3 text-center text-slate-700">{item.quantity}</td>
                      <td className="py-3 text-right text-slate-900">{formatPrice(item.selling_price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 mb-2 block">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {['Tunai', 'QRIS', 'Transfer Bank'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-2 text-sm rounded-xl font-semibold transition-all border ${
                      paymentMethod === method 
                        ? 'bg-brand-50 border-brand-200 text-brand-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Belanja</span>
                <span className="font-bold text-slate-900">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pembayaran ({paymentMethod})</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(paymentMethod === 'Tunai' ? (Number(paymentAmount) || getSubtotal()) : getSubtotal())}
                </span>
              </div>
              {paymentMethod === 'Tunai' && (
                <div className="flex justify-between text-sm pt-2 mt-2 border-t border-slate-200">
                  <span className="text-brand-700 font-bold">Kembalian</span>
                  <span className="font-bold text-brand-700">{formatPrice((Number(paymentAmount) || getSubtotal()) - getSubtotal())}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmCheckout}
                disabled={checkoutLoading}
                className="flex-1 py-4 bg-brand-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-800 disabled:opacity-50 shadow-lg shadow-brand-900/20 transition-all"
              >
                {checkoutLoading && <Loader2 className="animate-spin" size={20} />}
                Cetak Struk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      {isScanning && (
        <div className="fixed inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
          <div className="w-full max-w-lg flex justify-end mb-4">
            <button 
              onClick={() => setIsScanning(false)}
              className="text-white hover:text-slate-300 bg-white/10 p-2 rounded-full backdrop-blur-sm transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="w-full max-w-lg bg-black rounded-3xl overflow-hidden shadow-2xl relative">
            <BarcodeScanner 
              onScanSuccess={handleScanSuccess} 
            />
            
            {scanMessage && (
              <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg animate-in slide-in-from-bottom-5 duration-300 ${
                scanMessage.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {scanMessage.type === 'success' && <CheckCircle size={18} />}
                {scanMessage.text}
              </div>
            )}
          </div>
          <p className="text-white/60 mt-6 text-sm">Arahkan kamera ke barcode produk</p>
        </div>
      )}

      {/* Receipt for Printing */}
      {lastTransaction && (
        <Receipt {...lastTransaction} />
      )}
    </>
  );
}
