# Separation of SKU and Barcode

We are separating product identification into two distinct fields: `sku` (mandatory) and `barcode` (optional). This caters to the reality of certain businesses (e.g., spare part shops) where many items are sold individually and do not have physical barcodes from the manufacturer. The `sku` serves as the internal human-readable identifier (auto-generated if omitted), while the `barcode` acts strictly as an optional accelerator for hardware scanners at the checkout.
