# Stock Ledger for Inventory Mutations

Inventory levels are not simply updated in place via a single scalar column. Instead, every change to a product's stock (sales, manual adjustments, restocks) is recorded as an append-only entry in a `Stock Ledger` (Mutasi Stok) table. The `current_stock` on the product table acts as a cached projection of this ledger. This prevents race conditions during concurrent sales/adjustments and provides a vital audit trail for the "Stock Opname" feature required by the PRD.
