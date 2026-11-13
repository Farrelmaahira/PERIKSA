import json

from fastapi.testclient import TestClient

from app import llm
from app.main import app
from support import fake

client = TestClient(app)
BODY = {
    "judul": "Pembangunan Jalan Desa Utama",
    "jenis": "pembangunan",
    "nilai": 350_000_000,
    "tenggat": "2026-12-31",
    "pihak_pertama": "Pemerintah Desa Sukamaju",
    "pihak_kedua": "CV Maju Bersama",
    "isi_teks": "Pasal 1: pekerjaan jalan desa sepanjang 1,2 km.",
}
H = {"X-API-Key": "test-key"}
GOOD = json.dumps(
    {
        "lead": "Pembangunan jalan desa oleh CV Maju Bersama.",
        "items": [
            {"title": "Ruang Lingkup", "desc": "Jalan sepanjang 1,2 km."},
            {"title": "Biaya & Termin", "desc": "Rp350.000.000 dibayar bertahap."},
        ],
    }
)


def test_rejects_missing_key():
    assert client.post("/v1/summarize", json=BODY).status_code == 401


def test_uses_llm_chain(monkeypatch):
    monkeypatch.setattr(llm, "call_provider", fake({"groq": GOOD}))
    r = client.post("/v1/summarize", json=BODY, headers=H).json()
    assert r["model"] == "groq:test"
    assert r["items"][0] == {"title": "Ruang Lingkup", "desc": "Jalan sepanjang 1,2 km."}


def test_deterministic_fallback_without_provider(monkeypatch):
    monkeypatch.setattr(llm, "chain", lambda: [])
    r = client.post("/v1/summarize", json=BODY, headers=H).json()
    assert r["model"] == "periksa:rule-engine"
    assert "Rp350.000.000" in r["lead"]
    assert len(r["items"]) == 4


def test_invalid_output_uses_deterministic_fallback(monkeypatch):
    monkeypatch.setattr(llm, "call_provider", fake({"groq": "bukan json", "gemini": "{}"}))
    r = client.post("/v1/summarize", json=BODY, headers=H).json()
    assert r["model"] == "periksa:rule-engine"
    assert r["items"]


def test_rejects_oversized_contract_text():
    body = {**BODY, "isi_teks": "x" * 12_001}
    assert client.post("/v1/summarize", json=body, headers=H).status_code == 422
