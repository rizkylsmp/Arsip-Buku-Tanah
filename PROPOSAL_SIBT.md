# PROPOSAL PENAWARAN

# SISTEM INFORMASI ARSIP BUKU TANAH (SIBT)

**Kepada Yth. Kepala Badan Pertanahan Nasional**

---

## 1. TENTANG SISTEM

**Sistem Informasi Arsip Buku Tanah (SIBT)** - Aplikasi berbasis web untuk digitalisasi pengelolaan arsip buku tanah di lingkungan BPN dengan fitur peminjaman, pengembalian, dan tracking dokumen secara real-time.

---

## 2. PERMASALAHAN

- Pengelolaan arsip masih manual
- Kesulitan tracking peminjaman/pengembalian
- Pencarian dokumen lambat
- Risiko kehilangan data tinggi
- Laporan manual rawan kesalahan
- Tidak ada kontrol akses yang memadai

---

## 3. FITUR UTAMA

### Modul Aplikasi:

1. **Dashboard** - Statistik & overview data real-time
2. **Data Buku Tanah** - CRUD, pencarian, filter, export
3. **Peminjaman** - Form digital, tracking, validasi ketersediaan
4. **Pengembalian** - Integrasi peminjaman, cek kondisi, auto-update status
5. **Manajemen Petugas** - User management, role assignment (Admin only)
6. **Laporan** - Export Excel/PDF, print-ready

### Keamanan:

- Login dengan enkripsi password (bcrypt)
- JWT Token Authentication
- Role-Based Access Control (Admin & Pegawai)
- Session management otomatis

---

## 4. TAMPILAN SISTEM

### Screenshot Aplikasi:

**4.1 Halaman Login**
![Halaman Login](images/login.png)
_Tampilan login dengan autentikasi aman_

**4.2 Dashboard**
![Dashboard](images/dashboard.png)
_Dashboard dengan statistik real-time dan overview data_

**4.3 Data Buku Tanah**
![Data Buku Tanah](images/buku-tanah.png)
_Manajemen data buku tanah dengan fitur CRUD lengkap_

**4.4 Form Peminjaman**
![Form Peminjaman](images/peminjaman.png)
_Form peminjaman digital dengan validasi_

**4.5 Data Pengembalian**
![Data Pengembalian](images/pengembalian.png)
_Pencatatan pengembalian terintegrasi_

**4.6 Manajemen Petugas**
![Manajemen Petugas](images/petugas.png)
_User management dengan role-based access_

**4.7 Laporan**
![Laporan](images/laporan.png)
_Sistem pelaporan dengan export Excel/PDF_

> **Catatan:** Untuk menampilkan gambar di Word, buat folder `images/` di lokasi yang sama dengan file proposal, lalu masukkan screenshot aplikasi dengan nama file sesuai di atas.

---

## 5. TEKNOLOGI

**Backend:**

- Node.js + Express.js v5.1.0
- MySQL + Sequelize ORM
- RESTful API
- JWT Authentication

**Frontend:**

- React v19.1.1 + Vite v7.1.7
- Radix UI + Tailwind CSS v4.1.14
- React Router v7.9.4
- Responsive Design

**Keamanan:**

- Password encryption
- SQL Injection prevention
- XSS Protection
- CORS configuration

---

## 6. TIMELINE IMPLEMENTASI

| Fase               | Durasi       | Aktivitas                           |
| ------------------ | ------------ | ----------------------------------- |
| Persiapan          | Minggu 1-2   | Analisis kebutuhan, survey, setup   |
| Development        | Minggu 3-8   | Coding backend, frontend, integrasi |
| Testing & Training | Minggu 9-10  | UAT, bug fixing, training user      |
| Deployment         | Minggu 11-12 | Go-live, monitoring, support        |
| Support            | 3 bulan      | Maintenance, bug fixes, konsultasi  |

**Total: 12 minggu + 3 bulan support**

---

## 7. DELIVERABLES

- ✅ Source code lengkap (frontend & backend)
- ✅ Database + migration scripts
- ✅ User Manual & Technical Documentation
- ✅ Training (Admin 4 jam, User 2 jam)
- ✅ Video tutorial
- ✅ Support 3 bulan

---

## 8. PERSYARATAN SISTEM

**Server:**

- OS: Windows Server 2016+ / Linux Ubuntu 20.04+
- RAM: 8GB minimum
- Storage: 100GB SSD
- Database: MySQL 8.0+

**Client (User):**

- Browser: Chrome/Firefox/Edge (terbaru)
- Internet: 2 Mbps minimum
- Resolusi: 1366x768 minimum

---

## 9. ESTIMASI BIAYA

| No  | Item                            | Harga (Rp)     |
| --- | ------------------------------- | -------------- |
| 1   | Development Software            | 25.000.000     |
| 2   | Training                        | 2.000.000      |
| 3   | Deployment & Installation       | 3.000.000      |
| 4   | Support & Maintenance (3 bulan) | 5.000.000      |
|     | **TOTAL**                       | **35.000.000** |

### Opsi Tambahan:

- Server Cloud (1 tahun): Rp 3.600.000
- SSL Certificate (1 tahun): Rp 500.000
- Extended Support (1 tahun): Rp 12.000.000

### Skema Pembayaran:

- Down Payment (30%): Rp 10.500.000
- Progress Payment (40%): Rp 14.000.000
- Final Payment (30%): Rp 10.500.000

---

## 10. GARANSI & SUPPORT

**Garansi 3 Bulan:**

- Bug fixing gratis
- Update minor version
- Technical support

**Support Channel:**

- Email: support@sibt.com
- WhatsApp: +62xxx-xxxx-xxxx
- Remote assistance

**SLA:**

- Critical Issue: Response 4 jam, resolve 24 jam
- Major Issue: Response 8 jam, resolve 48 jam
- Minor Issue: Response 24 jam, resolve 72 jam

---

## 11. CONTACT INFORMATION

**PT. [Nama Perusahaan Anda]**

**Contact Person:**  
Nama: [Nama Anda]  
Jabatan: Project Manager  
Telp: +62xxx-xxxx-xxxx  
Email: [email@perusahaan.com]

**Jam Operasional:**  
Senin - Jumat: 08.00 - 17.00 WIB

---

## PENUTUP

Kami siap berkontribusi dalam modernisasi sistem administrasi BPN melalui SIBT. Terima kasih atas kepercayaan yang diberikan.

Hormat kami,

**[Nama Anda]**  
**[Jabatan]**  
**PT. [Nama Perusahaan]**

---

_Proposal berlaku 30 hari | Tanggal: 24 Januari 2026_
