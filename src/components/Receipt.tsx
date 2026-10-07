import React from 'react';
import { CartItem } from '../store/useCartStore';

interface ReceiptProps {
  transactionNumber: string;
  cashierName: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentAmount: number;
  changeAmount: number;
  paymentMethod?: string;
}

export const Receipt: React.FC<ReceiptProps> = ({
  transactionNumber,
  cashierName,
  items,
  subtotal,
  total,
  paymentAmount,
  changeAmount,
  paymentMethod = 'Tunai'
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="hidden print:block font-mono text-sm w-full max-w-[80mm] mx-auto p-4 text-black">
      <div className="text-center mb-6">
        <h1 className="font-bold text-xl">KASIR WEB</h1>
        <p className="text-xs">Jl. Contoh Alamat No. 123</p>
        <p className="text-xs">Telp: 08123456789</p>
      </div>

      <div className="mb-4 text-xs border-b border-black pb-2 border-dashed">
        <p>No: {transactionNumber}</p>
        <p>Tgl: {new Date().toLocaleString('id-ID')}</p>
        <p>Kasir: {cashierName}</p>
      </div>

      <div className="mb-4 border-b border-black pb-2 border-dashed">
        {items.map((item) => (
          <div key={item.id} className="mb-2">
            <p className="font-semibold">{item.name}</p>
            <div className="flex justify-between text-xs">
              <span>{item.quantity} x {formatPrice(item.selling_price)}</span>
              <span>{formatPrice(item.quantity * item.selling_price)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs border-b border-black pb-2 mb-4 border-dashed">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span>Pembayaran ({paymentMethod}):</span>
          <span>{formatPrice(paymentAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kembalian:</span>
          <span>{formatPrice(changeAmount)}</span>
        </div>
      </div>

      <div className="text-center text-xs mt-8">
        <p>Terima Kasih</p>
        <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
      </div>
    </div>
  );
};

