import os
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="PERIKSA AI Engine",
    description="Layanan AI untuk Penyusunan, Audit Kepatuhan, dan Redaksi Kontrak PERIKSA",
    version="0.1.0",
)


class HealthResponse(BaseModel):
    status: str
    service: str
    platform: str


@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        service="periksa-ai-engine",
        platform="Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel",
    )


@app.get("/")
async def root():
    return {
        "message": "Selamat datang di PERIKSA AI Engine",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
