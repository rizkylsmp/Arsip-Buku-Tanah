# 🚀 DEPLOY KE RENDER - QUICK GUIDE

## 📋 PERSIAPAN

1. Push code ke GitHub
2. Daftar di [render.com](https://render.com)
3. Buat database MySQL/PostgreSQL di Render

---

## ⚡ DEPLOYMENT CEPAT

### 1. Setup Database di Render

**Buat Database:**

- Dashboard Render → **New +** → **MySQL** (atau PostgreSQL)
- Name: `sibt-db`
- Region: Singapore
- Plan: Free
- Klik **Create Database**
- **Catat Connection Info**

---

### 2. Deploy Backend

**Buat Web Service:**

- Dashboard Render → **New +** → **Web Service**
- Connect GitHub repository
- Settings:
  - Name: `sibt-backend`
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Region: Singapore
  - Plan: Free

**Environment Variables:**

Klik **"Add Environment Variable"**, masukkan:

```
NODE_ENV=production
PORT=4000
DB_HOST=[dari Render DB Connection Info]
DB_NAME=sibt
DB_USER=[dari Render DB Connection Info]
DB_PASS=[dari Render DB Connection Info]
DB_PORT=3306
JWT_SECRET=ganti-dengan-random-string-minimal-32-karakter
```

Klik **Create Web Service**

---

### 3. Setup Database (2 Cara)

#### ✅ Cara 1: Menggunakan Node.js Script (RECOMMENDED)

Setelah backend deploy, buka **Shell** di Render:

1. Dashboard → pilih backend service → Tab **Shell**
2. Jalankan command:

```bash
node scripts/setupDatabase.js
```

**SELESAI!** Database otomatis ter-setup dengan data dummy.

---

#### Cara 2: Import SQL Manual

Jika menggunakan MySQL Workbench atau phpMyAdmin:

```bash
mysql -h [DB_HOST] -u [DB_USER] -p [DB_NAME] < database/sibt_dump.sql
```

Atau via Render Shell:

```bash
# Download mysql client
apt-get update && apt-get install -y mysql-client

# Import database
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < database/sibt_dump.sql
```

---

## 🔐 AKUN LOGIN

Setelah setup database selesai:

**Admin:**

- Username: `admin`
- Password: `admin123`

**Pegawai:**

- Username: `budi`, `siti`, atau `ahmad`
- Password: `admin123` (semua sama)

---

## 🧪 TEST DEPLOYMENT

### Cek Backend API:

```bash
# Health check
curl https://sibt-backend.onrender.com/api/health

# Test login
curl -X POST https://sibt-backend.onrender.com/api/auth/login \
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
   - Name: `sibt-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. **Environment Variables:**

   ```
   VITE_API_URL=https://sibt-backend.onrender.com
   ```

5. **Create Static Site**

### Opsi 2: Netlify (Lebih Cepat)

1. Login [netlify.com](https://netlify.com)
2. **Add new site** → Import from Git
3. Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Environment: `VITE_API_URL=https://sibt-backend.onrender.com`

---

## ⚙️ UPDATE CORS

Edit `backend/src/app.js`, tambahkan URL frontend:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://sibt-frontend.onrender.com", // Ganti dengan URL frontend Anda
];
```

Commit & push → Render auto-redeploy.

---

## 📊 COMMANDS PENTING DI RENDER SHELL

```bash
# Setup database
node scripts/setupDatabase.js

# Check database connection
node -e "require('./src/config/db.js').sequelize.authenticate().then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e))"

# Generate password hash
node scripts/generatePassword.js

# View environment variables
printenv | grep DB

# Check Node version
node --version

# Check npm version
npm --version

# Rebuild dependencies
npm ci

# Clear cache and reinstall
rm -rf node_modules package-lock.json && npm install
```

---

## 🚨 TROUBLESHOOTING

### Backend tidak bisa konek ke database

```bash
# Di Render Shell, test connection
node -e "const mysql = require('mysql2'); const conn = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME}); conn.connect(err => {if(err) console.log('❌', err); else console.log('✅ Connected')});"
```

### Environment variables tidak terbaca

1. Cek di Render Dashboard → Service → Environment
2. Restart service setelah update env variables

### Database kosong

Jalankan ulang:

```bash
node scripts/setupDatabase.js
```

**⚠️ WARNING:** Script ini akan drop semua tabel dan create ulang!

---

## 📝 NOTES

- **Free tier Render** akan sleep setelah 15 menit idle
- **First request** setelah sleep: 30-60 detik
- **Database gratis**: 90 hari (perpanjang atau upgrade)
- **Logs**: Dashboard → Service → Logs

---

## ✅ CHECKLIST

- [ ] Push code ke GitHub
- [ ] Buat database di Render
- [ ] Deploy backend ke Render
- [ ] Set environment variables
- [ ] Jalankan `node scripts/setupDatabase.js`
- [ ] Test login API
- [ ] Deploy frontend
- [ ] Update CORS settings
- [ ] Test frontend → backend connection
- [ ] Ganti password default

---

**Happy Deploying! 🎉**

Butuh bantuan? Cek logs di Render Dashboard atau lihat dokumentasi lengkap di `DEPLOY_RENDER.md` di root folder.
