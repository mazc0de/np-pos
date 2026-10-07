-- Seed script to populate mock products and a default cashier

-- 1. Insert Default Cashier
INSERT INTO cashier_profiles (name, pin, is_active)
VALUES ('Budi (Kasir 1)', '1234', true)
ON CONFLICT DO NOTHING;

-- 2. Insert Products
INSERT INTO products (sku, barcode, name, capital_price, selling_price, current_stock)
VALUES 
('SKU001', '8991234567891', 'Kopi Arabica 200g', 35000, 50000, 45),
('SKU002', '8991234567892', 'Gula Aren Organik 500g', 15000, 22000, 12),
('SKU003', '8991234567893', 'Susu UHT Full Cream 1L', 18000, 21000, 30),
('SKU004', '8991234567894', 'Teh Celup Melati 25s', 4500, 6500, 100),
('SKU005', '8991234567895', 'Biskuit Coklat 300g', 12000, 15500, 25),
('SKU006', '8991234567896', 'Air Mineral 600ml', 2000, 3500, 120),
('SKU007', '8991234567897', 'Mie Instan Goreng', 2200, 3100, 200),
('SKU008', '8991234567898', 'Sabun Mandi Cair 400ml', 16000, 23000, 15)
ON CONFLICT (sku) DO NOTHING;
