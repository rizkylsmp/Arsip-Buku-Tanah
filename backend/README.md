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

### Scripts Available

- `npm start` - Run dengan nodemon (development mode)
- `npm run dev` - Run dengan nodemon (development mode)
- `npm run prod` - Run production mode

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
