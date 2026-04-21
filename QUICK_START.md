# ⚡ QUICK START - Setup Cepat

## 🎯 Untuk Device Baru / Setelah Pull dari GitHub

### Terminal 1 - Backend

```bash
cd backend
npm install
npm run setup          # ← WAJIB! Auto-migrate database
npm run dev
```

✅ Backend siap di `http://localhost:4000`

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend siap di `http://localhost:5173`

---

## 📋 Checklist Sebelum Setup

- [ ] MySQL server sudah running
- [ ] Database `sibt` sudah dibuat
- [ ] `.env.development` sudah di-setup (gunakan `.env.example`)
- [ ] Node.js v14+ sudah terinstall

---

## 🚨 ERROR? Lihat Ini

### "Unknown column 'nomor_hak'"

```bash
npm run setup
```

### "Can't connect to database"

```bash
# Pastikan MySQL running
net start MySQL80          # Windows
brew services start mysql  # Mac
```

### "CORS error"

Pastikan `FRONTEND_URL` di backend .env benar:

```env
FRONTEND_URL=http://localhost:5173
```

### Port sudah terpakai

Ganti PORT di backend `.env.development`:

```env
PORT=5000  # atau port lain
```

---

## 📚 Dokumentasi Lengkap

Lihat [SETUP.md](./SETUP.md) untuk panduan lengkap

---

**Selamat coding! 🚀**
