import { NextResponse } from "next/server";

const AI_ENGINE_URL = process.env.AI_ENGINE_URL ?? "http://localhost:8000";
const AI_API_KEY = process.env.AI_API_KEY ?? "";
const MAX_TEXT = 12_000;

interface SummarizePayload {
  judul: string;
  jenis: string;
  nilai: number;
  tenggat: string;
  pihak_pertama: string;
  pihak_kedua: string;
  isi_teks: string;
}

const text = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

/* Jembatan server-side ke ai-engine agar AI_API_KEY tidak pernah ikut ke browser. */
export async function POST(request: Request) {
  if (!AI_API_KEY) {
    return NextResponse.json(
      { error: "Layanan ringkasan AI belum dikonfigurasi." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Isi permintaan tidak valid." }, { status: 400 });
  }

  const payload: SummarizePayload = {
    judul: text(body.judul, 300),
    jenis: text(body.jenis, 120),
    nilai:
      typeof body.nilai === "number" && Number.isFinite(body.nilai) && body.nilai > 0
        ? body.nilai
        : 0,
    tenggat: text(body.tenggat, 120),
    pihak_pertama: text(body.pihak_pertama, 200),
    pihak_kedua: text(body.pihak_kedua, 200),
    isi_teks: text(body.isi_teks, MAX_TEXT),
  };

  if (!payload.judul) {
    return NextResponse.json({ error: "Judul kontrak wajib diisi." }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${AI_ENGINE_URL.replace(/\/+$/, "")}/v1/summarize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": AI_API_KEY,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Layanan ringkasan AI sedang tidak tersedia." },
        { status: upstream.status === 401 ? 502 : upstream.status },
      );
    }

    return NextResponse.json(await upstream.json());
  } catch {
    return NextResponse.json(
      { error: "Layanan ringkasan AI tidak dapat dihubungi." },
      { status: 502 },
    );
  }
}
