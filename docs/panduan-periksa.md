# Panduan PERIKSA

PERIKSA adalah aplikasi untuk membantu desa, penyedia, dan warga mengelola kontrak secara lebih tertib dan transparan. Pengguna dapat membuat draf kontrak, meminta pemeriksaan berbantuan AI, menyimpan riwayat perubahan, mengirim kontrak untuk ditinjau, dan memantau laporan warga.

Dokumen ini menjelaskan cara menjalankan aplikasi, cara mencoba fitur utama, hasil pengujian terakhir, API yang tersedia, serta susunan layanan yang dipakai di production.

## Demo langsung

Frontend production:

<https://periksaid.vercel.app>

API backend:

<https://periksa-backend.azurewebsites.net>

Health check:

<https://periksa-backend.azurewebsites.net/healthz>

Readiness check:

<https://periksa-backend.azurewebsites.net/readyz>

Akun demo:

| Akun | Password | Keterangan |
|---|---|---|
| `tester@periksa.id` | `periksa123` | Akun dengan beberapa role untuk mencoba alur aplikasi |
| `kades@periksa.id` | `periksa123` | Kepala desa |
| `penyedia@periksa.id` | `periksa123` | Penyedia |
| `warga@periksa.id` | `periksa123` | Warga |
| `bpd@periksa.id` | `periksa123` | BPD |
| `inspektorat@periksa.id` | `periksa123` | Inspektorat |

Akun tersebut hanya untuk demo dan pengujian. Jangan digunakan sebagai akun operasional.

## Cara instalasi

### Pilihan pertama, memakai Docker Compose

Pastikan Docker Desktop sudah terpasang, lalu jalankan:

```bash
git clone https://github.com/Farrelmaahira/PERIKSA.git
cd PERIKSA
docker compose up --build
```

Alamat layanan lokal:

| Layanan | Alamat |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:8080` |
| AI engine | `http://localhost:8000` |
| PostgreSQL lokal | `localhost:5432` |
| Redis lokal | `localhost:6379` |

Compose membaca konfigurasi utama dari `.env` root. Backend memakai `backend/.env`, AI engine memakai `.env` root, dan frontend memakai `frontend/.env.local`.

Untuk memakai PostgreSQL dan Redis lokal, jalankan profil database:

```bash
docker compose --profile local-db up --build
```

Jika backend diarahkan ke PostgreSQL Azure, IP publik laptop harus diizinkan terlebih dahulu di firewall PostgreSQL Azure.

### Pilihan kedua, menjalankan frontend saja

Frontend bisa dijalankan di laptop dan tetap memakai API production:

```bash
cd frontend
npm install
npm run dev
```

Nilai `NEXT_PUBLIC_API_URL` pada `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://periksa-backend.azurewebsites.net/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Menjalankan backend tanpa Docker

```bash
cd backend
go mod download
go run ./cmd/api
```

Backend membutuhkan PostgreSQL dan, bila digunakan, Redis. Nilai koneksinya disimpan di `backend/.env`.

### Menjalankan AI engine tanpa Docker

```bash
cd ai-engine
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --env-file .env
```

`AI_API_KEY` harus sama antara backend dan AI engine. API key provider LLM tidak boleh dimasukkan ke Git.

## Alur mencoba aplikasi

1. Buka frontend dan masuk menggunakan akun demo.
2. Pilih role jika memakai akun tester.
3. Buka dashboard untuk melihat metrik, kontrak, notifikasi, dan jejak audit.
4. Buat draf kontrak melalui wizard.
5. Isi jawaban yang diminta, lalu buat preview.
6. Jalankan audit kontrak untuk melihat klausul yang kurang atau berisiko.
7. Simpan draf, kirim untuk ditinjau, dan lanjutkan ke alur persetujuan.
8. Untuk melihat fitur warga, masuk sebagai warga lalu buat laporan.
9. Buka halaman publik untuk memeriksa kontrak atau segel yang sudah diterbitkan.

## Hasil pengujian

Pengujian berikut dijalankan pada 14 November 2026.

| Bagian | Hasil |
|---|---|
| Frontend Vitest | 9 file test, 23 test berhasil |
| Backend unit dan handler test | Berhasil |
| Backend test yang membutuhkan PostgreSQL lokal | Belum dapat dijalankan karena PostgreSQL lokal tidak aktif |
| AI engine test | Belum dijalankan pada laptop ini karena `pytest` belum tersedia |
| Backend production `/healthz` dan `/readyz` | HTTP 200 |
| Login tester production | HTTP 200 |
| API terproteksi: profil, dashboard, kontrak, laporan, notifikasi | HTTP 200 |
| API publik: kontrak publik dan verifikasi segel | HTTP 200 |
| Login akun demo kades, penyedia, inspektorat, dan warga | HTTP 200 |
| `GET /audit-logs` dengan role kades, penyedia, dan inspektorat | HTTP 200 |
| `GET /audit-logs` dengan role warga | HTTP 403 sesuai pembatasan role |
| AI engine production `/healthz` | HTTP 200 |
| CORS `https://periksaid.vercel.app` | Berhasil |

Test backend yang membutuhkan database bukan berarti implementasinya gagal. Test tersebut berhenti karena tidak menemukan PostgreSQL di `localhost:5432`. Jalankan PostgreSQL lokal atau gunakan profil Docker `local-db` sebelum mengulang test tersebut.

Perintah pengujian:

```bash
cd frontend
npm test -- --run

cd ../backend
go test ./...

cd ../ai-engine
python3 -m pytest -q
```

## API

Base URL production:

```text
https://periksa-backend.azurewebsites.net/api/v1
```

Untuk request yang membutuhkan login, kirim token seperti ini:

```http
Authorization: Bearer <token>
```

Token diperoleh dari `POST /auth/login`. Contoh login:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "tester@periksa.id",
  "password": "periksa123"
}
```

Kelompok endpoint yang tersedia:

| Kelompok | Endpoint utama | Kegunaan |
|---|---|---|
| Kesehatan | `GET /healthz`, `GET /readyz` | Memeriksa service dan koneksi database |
| Autentikasi | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` | Registrasi, login, dan profil |
| Profil | `PUT /auth/me`, `POST /auth/password/change` | Mengubah data akun dan password |
| Dashboard | `GET /dashboard/metrics` | Ringkasan aktivitas pengguna |
| Counterparty | `GET /counterparties` | Melihat daftar penyedia atau rekanan |
| Wizard kontrak | `GET /contracts/options`, `POST /contracts/wizard/questions`, `POST /contracts/wizard/preview` | Menyiapkan draf kontrak |
| Kontrak | `GET /contracts`, `POST /contracts`, `GET /contracts/{id}`, `PUT /contracts/{id}`, `DELETE /contracts/{id}` | Mengelola kontrak |
| Audit kontrak | `POST /contracts/audit`, `POST /contracts/{id}/audit`, `GET /contracts/{id}/audit/latest` | Memeriksa isi kontrak |
| Siklus kontrak | `GET /contracts/{id}/lifecycle`, `POST /contracts/{id}/send`, `POST /contracts/{id}/reviews`, `POST /contracts/{id}/sign` | Menjalankan proses review dan tanda tangan |
| Termin | `GET /termin`, `GET /contracts/{id}/termin`, `PUT /contracts/{id}/termin`, `POST /contracts/{id}/progress` | Mengatur pembayaran dan progres |
| Laporan warga | `POST /reports`, `GET /reports`, `GET /reports/{id}`, `GET /reports/{id}/actions`, `POST /reports/{id}/actions` | Membuat dan menindaklanjuti laporan |
| Notifikasi | `GET /notifications`, `POST /notifications/{id}/read`, `POST /notifications/read-all` | Melihat dan membaca notifikasi |
| Jejak audit | `GET /audit-logs` | Melihat riwayat tindakan |
| Segel | `GET /seals`, `GET /public/seals/verify` | Melihat dan memeriksa integritas dokumen |
| Publik | `GET /public/contracts`, `GET /public/contracts/{id}` | Melihat kontrak yang sudah diterbitkan |
| Admin | `/admin/region-rules`, `/admin/pengawas`, `/admin/oversight-assignments` | Pengaturan pengawasan daerah |

Koleksi Postman lengkap tersedia di `docs/periksa-api.postman_collection.json`. Variabel yang dipakai adalah `baseUrl` dan `authToken`. Login memiliki test script untuk menyimpan token secara otomatis.

## AI yang digunakan

AI engine dipisahkan dari backend agar pemrosesan kontrak tidak bercampur dengan aturan bisnis utama.

Provider yang sudah didukung:

1. Google Gemini melalui `GEMINI_API_KEY`
2. Groq melalui `GROQ_API_KEY`

Urutan model diatur melalui `AI_PROVIDERS`. Sistem mencoba model secara berurutan dan berpindah ke model berikutnya jika model sebelumnya sedang penuh, timeout, menolak format, atau menghasilkan jawaban yang tidak lolos validasi.

AI dipakai untuk membantu tiga hal:

1. Menyusun draf pasal dari jawaban wizard.
2. Memberi saran pada audit bahasa dan potensi risiko.
3. Membantu menyamarkan data pribadi sebelum kontrak dipublikasikan.

Pemeriksaan penting tetap dilakukan oleh kode, bukan diserahkan sepenuhnya kepada AI. Misalnya klausul wajib yang hilang, dasar hukum yang tidak dikenal, dan kolom kontrak yang masih kosong. Jika seluruh provider gagal, sistem mengembalikan error dan tidak membuat hasil seolah-olah berhasil.

Komunikasi backend dengan AI engine memakai gRPC. REST `/v1/audit` tetap tersedia sebagai jalur cadangan.

## Server dan deployment

Deployment production memakai layanan Azure berikut:

| Komponen | Layanan |
|---|---|
| Frontend | Vercel |
| Backend API | Azure App Service Linux |
| AI engine | Azure Container Instances |
| Database | Azure Database for PostgreSQL Flexible Server |
| Image registry | Azure Container Registry |
| File storage | Azure Storage Account |
| CI/CD | GitHub Actions dengan Azure OIDC |

Frontend hanya memanggil backend melalui `NEXT_PUBLIC_API_URL`. Frontend tidak mengakses database atau AI engine secara langsung.

Backend menggunakan port HTTP `8080`. AI engine menyediakan REST di port `8000` dan gRPC di port `50051`. Backend memakai gRPC sebagai jalur utama ke AI engine.

Alamat production:

```text
Frontend: https://periksaid.vercel.app
Backend: https://periksa-backend.azurewebsites.net
AI engine: periksa-ai-engine.eastasia.azurecontainer.io
```

Setiap push ke branch `main` yang menyentuh backend, AI engine, proto, atau infrastruktur akan memicu workflow `.github/workflows/deploy-azure.yml`.

## Template screenshot

Screenshot sebaiknya menampilkan satu alur yang utuh, bukan hanya potongan kecil. Daftar tempat screenshot dan nama file yang disarankan ada di `docs/screenshots/README.md`.

Tempat yang disarankan:

1. Halaman login
2. Dashboard utama
3. Wizard pembuatan kontrak
4. Hasil audit AI
5. Halaman jejak audit
6. Halaman laporan warga
7. Halaman kontrak publik
8. Health check API

Sebelum memasukkan screenshot, tutup atau samarkan email, nomor telepon, token, API key, dan data pribadi lainnya.

## Dokumen terkait

| Dokumen | Isi |
|---|---|
| `docs/azure-deployment.md` | Konfigurasi deployment Azure |
| `docs/ai-engine.md` | Detail AI engine dan kontrak gRPC |
| `docs/periksa-api.postman_collection.json` | Koleksi request Postman |
| `docs/PRD.md` | Kebutuhan produk |
