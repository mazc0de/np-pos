import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Search, Trash2, Eye, X, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import { PinVerifyModal } from '../components/PinModals';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination
  const [page, setPage] = useState(1);
  const limit = 15;

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  
  // Actions
  const [viewingTx, setViewingTx] = useState<any>(null);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('transactions')
        .select('*, transaction_items(*, products(name))', { count: 'exact' });

      if (search) {
        query = query.ilike('transaction_number', `%${search}%`);
      }
      if (paymentMethod) {
        query = query.eq('payment_method', paymentMethod);
      }
      
      query = query.order('created_at', { ascending: sortOrder === 'asc' });
      
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setTransactions(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, paymentMethod, sortOrder]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

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
      const { data: items } = await supabase
        .from('transaction_items')
        .select('product_id, quantity')
        .eq('transaction_id', deletingTxId);

      if (items && items.length > 0) {
        const mutations = items.map((item: any) => ({
          product_id: item.product_id,
          mutation_type: 'adjustment',
          quantity_change: item.quantity,
          reason: `Pembatalan Transaksi`,
          transaction_id: deletingTxId
        }));
        await supabase.from('stock_mutations').insert(mutations);
      }

      await supabase.from('transactions').delete().eq('id', deletingTxId);
      
      alert('Transaksi berhasil dihapus dan stok telah dikembalikan.');
      if (transactions.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus transaksi.');
    } finally {
      setIsDeleting(false);
      setDeletingTxId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {deletingTxId && (
        <PinVerifyModal 
          title="Hapus Transaksi?"
          onCancel={() => setDeletingTxId(null)}
          onSuccess={handleDeleteTransaction}
        />
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Transaksi</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola dan pantau seluruh transaksi toko Anda.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[20px] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari No. Transaksi..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPage(1);
              }}
              className="appearance-none pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-slate-700 w-full md:w-auto"
            >
              <option value="">Semua Pembayaran</option>
              <option value="Tunai">Tunai</option>
              <option value="QRIS">QRIS</option>
              <option value="Transfer Bank">Transfer Bank</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'asc' | 'desc');
              setPage(1);
            }}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-slate-700 w-full md:w-auto"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-50 flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Memuat data transaksi...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 whitespace-nowrap">No. Transaksi</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 whitespace-nowrap">Waktu</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 whitespace-nowrap">Metode</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right whitespace-nowrap">Total</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">{tx.transaction_number}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{formatDate(tx.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium">
                          {tx.payment_method || 'Tunai'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-right whitespace-nowrap">{formatPrice(tx.total)}</td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2 whitespace-nowrap">
                        <button 
                          onClick={() => setViewingTx(tx)}
                          className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold hover:bg-brand-100 flex items-center gap-1.5 transition-colors"
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
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        Tidak ada transaksi ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalCount > 0 && (
              <div className="mt-auto p-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Menampilkan {((page - 1) * limit) + 1} - {Math.min(page * limit, totalCount)} dari {totalCount}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-slate-700 flex items-center">
                    Hal {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Transaction Details Modal */}
      {viewingTx && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Detail Transaksi</h3>
                <p className="text-sm text-slate-500 mt-1">{viewingTx.transaction_number}</p>
              </div>
              <button onClick={() => setViewingTx(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-colors">
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
                      <td className="py-3 text-right text-slate-900 font-semibold">{formatPrice(item.subtotal)}</td>
                    </tr>
                  ))}
                  {(!viewingTx.transaction_items || viewingTx.transaction_items.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                        Detail item tidak tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Waktu Transaksi</span>
                <span className="font-medium text-slate-900">{formatDate(viewingTx.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-slate-200">
                <span className="text-slate-500">Total Belanja</span>
                <span className="font-bold text-slate-900 text-base">{formatPrice(viewingTx.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pembayaran ({viewingTx.payment_method || 'Tunai'})</span>
                <span className="font-bold text-slate-900">{formatPrice(viewingTx.payment_amount)}</span>
              </div>
              {viewingTx.payment_method === 'Tunai' && (
                <div className="flex justify-between text-sm pt-3 mt-1 border-t border-slate-200">
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
