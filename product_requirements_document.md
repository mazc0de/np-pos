# Product Requirements Document (PRD)
**Project Name:** Aplikasi Kasir Web (Web-Based POS)
**Platform:** Web Application (Responsive)
**Tech Stack:** React.js, Tailwind CSS (referensi: DESIGN.md), Supabase

## 1. Ringkasan Proyek
Tujuan proyek ini adalah membangun Minimum Viable Product (MVP) aplikasi Point of Sale (POS) berbasis web yang responsif, cepat, dan mudah digunakan. Aplikasi ini difokuskan pada kecepatan transaksi di meja kasir menggunakan integrasi pemindai barcode, pencetakan struk termal, serta manajemen stok dasar (Stock Opname).

## 2. Target Pengguna & Hak Akses (Role-Based Access)
Sistem akan menggunakan Supabase Auth untuk mengelola dua peran utama:
1.  **Admin / Pemilik Toko:** Memiliki akses penuh ke seluruh modul, termasuk manajemen pengguna, master data produk, stock opname, dan laporan penjualan.
2.  **Kasir:** Memiliki akses terbatas hanya pada modul Transaksi Kasir, pencetakan struk, dan riwayat transaksi shift berjalan.

## 3. Spesifikasi Fitur Utama

### 3.1. Modul Autentikasi (Auth)
*   **Login Admin:** Menggunakan standar kredensial Email dan Password.
*   **Login Kasir:** Dioptimalkan dengan sistem PIN (4-6 digit) untuk mempercepat pergantian *shift* pengguna.
*   **Manajemen Sesi:** Otomatis *logout* atau mengunci layar jika tidak ada aktivitas dalam waktu tertentu (opsional).

### 3.2. Modul Kasir (Point of Sale)
*   **Integrasi Barcode Scanner:** Input pencarian dioptimalkan (*auto-focus* atau *global event listener*) untuk menerima input dari scanner barcode fisik secara langsung tanpa perlu klik mouse.
*   **Manajemen Keranjang (Cart):**
    *   Pencarian manual berdasarkan nama SKU/produk jika barcode gagal dipindai.
    *   Penambahan item ke keranjang belanja.
    *   Ubah jumlah (*quantity*) atau hapus item dari keranjang.
    *   Pembatalan seluruh transaksi (Clear Cart).
*   **Kalkulasi Pembayaran:**
    *   Menghitung Subtotal, Total Akhir, dan Uang Kembalian (*Change*) secara otomatis berdasarkan nominal yang dibayarkan pelanggan.

### 3.3. Modul Pencetakan Struk (Receipt)
*   **Fungsi Cetak:** Menggunakan Web Print API (`window.print()`) yang dioptimalkan untuk ukuran kertas printer thermal (58mm atau 80mm).
*   **Elemen Struk:** Menampilkan Nama Toko, Tanggal/Waktu, Nomor Transaksi, Daftar Item (Nama, Qty, Harga), Subtotal, Total, Metode Pembayaran, Kembalian, dan Nama Kasir yang bertugas.

### 3.4. Modul Inventori & Stock Opname
*   **Master Data Produk:** CRUD (Create, Read, Update, Delete) untuk item barang. Field meliputi: Barcode/SKU, Nama Produk, Harga Modal, Harga Jual, dan Stok Saat Ini.
*   **Stock Opname (Penyesuaian Stok):** Fitur untuk mencocokkan stok fisik di toko dengan stok di sistem (*database*). Admin dapat menambah atau mengurangi angka stok beserta catatan alasannya (misal: barang rusak/hilang).

## 4. Tumpukan Teknologi (Tech Stack)
*   **Frontend:** React.js (atau Next.js jika membutuhkan SSR/API routes bawaan).
*   **State Management:** Zustand (untuk manajemen state keranjang kasir yang ringan dan berkinerja tinggi).
*   **Styling:** Tailwind CSS (berdasarkan panduan visual pada `DESIGN.md`).
*   **Backend & Database:** Supabase (PostgreSQL untuk struktur data relasional dan Supabase Auth untuk keamanan).

## 5. Kebutuhan Non-Fungsional
*   **Performa:** Transaksi kasir (tambah barang via scanner) harus terasa instan tanpa *lag* atau *loading page*.
*   **Responsivitas:** UI harus mengikuti panduan di `DESIGN.md` dan dapat digunakan dengan baik di layar monitor desktop maupun tablet (landscape).
*   **Reliabilitas:** Sistem harus menangani kesalahan koneksi dengan anggun (misal: menampilkan peringatan saat koneksi ke Supabase terputus). Di masa depan, arsitektur dapat dikembangkan menjadi PWA (Progressive Web App) untuk dukungan *offline-first*.