# Kasir Web POS

Glosarium istilah untuk aplikasi Point of Sale (POS) berbasis web.

## Autentikasi & Pengguna

**Admin**:
Pengguna yang mengelola toko dan memiliki kredensial penuh (Email & Password) ke Supabase Auth. Mengotorisasi Perangkat.
_Hindari_: Owner, Manager

**Kasir**:
Profil lokal karyawan yang mengoperasikan mesin POS. Menggunakan PIN untuk mengidentifikasi diri pada Perangkat yang sudah diautentikasi. Bukan entitas Supabase Auth langsung.
_Hindari_: User, Pegawai

**Perangkat**:
Sesi klien fisik (tablet/browser) yang telah diautentikasi ke sistem oleh Admin, tempat Kasir beroperasi.
_Hindari_: Terminal, Mesin


## Transaksi & Penjualan

**Keranjang**:
Kumpulan barang sementara yang sedang dipindai oleh Kasir. Data ini sepenuhnya hidup di sisi klien (frontend/Zustand) dan tidak tersimpan di database.
_Hindari_: Cart, Draft Order

**Transaksi**:
Catatan permanen di database yang menunjukkan sebuah Keranjang telah dibayar lunas. Berisi detail item, total bayar, dan informasi Kasir yang melayani.
_Hindari_: Order, Penjualan


## Inventori & Stok

**Produk**:
Master data barang dagangan yang memiliki harga dan barcode.
_Hindari_: Item, Barang

**Mutasi Stok**:
Catatan riwayat (buku besar) untuk setiap penambahan atau pengurangan jumlah fisik barang (akibat penjualan, opname, dsb). Menyimpan alasan dan jumlah perubahan.
_Hindari_: Log Stok, Riwayat Barang

**Opname**:
Proses manual oleh Admin untuk mencocokkan dan menyesuaikan jumlah stok fisik di toko dengan sistem. Menghasilkan *Mutasi Stok* baru dengan alasan tertentu (misal: "Barang rusak").
_Hindari_: Penyesuaian Stok, Stock Take


## Identifikasi Produk

**SKU (Stock Keeping Unit)**:
Kode unik internal wajib untuk setiap entitas produk (bisa di-generate otomatis oleh sistem jika kosong). Digunakan sebagai pengenal utama yang bisa dibaca manusia.
_Hindari_: Kode Barang, ID Internal

**Barcode**:
Kode referensi opsional bawaan pabrik (seperti EAN/UPC) yang menempel pada fisik produk. Hanya digunakan untuk mempercepat pencarian di keranjang menggunakan *scanner* fisik.
_Hindari_: Kode Scan


## Pembayaran

**Metode Pembayaran**:
Cara pelanggan melunasi transaksi (misal: Tunai, QRIS, Transfer). Sangat penting untuk keperluan tutup laci kasir (membedakan uang fisik dan digital).
_Hindari_: Tipe Pembayaran
