# Backend - Sistem Informasi Buku Tanah

## Environment Configuration

Project ini menggunakan file environment yang terpisah untuk development dan production.

### File Environment

- `.env.development` - Konfigurasi untuk development
- `.env.production` - Konfigurasi untuk production
- `.env.example` - Template environment (untuk referensi)

### Setup

1. Copy file `.env.example` sesuai kebutuhan:

   ```bash
   # Untuk development (sudah ada)
   cp .env.example .env.development

   # Untuk production
   cp .env.example .env.production
   ```

2. Edit file environment sesuai dengan konfigurasi Anda

### Running the Application

**Development Mode:**

```bash
npm run dev
# atau
npm start
```

**Production Mode:**

```bash
npm run prod
```

### Database Setup

**IMPORTANT:** Setelah pull project baru atau di device baru, WAJIB jalankan:

```bash
# Setup database dengan auto-migration
npm run setup
```

Ini akan otomatis:

- ✅ Koneksi ke database
- ✅ Sync models
- ✅ Migrate kolom kode_buku → nomor_hak
- ✅ Tambah kolom desa_kelurahan, luas_tanah
- ✅ Tambah kolom role di petugas
- ✅ Set user pertama sebagai admin

Untuk production:

```bash
npm run setup:prod
```

📖 **Lihat [SETUP.md](../SETUP.md) untuk panduan lengkap setup di device baru**

### Scripts Available

- `npm start` - Run dengan nodemon (development mode)
- `npm run dev` - Run dengan nodemon (development mode)
- `npm run prod` - Run production mode
- `npm run setup` - Setup database dengan auto-migration (development)
- `npm run setup:prod` - Setup database untuk production
- `npm run migrate` - Jalankan database migrations saja

### Environment Variables

| Variable     | Description       | Example                       |
| ------------ | ----------------- | ----------------------------- |
| `DB_HOST`    | Database host     | `localhost`                   |
| `DB_NAME`    | Database name     | `sibt`                        |
| `DB_USER`    | Database user     | `root`                        |
| `DB_PASS`    | Database password | `your_password`               |
| `JWT_SECRET` | JWT secret key    | `your_secret_key`             |
| `PORT`       | Server port       | `4000`                        |
| `NODE_ENV`   | Environment mode  | `development` or `production` |

### Security Notes

⚠️ **IMPORTANT:**

- Never commit `.env.development` or `.env.production` files
- Change `JWT_SECRET` in production
- Use strong database password in production
- Keep `.env.example` updated for reference
