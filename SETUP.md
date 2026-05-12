# 🚀 Setup Guide untuk Sistem Arsip Buku Tanah

## Daftar Isi

1. [Setup Awal (Fresh Install)](#setup-awal)
2. [Setup di Device Baru](#setup-di-device-baru)
3. [Database Migrations](#database-migrations)
4. [Troubleshooting](#troubleshooting)

---

## Setup Awal

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup database (auto-migration)
npm run setup

# Run development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## Setup di Device Baru

Ketika Anda pull project dari GitHub di device lain, ikuti langkah ini:

### 1️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# PENTING: Setup database dengan migration otomatis
npm run setup

# Jika setup berhasil, jalankan dev server
npm run dev
```

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

### 3️⃣ Akses Aplikasi

- Frontend: `http://localhost:5173` (atau sesuai vite config)
- Backend: `http://localhost:4000` (default port)

---

## Database Migrations

### Scripts yang Tersedia

| Script               | Fungsi                                          | Kapan Digunakan                                    |
| -------------------- | ----------------------------------------------- | -------------------------------------------------- |
| `npm run setup`      | Setup database lengkap dengan semua migration   | Pertama kali setup, atau setelah pull project baru |
| `npm run setup:prod` | Setup untuk production environment              | Deploy ke production                               |
| `npm run migrate`    | Alias untuk setup (sama dengan `npm run setup`) | Hanya menjalankan migration                        |

### Apa yang Dilakukan `npm run setup`?

1. ✅ Koneksi ke database
2. ✅ Sync semua models Sequelize
3. ✅ Rename kolom `kode_buku` → `nomor_hak` (jika belum)
4. ✅ Tambah kolom `desa_kelurahan` (jika belum)
5. ✅ Tambah kolom `luas_tanah` (jika belum)
6. ✅ Tambah kolom `role` di tabel `petugas` (jika belum)
7. ✅ Set user pertama sebagai admin

**Output yang akan Anda lihat:**

```
========================================
  DATABASE SETUP & MIGRATION SCRIPT
========================================

🔗 Connecting to database...
✅ Database connected

📋 Syncing models...
✅ Models synced

🔍 Checking buku_tanah table structure...
  ✓ nomor_hak column already exists
  ✓ desa_kelurahan column already exists
  ✓ luas_tanah column already exists

🔍 Checking petugas table structure...
  ✓ role column already exists

========================================
  SETUP COMPLETED ✅
========================================

✓ Database already up-to-date, no migrations needed

🚀 Ready to run! You can now start the server.
```

---

## Environment Variables

### Backend (.env.development / .env.production)

```env
# Database
DB_HOST=localhost
DB_NAME=sibt
DB_USER=root
DB_PASS=                    # Kosongkan jika tidak ada password
DB_PORT=3306

# Server
PORT=4000                   # Default 4000
NODE_ENV=development

# JWT (ganti dengan random string panjang di production!)
JWT_SECRET=supersecretkey

# CORS
FRONTEND_URL=http://localhost:5173

# Admin registration
ADMIN_SECRET_CODE=ADMIN
```

Gunakan `.env.example` sebagai template. Semua field sudah tersedia, sesuaikan sesuai setup Anda.

### Frontend (.env.development / .env.production)

```env
VITE_API_URL=http://localhost:3000
```

---

## Prosedur Push-Pull dari GitHub

### Developer A (yang membuat perubahan)

```bash
# Buat perubahan di kode
git add .
git commit -m "feat: description"
git push origin main
```

### Developer B (yang pull di device baru)

```bash
# Clone atau pull project
git clone <repo-url>
cd Arsip

# Setup Backend
cd backend
npm install
npm run setup  # ← PENTING! Jangan skip ini
npm run dev

# Di terminal baru, setup Frontend
cd frontend
npm install
npm run dev
```

**Sekarang siap bekerja!** ✅

---

## Database Schema Terbaru

### Tabel: buku_tanah

| Kolom              | Tipe                          | Keterangan                  |
| ------------------ | ----------------------------- | --------------------------- |
| id_buku            | INT                           | Primary Key, Auto Increment |
| **nomor_hak**      | VARCHAR(50)                   | Required                    |
| nama_pemilik       | VARCHAR(100)                  |                             |
| kecamatan          | VARCHAR(100)                  |                             |
| **desa_kelurahan** | VARCHAR(100)                  | NEW - Tempat tanah berada   |
| jenis_buku         | VARCHAR(200)                  |                             |
| **luas_tanah**     | VARCHAR(50)                   | NEW - Luas tanah            |
| tanggal_input      | DATE                          |                             |
| id_petugas         | INT                           | Foreign Key                 |
| status             | ENUM('tersedia', 'terpinjam') |                             |
| createdAt          | DATETIME                      |                             |
| updatedAt          | DATETIME                      |                             |

---

## Troubleshooting

### Error: "Unknown column 'nomor_hak'"

**Solusi:** Jalankan `npm run setup` untuk migration database

```bash
npm run setup
```

### Error: "Can't connect to database"

**Periksa:**

1. MySQL server sudah running?

   ```bash
   # Windows
   net start MySQL80

   # Mac
   brew services start mysql
   ```

2. .env.development sudah benar?

   ```bash
   cat .env.development
   ```

3. Database sudah dibuat?
   ```sql
   CREATE DATABASE sibt_dump CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Error: "column role doesn't exist in petugas"

**Solusi:** Jalankan setup untuk menambah kolom

```bash
npm run setup
```

### Frontend tidak bisa connect ke Backend

**Periksa:**

1. Backend sudah running di port yang benar?

   ```bash
   # Terminal backend
   npm run dev
   # Harus ada "Server running on port 3000"
   ```

2. VITE_API_URL di frontend .env.development benar?
   ```env
   VITE_API_URL=http://localhost:3000
   ```

---

## Scripts Reference

### Backend

```bash
npm run dev              # Run with nodemon (development)
npm run start            # Run di production
npm run setup            # Setup database (development)
npm run setup:prod       # Setup database (production)
npm run migrate          # Run migrations
npm run migrate:role     # Old role migration script
npm run build            # Install dependencies
```

### Frontend

```bash
npm run dev              # Vite dev server
npm run build            # Build untuk production
npm run preview          # Preview build
npm run lint             # Lint JavaScript
```

---

## Tips & Best Practices

✅ **Do:**

- Selalu jalankan `npm run setup` setelah pull project baru
- Commit file `.gitignore` yang sudah benar
- Jangan commit `.env` file (gunakan `.env.example`)

❌ **Don't:**

- Jangan langsung edit database manual, gunakan scripts
- Jangan commit node_modules
- Jangan skip setup database di device baru

---

## File Penting

```
backend/
├── .env.development          ← Jangan commit!
├── src/
│   ├── scripts/
│   │   ├── setupDatabase.js  ← Auto migration script
│   │   └── ...
│   ├── models/
│   ├── controllers/
│   └── ...
└── package.json

frontend/
├── .env.development          ← Jangan commit!
└── ...
```

---

**Pertanyaan?** Lihat error message dan section Troubleshooting di atas.

Selamat coding! 🚀
