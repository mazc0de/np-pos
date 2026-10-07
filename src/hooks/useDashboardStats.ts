import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentTransactions: any[];
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayTransactions: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Fetch today's transactions with items
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select(`
          id, transaction_number, total, created_at, payment_method, payment_amount, change_amount,
          transaction_items (
            id, quantity, selling_price, subtotal,
            products (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (!txError && txData) {
        // filter today's tx for KPI
        const todayTx = txData.filter(tx => new Date(tx.created_at) >= today);
        const todaySales = todayTx.reduce((sum, tx) => sum + Number(tx.total), 0);
        const todayTransactions = todayTx.length;
        
        // 2. Fetch low stock and out of stock counts
        const { data: productsData, error: pError } = await supabase
          .from('products')
          .select('current_stock');

        if (!pError && productsData) {
          let lowStockCount = 0;
          let outOfStockCount = 0;
          
          productsData.forEach(p => {
            if (p.current_stock <= 0) {
              outOfStockCount++;
            } else if (p.current_stock <= 10) {
              lowStockCount++;
            }
          });

          setStats({
            todaySales,
            todayTransactions,
            lowStockCount,
            outOfStockCount,
            recentTransactions: todayTx,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refreshStats: fetchStats };
}
