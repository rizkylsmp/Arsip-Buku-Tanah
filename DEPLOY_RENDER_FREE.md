# 🚀 DEPLOY KE RENDER - FREE TIER (Tanpa Shell Access)

## ⚡ DEPLOYMENT OTOMATIS

Karena free tier tidak ada akses Shell, setup database akan **otomatis berjalan saat build/deploy**.

---

## 📋 LANGKAH DEPLOYMENT

### 1. Push Code ke GitHub

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

---

### 2. Setup Database di Render

**Buat MySQL Database:**

1. Login ke [Render Dashboard](https://dashboard.render.com)
2. Klik **"New +"** → **"MySQL"** (atau PostgreSQL)
3. Settings:
   - **Name**: `sibt-database`
   - **Database**: `sibt`
   - **User**: (otomatis generated)
   - **Region**: Singapore
   - **Plan**: **Free**
4. Klik **"Create Database"**
5. **CATAT** Internal Database URL dan Connection Info:
   - Internal Database URL
   - Hostname
   - Username
   - Password
   - Database Name
   - Port

---

### 3. Deploy Backend ke Render

**Buat Web Service:**

1. Klik **"New +"** → **"Web Service"**
2. **Connect GitHub Repository**
3. Configure Service:

   **Basic Settings:**
   - **Name**: `sibt-backend`
   - **Region**: Singapore (sama dengan database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**:
     ```bash
     npm install
     ```

   ```
   NODE_ENV=production
   PORT=4000
   DB_HOST=[hostname dari database]
   DB_NAME=sibt
   DB_USER=[username dari database]
   DB_PASS=[password dari database]
   DB_PORT=3306
   JWT_SECRET=ganti-dengan-random-string-minimal-32-karakter-panjang
   ```

   **Cara dapat DB credentials:**
   - Dashboard → Database `sibt-database` → Tab **"Info"**
   - Salin dari **"Internal Database URL"** atau **"Connection Details"**

4. Klik **"Create Web Service"**

---

### 4. Proses Deployment Otomatis

Setelah klik create, Render akan:

1. ✅ Clone repository dari GitHub
2. ✅ Install dependencies (`npm install`)
3. ✅ Start aplikasi (`npm start`)
4. ✅ **Server otomatis setup database saat start**:
   - Connect ke database
   - Sync tables (create jika belum ada)
   - Cek database kosong?
   - Ya → Seed data (4 petugas, 15 buku tanah, dll)
   - Tidak → Skip seed
5. ✅ Server running dan siap digunakan

**Tunggu 3-5 menit** sampai deployment selesai.

Cek **Logs** untuk melihat proses seeding:

- Dashboard → Service → Logs
- Cari log: **"✅ Database seeded successfully!"**

---

### 5. Verifikasi Deployment

Setelah status **"Live"**, test API:

```bash
# Ganti URL dengan URL backend Anda
curl https://sibt-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Jika berhasil, akan return JWT token.

---

## 🎨 DEPLOY FRONTEND

### Opsi 1: Render Static Site

1. **New +** → **Static Site**
2. Connect repository yang sama
3. Settings:
   - **Name**: `sibt-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables:**

   ```
   VITE_API_URL=https://sibt-backend.onrender.com
   ```

   (Ganti dengan URL backend Anda)

5. Klik **"Create Static Site"**

### Opsi 2: Netlify (Recommended - Lebih Cepat & Stabil)

1. Login [netlify.com](https://app.netlify.com)
2. **"Add new site"** → **"Import an existing project"**
3. Connect GitHub
4. Settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. **Environment variables:**

   ```
   VITE_API_URL = https://sibt-backend.onrender.com
   ```

6. **Deploy site**

---

## ⚙️ UPDATE CORS SETTINGS

Setelah frontend deploy, update CORS di backend:

Edit `backend/src/app.js`:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://sibt-frontend.onrender.com", // URL frontend Render
  "https://your-netlify-site.netlify.app", // URL frontend Netlify
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
```

Commit & push → Render auto-redeploy.

---

## 🔐 AKUN LOGIN DEFAULT

Setelah deployment selesai, login menggunakan:

**Admin:**

- Username: `admin`
- Password: `admin123`

**Pegawai:**

- Username: `budi` / `siti` / `ahmad`
- Password: `admin123`

**⚠️ WAJIB:** Ganti password setelah login pertama kali!

---

## 📊 DATA YANG TER-SEED OTOMATIS

Script `autoSetup.js` akan otomatis membuat:

- ✅ **4 Petugas** (1 admin, 3 pegawai)
- ✅ **15 Buku Tanah**
- ✅ **3 Peminjaman**
- ✅ **2 Pengembalian**

---

## 🔧 CARA KERJA AUTO-SETUP

**Build Command di Render:**

```bash
npm run build
```

**package.json:**

```json
"build": "npm install && node scripts/autoSetup.js"
```

**Script autoSetup.js:**

1. Connect ke database
2. Sync tables (create jika belum ada)
3. **Cek apakah database kosong**
4. Jika kosong → seed data
5. Jika sudah ada data → skip seed

Jadi **aman untuk redeploy** berkali-kali, data tidak akan duplicate!

---

## 🚨 TROUBLESHOOTING

### 1. Build Failed - Cannot connect to database

**Penyebab:** Environment variables salah atau database belum siap.

**Solusi:**

- Cek DB_HOST, DB_USER, DB_PASS, DB_NAME sudah benar
- Pastikan database sudah dalam status "Available"
- Gunakan **Internal Database URL** bukan External
- Restart service: Dashboard → Service → Manual Deploy → "Clear build cache & deploy"

### 2. API bisa diakses tapi database kosong

**Penyebab:** Auto-setup gagal atau tidak jalan.

**Solusi:**

- Cek logs: Dashboard → Service → Logs
- Cari log "Database seeded successfully"
- Jika tidak ada, trigger manual deploy ulang

### 3. CORS Error di Frontend

**Solusi:**

- Update `allowedOrigins` di `backend/src/app.js`
- Tambahkan URL frontend yang benar
- Commit & push → auto-redeploy

### 4. Database "Connection limit reached"

**Penyebab:** Free tier MySQL limited connections.

**Solusi:**

- Edit `backend/src/config/db.js`:
  ```javascript
  pool: {
    max: 3, // Turunkan dari 5 ke 3
    min: 0,
    acquire: 30000,
    idle: 10000
  }
  ```

### 5. Backend Sleep setelah 15 menit

**Ini normal untuk Free Tier.**

**Solusi:**

- First request setelah sleep: 30-60 detik (cold start)
- Upgrade ke paid plan ($7/month) untuk always-on
- Atau gunakan cron job untuk ping setiap 10 menit

---

## 📝 ENVIRONMENT VARIABLES LENGKAP

**Backend:**

```env
NODE_ENV=production
PORT=4000

# Database (dari Render Database Info)
DB_HOST=dpg-xxxxx.oregon-postgres.render.com
DB_NAME=sibt
DB_USER=sibt_user
DB_PASS=xxxxxxxxxxxxxxxxxxxxx
DB_PORT=5432

# JWT Secret (generate random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-use-random-generator

# Optional
ALLOWED_ORIGINS=https://sibt-frontend.onrender.com,https://sibt.netlify.app
```

**Frontend:**

```env
VITE_API_URL=https://sibt-backend.onrender.com
```

---

## 🎯 GENERATE JWT SECRET

### Di Terminal (Git Bash/WSL):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Online:

- [RandomKeygen.com](https://randomkeygen.com/)
- Copy "Fort Knox Passwords"

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Push code ke GitHub
- [ ] Buat MySQL/PostgreSQL database di Render
- [ ] Catat DB credentials
- [ ] Deploy backend dengan:
  - Build Command: `npm run build`
  - Start Command: `npm start`
- [ ] Set semua environment variables
- [ ] Tunggu deployment selesai (5-10 menit)
- [ ] Cek logs - pastikan ada "Database seeded successfully"
- [ ] Test API login
- [ ] Deploy frontend (Render/Netlify)
- [ ] Update CORS di backend
- [ ] Test frontend login dengan admin/admin123
- [ ] Ganti password default

---

## 📞 MONITORING

### Cek Logs Real-time:

- Dashboard → Service → **Logs**
- Lihat build process, database setup, errors

### Metrics:

- Dashboard → Service → **Metrics**
- CPU, Memory, Request count

### Redeploy Manual:

- Dashboard → Service → **Manual Deploy**
- "Deploy latest commit" atau "Clear build cache & deploy"

---

## 💡 TIPS OPTIMASI

1. **Database Connection Pool:**
   - Free tier: max 3 connections
   - Paid: max 10+ connections

2. **Keep Backend Alive:**
   - Gunakan UptimeRobot (gratis) untuk ping setiap 5 menit
   - URL: `https://sibt-backend.onrender.com/api/health`

3. **Frontend Speed:**
   - Netlify lebih cepat untuk static site
   - Render static site kadang slow loading

4. **Environment Management:**
   - Jangan hardcode credentials
   - Gunakan `.env.production` untuk backup

---

**Happy Deploying! 🎉**

Semua setup database otomatis, tinggal tunggu deployment selesai dan langsung bisa dipakai!

---

## 📌 RENDER DASHBOARD LINKS

- **Database**: https://dashboard.render.com/databases
- **Web Services**: https://dashboard.render.com/
- **Docs**: https://render.com/docs
