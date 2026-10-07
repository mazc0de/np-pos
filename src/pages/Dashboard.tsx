import { useState } from 'react';
import { PackageMinus, XCircle, PlusCircle, TrendingUp, Minus, Loader2, Trash2, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { supabase } from '../lib/supabaseClient';
import { PinVerifyModal } from '../components/PinModals';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, loading, refreshStats } = useDashboardStats();
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingTx, setViewingTx] = useState<any>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handleDeleteTransaction = async () => {
    if (!deletingTxId) return;
    setIsDeleting(true);

    try {
      // 1. Ambil detail item dari transaksi
      const { data: items } = await supabase
        .from('transaction_items')
        .select('product_id, quantity')
        .eq('transaction_id', deletingTxId);

      // 2. Kembalikan stok (Insert reverse stock mutations)
      if (items && items.length > 0) {
        const mutations = items.map(item => ({
          product_id: item.product_id,
          mutation_type: 'adjustment', // Return/Void
          quantity_change: item.quantity, // Positif karena dibatalkan
          reason: `Pembatalan Transaksi`,
          transaction_id: deletingTxId
        }));
        await supabase.from('stock_mutations').insert(mutations);
      }

      // 3. Hapus Transaksi (ini akan otomatis menghapus transaction_items via CASCADE)
      await supabase.from('transactions').delete().eq('id', deletingTxId);
      
      alert('Transaksi berhasil dihapus dan stok telah dikembalikan.');
      refreshStats();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus transaksi.');
    } finally {
      setIsDeleting(false);
      setDeletingTxId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Memuat ringkasan dasbor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {deletingTxId && (
        <PinVerifyModal 
          title="Hapus Transaksi?"
          onCancel={() => setDeletingTxId(null)}
          onSuccess={handleDeleteTransaction}
        />
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Operasional Toko</h2>
          <p className="text-sm text-slate-500">Ringkasan penjualan dan peringatan stok</p>
        </div>
        <button 
          onClick={() => navigate('/pos')}
          className="px-5 py-2.5 bg-brand-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10"
        >
          <PlusCircle size={20} />
          Transaksi Baru (POS)
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* KPI Cards */}
        <div className="col-span-12 md:col-span-4">
          <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] border border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Penjualan Hari Ini</p>
            <h3 className="text-2xl font-bold text-slate-900">{formatPrice(stats.todaySales)}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-emerald-600">
              <TrendingUp size={14} />
              <span className="text-[10px] font-bold">Hari ini</span>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-4">
          <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] border border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Transaksi</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.todayTransactions}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-slate-500">
              <Minus size={14} />
              <span className="text-[10px] font-bold">Hari ini</span>
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] border border-slate-50">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peringatan Stok</p>
              <span className="px-2 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold rounded-lg">Alerts</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <PackageMinus size={18} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Stok Menipis (≤ 10)</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{stats.lowStockCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <XCircle size={18} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Habis (Out of Stock)</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{stats.outOfStockCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="flex flex-col h-[500px]">
        <h3 className="text-xl font-bold text-slate-900 mb-4 px-1">Riwayat Transaksi (Hari Ini)</h3>
        
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col flex-1 overflow-hidden">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 whitespace-nowrap">No. Transaksi</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 whitespace-nowrap">Waktu</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right whitespace-nowrap">Total</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.recentTransactions?.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{tx.transaction_number}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(tx.created_at)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-right">{formatPrice(tx.total)}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setViewingTx(tx)}
                        className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold hover:bg-brand-100 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Eye size={14} /> Detail
                      </button>
                      <button 
                        onClick={() => setDeletingTxId(tx.id)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {(!stats.recentTransactions || stats.recentTransactions.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Belum ada transaksi hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {viewingTx && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Detail Transaksi</h3>
                <p className="text-sm text-slate-500">{viewingTx.transaction_number}</p>
              </div>
              <button onClick={() => setViewingTx(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="text-left py-2 font-semibold">Item</th>
                    <th className="text-center py-2 font-semibold">Harga</th>
                    <th className="text-center py-2 font-semibold">Qty</th>
                    <th className="text-right py-2 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewingTx.transaction_items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-3 text-slate-900 font-medium">{item.products?.name || 'Produk Dihapus'}</td>
                      <td className="py-3 text-center text-slate-700">{formatPrice(item.selling_price)}</td>
                      <td className="py-3 text-center text-slate-700">{item.quantity}</td>
                      <td className="py-3 text-right text-slate-900">{formatPrice(item.subtotal)}</td>
                    </tr>
                  ))}
                  {(!viewingTx.transaction_items || viewingTx.transaction_items.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500 italic">
                        Detail item tidak tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Waktu Transaksi</span>
                <span className="font-medium text-slate-900">{formatDate(viewingTx.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                <span className="text-slate-500">Total Belanja</span>
                <span className="font-bold text-slate-900">{formatPrice(viewingTx.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pembayaran ({viewingTx.payment_method || 'Tunai'})</span>
                <span className="font-bold text-slate-900">{formatPrice(viewingTx.payment_amount)}</span>
              </div>
              {viewingTx.payment_method === 'Tunai' && (
                <div className="flex justify-between text-sm pt-2 mt-2 border-t border-slate-200">
                  <span className="text-brand-700 font-bold">Kembalian</span>
                  <span className="font-bold text-brand-700">{formatPrice(viewingTx.change_amount)}</span>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
