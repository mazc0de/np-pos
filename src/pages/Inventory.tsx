import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { supabase } from '../lib/supabaseClient';
import { Search, Loader2, Plus, PenLine, X, Camera, Wand2 } from 'lucide-react';
import { BarcodeScanner } from '../components/BarcodeScanner';

export default function Inventory() {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [opnameProductId, setOpnameProductId] = useState<string | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  
  // State for Add Product Modal
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '', barcode: '', name: '', capital_price: 0, selling_price: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          ...newProduct,
          barcode: newProduct.barcode || null // null if empty string
        });

      if (error) throw error;
      
      alert('Produk berhasil ditambahkan!');
      window.location.reload();
      
    } catch (err: any) {
      alert(`Gagal menambah produk: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpnameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opnameProductId || adjustmentQuantity === 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('stock_mutations')
        .insert({
          product_id: opnameProductId,
          mutation_type: 'adjustment',
          quantity_change: adjustmentQuantity,
          reason: adjustmentReason || 'Stock Opname'
        });

      if (error) throw error;
      
      alert('Penyesuaian stok berhasil dicatat!');
      window.location.reload();
      
    } catch (err: any) {
      alert(`Gagal menyimpan opname: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setOpnameProductId(null);
      setAdjustmentQuantity(0);
      setAdjustmentReason('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manajemen Inventori</h2>
          <p className="text-sm text-slate-500">Master Data Produk & Stock Opname</p>
        </div>
        <button 
          onClick={() => setIsAddingProduct(true)}
          className="px-5 py-2.5 bg-brand-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10"
        >
          <Plus size={20} />
          Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau SKU..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-12 text-slate-400">
             <Loader2 className="animate-spin mb-4" size={32} />
             <p>Memuat data inventori...</p>
           </div>
        ) : error ? (
           <div className="py-12 text-center text-brand-600">
             <p>Error: {error}</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-4 text-xs font-bold uppercase text-slate-400">SKU</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase text-slate-400">Produk</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase text-slate-400 text-right">Harga Modal</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase text-slate-400 text-right">Harga Jual</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase text-slate-400 text-center">Stok</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase text-slate-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{product.sku}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      {product.barcode && <p className="text-xs text-slate-400 mt-0.5">Barcode: {product.barcode}</p>}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-slate-500">{formatPrice(product.capital_price)}</td>
                    <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">{formatPrice(product.selling_price)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        product.current_stock <= 0 
                          ? 'bg-brand-50 text-brand-700' 
                          : product.current_stock <= 10 
                          ? 'bg-orange-50 text-orange-600'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {product.current_stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => setOpnameProductId(product.id)}
                        className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center justify-end gap-1 ml-auto"
                      >
                        <PenLine size={14} />
                        Opname
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Tidak ada produk ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Opname Modal */}
      {opnameProductId && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Penyesuaian Stok (Opname)</h3>
            <p className="text-sm text-slate-500 mb-6">
              Masukkan selisih stok (contoh: -2 untuk barang rusak, +5 untuk barang masuk).
            </p>
            <form onSubmit={handleOpnameSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Jumlah Perubahan (+ / -)</label>
                <input 
                  type="number" 
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Alasan / Keterangan</label>
                <input 
                  type="text" 
                  placeholder="Misal: Barang rusak gudang"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setOpnameProductId(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || adjustmentQuantity === 0}
                  className="flex-1 py-3 bg-brand-900 text-white rounded-xl font-bold hover:bg-brand-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                  Simpan Mutasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Tambah Produk Baru</h3>
                <p className="text-sm text-slate-500">Masukkan detail produk ke sistem.</p>
              </div>
              <button onClick={() => { setIsAddingProduct(false); setIsScanning(false); }} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">SKU (Wajib)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const prefix = newProduct.name ? newProduct.name.substring(0, 3).toUpperCase() : 'SKU';
                      const randomId = Math.floor(1000 + Math.random() * 9000);
                      setNewProduct({...newProduct, sku: `${prefix}-${randomId}`});
                    }}
                    className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center shrink-0"
                    title="Generate SKU Otomatis"
                  >
                    <Wand2 size={18} />
                  </button>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Barcode (Opsional)</label>
                  <button 
                    type="button"
                    onClick={() => setIsScanning(!isScanning)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                  >
                    <Camera size={14} />
                    {isScanning ? 'Tutup Kamera' : 'Scan Barcode'}
                  </button>
                </div>
                <input 
                  type="text" 
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Nama Produk</label>
                <input 
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Harga Modal</label>
                  <input 
                    type="number" 
                    value={newProduct.capital_price || ''}
                    onChange={(e) => setNewProduct({...newProduct, capital_price: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Harga Jual</label>
                  <input 
                    type="number" 
                    value={newProduct.selling_price || ''}
                    onChange={(e) => setNewProduct({...newProduct, selling_price: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-brand-900 text-white rounded-xl font-bold hover:bg-brand-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                  Simpan Produk
                </button>
              </div>
            </form>
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
              onScanSuccess={(decodedText) => {
                setNewProduct({...newProduct, barcode: decodedText, sku: newProduct.sku || decodedText});
                setIsScanning(false);
              }} 
            />
          </div>
          <p className="text-white/60 mt-6 text-sm">Arahkan kamera ke barcode produk</p>
        </div>
      )}
    </div>
  );
}
