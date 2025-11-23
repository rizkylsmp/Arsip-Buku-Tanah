# Database Migration Guide untuk Render

## Masalah

Database production di Render tidak memiliki kolom:

- `kode_peminjaman` di tabel `peminjaman`
- `kode_pengembalian` di tabel `pengembalian`
- `keterangan` di tabel `pengembalian`

## Solusi

### Cara 1: Menjalankan Migration via Render Shell

1. **Login ke Render Dashboard**
2. **Buka service backend Anda**
3. **Klik tab "Shell"** di menu atas
4. **Jalankan command berikut:**

```bash
npm run migrate
```

5. **Output yang diharapkan:**

```
🚀 Starting database migration...

🔍 Checking database columns...

➕ Adding kode_peminjaman column to peminjaman table...
✅ kode_peminjaman column added successfully!
🔄 Generating kode_peminjaman for existing records...
✅ Generated kode_peminjaman for X records
✅ Unique constraint added to kode_peminjaman

➕ Adding kode_pengembalian column to pengembalian table...
✅ kode_pengembalian column added successfully!
🔄 Generating kode_pengembalian for existing records...
✅ Generated kode_pengembalian for X records
✅ Unique constraint added to kode_pengembalian

➕ Adding keterangan column to pengembalian table...
✅ keterangan column added to pengembalian table

✅ All migrations completed successfully!
```

### Cara 2: Menjalankan Migration via MySQL Client (Alternative)

Jika Anda memiliki akses langsung ke MySQL database:

```sql
-- Add kode_peminjaman to peminjaman
ALTER TABLE peminjaman
ADD COLUMN kode_peminjaman VARCHAR(50) AFTER id_pinjam;

-- Add kode_pengembalian to pengembalian
ALTER TABLE pengembalian
ADD COLUMN kode_pengembalian VARCHAR(50) AFTER id_kembali;

-- Add keterangan to pengembalian
ALTER TABLE pengembalian
ADD COLUMN keterangan TEXT AFTER tanggal_kembali;

-- Add unique constraints
ALTER TABLE peminjaman
ADD UNIQUE KEY unique_kode_peminjaman (kode_peminjaman);

ALTER TABLE pengembalian
ADD UNIQUE KEY unique_kode_pengembalian (kode_pengembalian);
```

## Verifikasi

Setelah migration berhasil, coba:

1. **Test create peminjaman** via frontend
2. **Test create pengembalian** via frontend
3. **Cek logs di Render** - seharusnya tidak ada error lagi

## Troubleshooting

### Jika migration gagal:

1. Cek koneksi database
2. Pastikan environment variable `DATABASE_URL` sudah benar
3. Pastikan user database punya permission ALTER TABLE

### Jika kolom sudah ada:

Script akan skip dan menampilkan:

```
✓ kode_peminjaman column already exists
✓ kode_pengembalian column already exists
✓ keterangan column already exists in pengembalian
```

### Jika masih error setelah migration:

1. Restart service di Render
2. Clear cache di Render
3. Re-deploy aplikasi

## Catatan Penting

⚠️ **Backup database sebelum menjalankan migration di production!**

✅ Script migration ini **idempotent** - aman dijalankan berkali-kali
✅ Script akan generate kode otomatis untuk data existing
✅ Script akan menambahkan unique constraint untuk mencegah duplikasi

## Next Steps

Setelah migration berhasil:

1. ✅ Commit perubahan ini ke git
2. ✅ Push ke repository
3. ✅ Render akan auto-deploy
4. ✅ Test fitur peminjaman & pengembalian
