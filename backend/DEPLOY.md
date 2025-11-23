# 🚀 Cara Deploy & Migration di Render

## 📋 Checklist Deploy

### 1. Push Code ke Git

```bash
git add .
git commit -m "Add migration script for kode columns"
git push origin main
```

### 2. Jalankan Migration di Render

**Via Render Shell (Recommended):**

1. Buka **Render Dashboard** → Pilih service backend
2. Klik tab **"Shell"**
3. Jalankan command:

```bash
npm run migrate
```

4. Tunggu hingga muncul pesan:

```
✅ All migrations completed successfully!
```

### 3. Restart Service (Optional)

Jika perlu, restart service backend di Render

### 4. Test

- Test create peminjaman ✅
- Test create pengembalian ✅

## ⚠️ Troubleshooting

**Error: "Unknown column 'kode_peminjaman'"**
→ Jalankan migration: `npm run migrate`

**Error: "Column already exists"**
→ Aman, skip saja. Artinya migration sudah pernah dijalankan

**Error: Connection timeout**
→ Cek DATABASE_URL di environment variables Render

## 📝 Environment Variables yang Diperlukan di Render

```
NODE_ENV=production
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your_secret_key_here
PORT=4000
```

## 🔍 Cek Status Migration

Jalankan di Render Shell:

```bash
npm run migrate
```

Output akan menunjukkan kolom mana yang sudah ada atau perlu ditambahkan.

## 📚 Dokumentasi Lengkap

Lihat file `MIGRATION.md` untuk detail lengkap migration process.
