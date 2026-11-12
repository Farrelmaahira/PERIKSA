# PERIKSA (Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel)

**PERIKSA** adalah platform kontrak digital cerdas dan akuntabel yang dirancang untuk membantu pemerintah desa, UMKM, dan penyedia jasa menyusun, mengaudit, menandatangani, serta mengawasi perjanjian kontrak kerja sama secara transparan, sah menurut hukum, dan anti-pemalsuan.

---

## 🚀 Alur Kerja Utama

1. **Kuisioner Cerdas (Smart Q&A):** Pengguna menjawab pertanyaan terpandu untuk menentukan parameter kontrak.
2. **Penyusunan & Audit Kontrak Berbasis AI:** AI menyusun draf perjanjian sesuai template hukum dan mengaudit kelengkapan klausul wajib serta potensi risiko klausul liar.
3. **Peninjauan Kolaboratif & Persetujuan:** Kontrak ditinjau oleh kedua belah pihak (Desa & Penyedia) dengan fitur catatan dan revisi transparan.
4. **Tanda Tangan Elektronik & e-Meterai:** Penandatanganan kontrak digital yang sah berkekuatan hukum.
5. **Segel Integritas Kriptografis (Audit Trail):** Pencatatan hash dokumen (SHA-256) untuk menjamin deteksi instan terhadap setiap perubahan atau pemalsuan pasca-penandatanganan.
6. **Penerbitan Kontrak Publik (Redaksi Data Pribadi/PII):** Kontrak dapat dipublikasikan untuk transparansi publik setelah informasi sensitif (PII) disaring dan disamarkan secara otomatis oleh modul AI.
7. **Pengawasan Warga & Kanal Pelaporan:** Warga masyarakat dapat memantau progres pelaksanaan di lapangan dan mengirimkan laporan pengaduan jika terjadi ketidaksesuaian.

---

## 📂 Struktur Repositori (Monorepo)

```text
periksa/
├── frontend/    # Antarmuka web pengguna (Next.js 16, React 19, TypeScript, Tailwind CSS)
├── backend/     # API Gateway & Core Business Logic (Golang 1.23, PostgreSQL, Redis, gRPC Client)
├── ai-engine/   # Layanan Cerdas LLM & NLP (Python 3.10+, FastAPI, gRPC Server, Google Gemini)
├── proto/       # Definisi Kontrak Komunikasi Antar-Layanan (Protocol Buffers / gRPC)
└── docs/        # Dokumentasi arsitektur, PRD, Postman collection, dan Panduan Migrasi Tim
```

---

## 🌿 Strategi Branching Tim

Repositori ini menggunakan strategi branch berbasis fitur untuk masing-masing domain tim:

| Branch | Deskripsi / PIC | Lokasi Kerja |
| :--- | :--- | :--- |
| `main` | Production-ready boilerplate, konfigurasi root, dan kontrak global | Root, `proto/`, `docs/` |
| `feat/frontend` | Implementasi antarmuka pengguna web | `frontend/` |
| `feat/backend` | Implementasi backend REST API, PostgreSQL, Redis, dan integrasi | `backend/` |
| `feat/ai-engine` | Implementasi engine AI, chain LLM, PII redaction, dan gRPC server | `ai-engine/` |

---

## 🛠️ Memulai Cepat (Quickstart)

### Menggunakan Docker Compose
```bash
# Jalankan seluruh stack (Database, Cache, Backend, AI Engine, Frontend)
docker compose up --build
```

Layanan lokal akan berjalan pada:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **AI Engine (REST / Docs)**: http://localhost:8000/docs
- **AI Engine (gRPC)**: localhost:50051
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
