# PERIKSA - Backend Service

Layanan API Core & Business Logic untuk **PERIKSA** (Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel).

## 🛠️ Tech Stack
- **Bahasa:** Go 1.23
- **Database:** PostgreSQL (pgx/v5)
- **Cache & Rate Limit:** Redis (go-redis/v9)
- **Komunikasi Internal:** gRPC & Protocol Buffers ke AI Engine

## 🚀 Menjalankan Server Lokal
```bash
cp .env.example .env
go run ./cmd/api
```

Periksa healthcheck:
```bash
curl http://localhost:8080/health
```

> 📌 **Catatan Pengembang:**  
> Implementasi handler, model domain, repository, dan adapter dikembangkan pada branch `feat/backend`.
