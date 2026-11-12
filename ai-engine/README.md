# PERIKSA - AI Engine Service

Layanan AI & LLM untuk **PERIKSA** (Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel).

## 🛠️ Tech Stack
- **Framework REST:** FastAPI, Uvicorn, Pydantic v2
- **gRPC Server:** grpcio, protobuf v5
- **Model LLM:** Google Gemini via `google-genai` SDK

## 🚀 Memulai Pengembangan Lokal
```bash
python -m venv .venv
source .venv/bin/activate  # atau .venv\Scripts\activate pada Windows
pip install -r requirements.txt -r requirements-dev.txt
cp .env.example .env

# Jalankan server
python -m uvicorn app.main:app --reload --port 8000
```

Dokumentasi OpenAPI Swagger tersedia di [http://localhost:8000/docs](http://localhost:8000/docs).

> 📌 **Catatan Pengembang:**  
> Implementasi modul audit kontrak, deteksi PII, gRPC server, dan benchmark LLM dikembangkan pada branch `feat/ai-engine`.
