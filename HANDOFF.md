# Handoff: Aplikasi Kasir Web (pos-kasir)

## Context & Current State
Proyek ini adalah MVP Web-Based Point of Sale (POS) bernama "Aplikasi Kasir Web".
Kita baru saja menyelesaikan sesi pematangan spesifikasi (*grilling*) dan pembentukan model domain (*domain modeling*). Kebutuhan inti, peran pengguna, dan arsitektur data telah diuji dan disepakati.

Saat ini **belum ada kode aplikasi** (frontend maupun backend) yang ditulis. Status proyek saat ini adalah murni di tahap penyelesaian perencanaan dan dokumentasi domain. 

## Next Session Focus
Tujuan di sesi selanjutnya adalah memulai tahap *development* (pemrograman). Langkah-langkah awal yang disarankan:
1. Inisialisasi kerangka proyek frontend (React.js + Tailwind CSS) dan setup state management (Zustand).
2. Membangun skema database dan *Row Level Security* (RLS) di Supabase berdasarkan model domain yang telah dibuat (khususnya untuk tabel Produk, Mutasi Stok, Transaksi, dan Profil Kasir).

## Key Artifacts & References
Agen selanjutnya **WAJIB** membaca file-file berikut di *root* proyek (`/Users/mkp/Documents/Workspace/Private/pos-kasir`) sebelum menulis kode:
- `product_requirements_document.md`: Dokumen spesifikasi kebutuhan utama MVP.
- `DESIGN.md`: Panduan desain visual menggunakan Tailwind CSS.
- `CONTEXT.md`: Glosarium model domain (mendefinisikan Admin, Kasir, Perangkat, Produk, Mutasi Stok, Keranjang, Transaksi, dll).
- `docs/adr/0001-local-pin-authentication-for-cashiers.md`: Keputusan arsitektur autentikasi Kasir.
- `docs/adr/0002-local-cart-state-management.md`: Keputusan arsitektur keranjang kasir (lokal/Zustand).
- `docs/adr/0003-stock-ledger-for-inventory-mutations.md`: Keputusan arsitektur *Stock Ledger* untuk mencegah *race condition*.
- `docs/adr/0004-separate-sku-and-barcode.md`: Keputusan pemisahan kolom SKU dan Barcode.

## Suggested Skills
Agen selanjutnya disarankan untuk memuat atau menggunakan *skill* berikut jika relevan:
- `/domain-modeling`: Untuk terus menjaga konsistensi glosarium jika ada istilah baru yang muncul saat fase pembuatan kode.
- *Web development / React / Supabase skills* (jika tersedia di environment agen tersebut) untuk mempercepat scaffolding.
