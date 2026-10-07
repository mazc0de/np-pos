-- 1. Tabel Cashier Profiles (Kasir)
CREATE TABLE cashier_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    pin TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Products (Produk)
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    name TEXT NOT NULL,
    capital_price INTEGER NOT NULL,
    selling_price INTEGER NOT NULL,
    current_stock INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Transactions (Transaksi Kasir)
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_number TEXT UNIQUE NOT NULL,
    cashier_id UUID REFERENCES cashier_profiles(id) ON DELETE SET NULL,
    subtotal INTEGER NOT NULL,
    total INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    payment_amount INTEGER NOT NULL,
    change_amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Transaction Items (Detail Barang per Transaksi)
CREATE TABLE transaction_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL,
    selling_price INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Stock Mutations (Riwayat Keluar Masuk Stok)
CREATE TABLE stock_mutations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    mutation_type TEXT NOT NULL, -- e.g., 'sale', 'adjustment'
    quantity_change INTEGER NOT NULL, -- Positif untuk masuk, Negatif untuk keluar
    reason TEXT,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    created_by UUID REFERENCES cashier_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Trigger untuk Otomatis Update Stok di Tabel Products
-- Setiap ada data baru di stock_mutations, fungsi ini akan otomatis menambahkan/mengurangi current_stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET current_stock = current_stock + NEW.quantity_change
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_stock_trigger
AFTER INSERT ON stock_mutations
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();
