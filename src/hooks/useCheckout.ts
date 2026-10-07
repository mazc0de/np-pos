import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useCartStore } from '../store/useCartStore';

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, getSubtotal, clearCart } = useCartStore();

  const processCheckout = async (cashierId: string | null = null, paymentMethod: string = 'Cash', paymentAmount: number = 0) => {
    if (items.length === 0) return { success: false, error: 'Cart is empty' };
    
    setLoading(true);
    setError(null);

    const subtotal = getSubtotal();
    const total = subtotal; // Assume no tax for now
    const changeAmount = paymentAmount - total;
    
    // Generate a unique transaction number (e.g., TRX-YYYYMMDD-HHMMSS-RAND)
    const dateStr = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const randStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const transactionNumber = `TRX-${dateStr}-${randStr}`;

    try {
      // 1. Insert Transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          transaction_number: transactionNumber,
          cashier_id: cashierId,
          subtotal,
          total,
          payment_method: paymentMethod,
          payment_amount: paymentAmount,
          change_amount: changeAmount
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      const transactionId = transactionData.id;

      // 2. Insert Transaction Items
      const transactionItemsToInsert = items.map(item => ({
        transaction_id: transactionId,
        product_id: item.id,
        quantity: item.quantity,
        selling_price: item.selling_price,
        subtotal: item.selling_price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(transactionItemsToInsert);
        
      if (itemsError) throw itemsError;

      // 3. Insert Stock Mutations
      const stockMutationsToInsert = items.map(item => ({
        product_id: item.id,
        mutation_type: 'sale',
        quantity_change: -item.quantity, // Negative for sale
        reason: `Sold in transaction ${transactionNumber}`,
        transaction_id: transactionId,
        created_by: cashierId
      }));

      const { error: mutationError } = await supabase
        .from('stock_mutations')
        .insert(stockMutationsToInsert);

      if (mutationError) throw mutationError;

      // Clear cart on success
      clearCart();
      
      return { success: true, transactionId, transactionNumber };

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { processCheckout, loading, error };
}
