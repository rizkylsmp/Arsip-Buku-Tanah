# 📚 Sistem Informasi Arsip Buku Tanah (SIBT)

Aplikasi manajemen arsip buku tanah berbasis web untuk Badan Pertanahan Nasional (BPN). Sistem ini menyediakan fitur pencatatan, peminjaman, dan pengembalian buku tanah dengan role-based access control.

## 🎯 Fitur Utama

### 👤 Role & Akses

- **Admin**: Full access (CRUD semua data, manajemen user)
- **Pegawai**: Dashboard, view Buku Tanah, kelola Peminjaman & Pengembalian

### 📋 Modul Aplikasi

- ✅ Dashboard - Statistik dan overview data
- 📚 Data Buku Tanah - Manajemen arsip buku tanah
- 📤 Data Peminjaman - Pencatatan peminjaman buku
- 📥 Data Pengembalian - Pencatatan pengembalian buku
- 👥 Data Petugas - Manajemen user (Admin only)

---

## 🚀 Instalasi dan Setup

### 📋 Prasyarat

Pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) (v16 atau lebih baru)
- [Git](https://git-scm.com/)
- [XAMPP](https://www.apachefriends.org/) atau MySQL Server
- Text Editor (VS Code, Sublime, dll)

---

### 📥 1. Download Project dari GitHub

```bash
# Clone repository
git clone https://github.com/rizkylsmp/Arsip-Buku-Tanah.git

# Masuk ke folder project
cd Arsip-Buku-Tanah
```

---

### 🗄️ 2. Setup Database MySQL

#### Langkah 1: Start XAMPP

1. Buka **XAMPP Control Panel**
2. Start **Apache** dan **MySQL**

#### Langkah 2: Import Database

1. Buka browser, akses: `http://localhost/phpmyadmin`
2. Klik tab **"New"** atau **"Baru"** di sidebar kiri
3. Buat database baru dengan nama: `sibt`
4. Klik database `sibt` yang baru dibuat
5. Klik tab **"Import"**
6. Klik **"Choose File"** dan pilih file: `database/sibt.sql` (dari folder project)
7. Scroll ke bawah, klik **"Go"** atau **"Kirim"**
8. Tunggu hingga muncul pesan **"Import has been successfully finished"**

#### Langkah 3: Verifikasi Database

Pastikan tabel-tabel berikut sudah ada:

- `petugas`
- `buku_tanah`
- `peminjaman`
- `pengembalian`

---

### ⚙️ 3. Setup Backend (Server)

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Copy dan konfigurasi environment
# File .env.development sudah tersedia dengan konfigurasi default XAMPP
```

#### Konfigurasi Database (Optional)

Jika database Anda berbeda dari default, edit file `backend/.env.development`:

```env
DB_HOST=localhost
DB_NAME=sibt
DB_USER=root
DB_PASS=
JWT_SECRET=supersecretkey
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_SECRET_CODE=ADMIN
```

#### Jalankan Database Setup (Penting!)

```bash
# Setup database lengkap dengan auto-migration
npm run setup
```

Ini akan otomatis:

- ✅ Koneksi ke database
- ✅ Sync models Sequelize
- ✅ Migrate kolom kode_buku → nomor_hak
- ✅ Tambah kolom desa_kelurahan, luas_tanah
- ✅ Tambah kolom role ke tabel petugas
- ✅ Set user pertama sebagai admin

Output yang diharapkan:

```
========================================
  DATABASE SETUP & MIGRATION SCRIPT
========================================

✅ Database connected
✅ Models synced
✓ nomor_hak column already exists
✓ desa_kelurahan column already exists
✓ luas_tanah column already exists
✓ role column already exists

========================================
  SETUP COMPLETED ✅
========================================

✓ Database already up-to-date, no migrations needed
🚀 Ready to run! You can now start the server.
```

---

### 🎨 4. Setup Frontend (Client)

Buka terminal baru (jangan tutup terminal backend):

```bash
# Masuk ke folder frontend (dari root project)
cd frontend

# Install dependencies
npm install
```

File `.env.development` sudah tersedia dengan konfigurasi:

```env
VITE_API_URL=http://localhost:4000/api
```

---

### ▶️ 5. Running Aplikasi (Development)

#### Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

Output:

```
Server running on port 4000
Database connected successfully
```

#### Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Output:

```
  VITE v... ready in ...ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 🌐 Akses Aplikasi

Buka browser dan akses: **http://localhost:5173**

---

## 📖 Panduan Penggunaan Aplikasi

### 🔐 1. Registrasi & Login

#### Registrasi User Pertama (Auto Admin)

1. Klik tombol **"Register"** di halaman login
2. Isi form:
   - **Nama Lengkap**: Masukkan nama lengkap
   - **Username**: Username untuk login (unik)
   - **Password**: Minimal 6 karakter
   - **Konfirmasi Password**: Harus sama dengan password
   - **Kode Admin**: _Kosongkan_ (user pertama otomatis admin)
3. Klik **"Daftar Sekarang"**
4. User pertama akan otomatis menjadi **Admin**

#### Registrasi Admin Tambahan

Gunakan salah satu cara:

- **Cara 1**: Masukkan kode `ADMIN` di field "Kode Admin" saat registrasi
- **Cara 2**: Admin yang sudah ada bisa promosi pegawai lewat menu Data Petugas

#### Registrasi Pegawai

1. Isi form registrasi seperti biasa
2. **Kosongkan** field "Kode Admin"
3. User akan terdaftar sebagai **Pegawai**

#### Login

1. Masukkan **Username** dan **Password**
2. Klik **"Masuk"**

---

### 👨‍💼 2. Menu Admin

#### A. Dashboard

- Lihat statistik total data (Buku Tanah, Peminjaman, Pengembalian, Petugas)
- Overview data terbaru

#### B. Data Buku Tanah

**Tambah Buku Tanah:**

1. Klik tombol **"Tambah Buku Tanah"**
2. Isi form:
   - **Kode Buku**: Auto-generate (format: BT001, BT002, dst)
   - **Nama Pemilik**: Nama pemilik tanah
   - **Kecamatan**: Lokasi kecamatan
   - **Jenis Buku**: Tipe buku tanah
   - **Tanggal Input**: Tanggal pencatatan
3. Klik **"Simpan"**

**Edit Buku Tanah:**

1. Klik icon **✏️ Edit** pada baris data
2. Ubah data yang diperlukan (Kode Buku tidak bisa diubah)
3. Klik **"Update"**

**Hapus Buku Tanah:**

1. Klik icon **🗑️ Delete** pada baris data
2. Konfirmasi penghapusan

**Fitur Tambahan:**

- 🔍 **Search**: Cari data dengan keyword
- 📄 **Pagination**: Navigasi antar halaman data
- 📊 **Sort**: Klik header kolom untuk sorting

#### C. Data Peminjaman

**Tambah Peminjaman:**

1. Klik **"Tambah Peminjaman"**
2. Isi form:
   - **Kode Peminjaman**: Auto-generate (format: PJ001, PJ002)
   - **Buku Tanah**: Pilih dari dropdown
   - **Nama Peminjam**: Nama yang meminjam
   - **Tanggal Pinjam**: Tanggal peminjaman
   - **Keterangan**: Catatan tambahan (opsional)
3. Klik **"Simpan"**
4. Status buku otomatis berubah jadi **"dipinjam"**

**Edit & Hapus**: Sama seperti Buku Tanah

#### D. Data Pengembalian

**Tambah Pengembalian:**

1. Klik **"Tambah Pengembalian"**
2. Isi form:
   - **Kode Pengembalian**: Auto-generate (format: PG001, PG002)
   - **Peminjaman**: Pilih dari dropdown (hanya yang belum dikembalikan)
   - **Tanggal Kembali**: Tanggal pengembalian
   - **Keterangan**: Kondisi/catatan (opsional)
3. Klik **"Simpan"**
4. Status buku otomatis kembali **"tersedia"**

**Edit & Hapus**: Sama seperti Buku Tanah

#### E. Data Petugas (Admin Only)

**Tambah Petugas:**

1. Klik **"Tambah Petugas"**
2. Isi form:
   - **Nama**: Nama lengkap petugas
   - **Username**: Username untuk login
   - **Password**: Password login
   - **Conf Password**: Konfirmasi password
   - **Alamat**: Alamat lengkap
   - **Jenis Kelamin**: Pilih Pria/Wanita
   - **No Handphone**: Nomor telepon
3. Klik **"Simpan"**
4. User baru akan terdaftar sebagai **Pegawai**

**Edit Petugas (Termasuk Promosi Role):**

1. Klik icon **✏️ Edit** pada baris data
2. Ubah data yang diperlukan
3. **Promosi ke Admin**: Ubah field **"Role"** dari "Pegawai" ke "Admin"
4. Klik **"Update"**

**Ubah Password:**

1. Klik icon **🔑 Ubah Password** pada baris data
2. Masukkan password baru
3. Konfirmasi password
4. Klik **"Ubah Password"**

**Hapus Petugas**: Klik icon 🗑️ Delete

---

### 👷 3. Menu Pegawai

Pegawai memiliki akses terbatas:

#### ✅ Yang Bisa Diakses:

- **Dashboard**: Lihat statistik
- **Data Buku Tanah**: **View only** (tidak bisa tambah/edit/hapus)
- **Data Peminjaman**: Full access (tambah/edit/hapus)
- **Data Pengembalian**: Full access (tambah/edit/hapus)

#### ❌ Yang Tidak Bisa Diakses:

- Menu **"Data Petugas"** tidak muncul di sidebar
- Tombol **"Tambah Buku Tanah"** tidak muncul
- Icon **Edit** dan **Delete** di Buku Tanah tidak muncul

---

## 🔧 Troubleshooting

### ❌ Backend tidak bisa connect ke database

**Solusi:**

1. Pastikan XAMPP MySQL sudah running
2. Cek konfigurasi di `backend/.env.development`
3. Verifikasi database `sibt` sudah dibuat dan diimport

### ❌ Frontend error "Network Error"

**Solusi:**

1. Pastikan backend sudah running di port 4000
2. Cek `frontend/.env.development` → `VITE_API_URL=http://localhost:4000/api`
3. Restart frontend: `Ctrl+C` lalu `npm run dev` lagi

### ❌ Error "role column not found"

**Solusi:**

```bash
cd backend
npm run migrate:role
```

### ❌ Port 4000 atau 5173 sudah digunakan

**Solusi:**

- Tutup aplikasi yang menggunakan port tersebut
- Atau ubah port di file `.env`

### ❌ Login gagal meskipun password benar

**Solusi:**

1. Hapus localStorage browser: `F12` → Application → Local Storage → Clear All
2. Refresh halaman
3. Login ulang

---

## 📁 Struktur Project

```
Arsip-Buku-Tanah/
├── backend/              # Server (Node.js + Express)
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Business logic
│   │   ├── middlewares/  # Authentication, authorization
│   │   ├── models/       # Database models (Sequelize)
│   │   ├── routes/       # API routes
│   │   └── scripts/      # Migration scripts
│   ├── .env.development  # Environment variables
│   └── package.json
│
├── frontend/             # Client (React + Vite)
│   ├── src/
│   │   ├── api/          # API calls
│   │   ├── Components/   # Reusable components
│   │   ├── Pages/        # Page components
│   │   └── router/       # Route configuration
│   ├── .env.development  # Environment variables
│   └── package.json
│
├── database/
│   └── sibt.sql          # Database dump
│
└── README.md             # Documentation (file ini)
```

---

## 🔐 Keamanan

### Role-Based Access Control (RBAC)

- JWT Token authentication (expired: 8 jam)
- Protected routes dengan middleware
- Backend validation untuk semua request

### Password

- Hashing dengan bcrypt (salt rounds: 10)
- Minimal 6 karakter
- Tidak disimpan plain text

### Admin Code

- Default: `ADMIN`
- Bisa diganti di `backend/.env.development` → `ADMIN_SECRET_CODE`
- Hanya untuk registrasi admin tambahan

---

## 📝 Catatan Penting

1. **Jangan lupa migration**: Setelah clone project, wajib jalankan `npm run migrate:role`
2. **User pertama otomatis admin**: Tidak perlu kode admin untuk registrasi pertama
3. **Kode auto-generate**: Kode Buku, Peminjaman, Pengembalian dibuat otomatis oleh sistem
4. **Status otomatis**: Status buku berubah otomatis saat peminjaman/pengembalian
5. **Edit password terpisah**: Di halaman Petugas, password diubah lewat tombol khusus

---

## 📞 Support

Jika mengalami kendala:

1. Cek section **Troubleshooting** di atas
2. Buat issue di GitHub repository
3. Contact developer

---

## 📄 License

MIT License - Free to use and modify

---

**© 2025 Sistem Informasi Arsip Buku Tanah - BPN**
