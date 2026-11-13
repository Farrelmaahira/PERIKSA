'use client'

import { useState } from 'react'
import Badge from '@/components/atoms/Badge'
import Btn from '@/components/atoms/Btn'
import type { SealedContract } from '@/interfaces/contract'
import { formatRp } from '@/lib/contracts/format-rp'

interface Props {
  c: SealedContract
}

interface SummaryPoints {
  lead: string
  items: Array<{ title: string; desc: string }>
}

interface SummarizeResponse extends SummaryPoints {
  model: string
}

/* Dipakai bila ai-engine tidak dapat dihubungi, supaya warga tetap mendapat ringkasan. */
function localSummary(c: SealedContract): SummaryPoints {
  const isPengadaan = c.type.toLowerCase().includes('barang') || c.title.toLowerCase().includes('pengadaan') || c.title.toLowerCase().includes('belanja')
  const isKonstruksi = c.type.toLowerCase().includes('konstruksi') || c.title.toLowerCase().includes('pembangunan') || c.title.toLowerCase().includes('rehabilitasi')

  const lead = `Kontrak ini mengatur pelaksanaan kegiatan ${c.title.toLowerCase()} oleh ${c.second} untuk ${c.first} dengan alokasi anggaran ${formatRp(c.value)}.`

  const items: SummaryPoints['items'] = []

  if (isPengadaan) {
    items.push({
      title: 'Ruang Lingkup',
      desc: `Penyedia (${c.second}) berkewajiban menyerahkan barang/perlengkapan sesuai spesifikasi yang disetujui dalam dokumen pengadaan.`,
    })
  } else if (isKonstruksi) {
    items.push({
      title: 'Pekerjaan Fisik',
      desc: `Penyedia (${c.second}) bertanggung jawab melaksanakan pembangunan fisik sesuai gambar teknis dan rencana anggaran biaya (RAB).`,
    })
  } else {
    items.push({
      title: 'Pekerjaan Utama',
      desc: `Pelaksanaan pekerjaan sesuai pasal-pasal teknis dan spesifikasi pada lampiran kontrak.`,
    })
  }

  items.push({
    title: 'Biaya & Termin',
    desc: `Total nilai pekerjaan sebesar ${formatRp(c.value)}. Pembayaran dilakukan secara bertahap sesuai capaian progres fisik dan verifikasi dokumen.`,
  })

  items.push({
    title: 'Waktu & Garansi',
    desc: `Pekerjaan diselesaikan ${c.duration.toLowerCase()}. Penyedia wajib memberikan masa pemeliharaan/retensi selama 90 hari kalender setelah serah terima pekerjaan.`,
  })

  items.push({
    title: 'Integritas Dokumen',
    desc: `Kontrak ini telah diverifikasi dan disegel secara kriptografis menggunakan sidik digital SHA-256 untuk mencegah manipulasi data.`,
  })

  return { lead, items }
}

function toPayload(c: SealedContract) {
  return {
    judul: c.title,
    jenis: c.type,
    nilai: c.value,
    tenggat: c.duration,
    pihak_pertama: c.first,
    pihak_kedua: c.second,
    isi_teks: c.clauses.map((clause) => `${clause.title}\n${clause.text}`).join('\n\n'),
  }
}

function isSummarizeResponse(value: unknown): value is SummarizeResponse {
  if (!value || typeof value !== 'object') return false
  const v = value as { lead?: unknown; items?: unknown }
  if (typeof v.lead !== 'string' || !v.lead.trim() || !Array.isArray(v.items) || !v.items.length) {
    return false
  }
  return v.items.every((item) => {
    if (!item || typeof item !== 'object') return false
    const it = item as { title?: unknown; desc?: unknown }
    return typeof it.title === 'string' && typeof it.desc === 'string'
  })
}

export default function ContractAiSummary({ c }: Props) {
  const [summary, setSummary] = useState<SummaryPoints | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('')

  const isGenerated = summary !== null

  const handleSummarize = async () => {
    setIsLoading(true)
    setNotice('')
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(c)),
      })
      const data: unknown = await res.json().catch(() => null)
      if (!res.ok || !isSummarizeResponse(data)) {
        throw new Error('ringkasan tidak tersedia')
      }
      setSummary({ lead: data.lead, items: data.items })
    } catch {
      setSummary(localSummary(c))
      setNotice('Layanan AI belum dapat dihubungi. Ringkasan sementara disusun dari aturan lokal.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border-[0.15rem] border-line border-solid rounded-[1.6rem] p-24 mt-20 flex flex-col gap-16">
      <div className="flex items-center justify-between gap-12 flex-wrap">
        <div className="flex items-center gap-10">
          <Badge tone="blue">Ringkasan AI</Badge>
          <span className="text-[1.5rem] font-[450] text-ink">Ringkasan Bahasa Warga</span>
        </div>
        {!isGenerated && (
          <Btn small variant="primary" onClick={handleSummarize} disabled={isLoading}>
            {isLoading ? 'Menganalisis draf…' : 'Ringkas kontrak dengan AI'}
          </Btn>
        )}
        {isGenerated && (
          <Btn small variant="ghost" onClick={handleSummarize} disabled={isLoading}>
            {isLoading ? 'Menyegarkan…' : 'Segarkan ringkasan'}
          </Btn>
        )}
      </div>

      {!isGenerated && !isLoading && (
        <p className="text-[1.4rem] leading-[1.5] text-dim">
          Klik tombol di atas untuk merangkum seluruh klausul hukum kontrak ini ke dalam penjelasan bahasa awam yang ringkas dan mudah dipahami warga.
        </p>
      )}

      {isLoading && (
        <div className="py-20 flex flex-col gap-8">
          <div className="h-16 bg-soft rounded-[0.6rem] w-3/4 animate-pulse" />
          <div className="h-14 bg-soft rounded-[0.6rem] w-full animate-pulse" />
          <div className="h-14 bg-soft rounded-[0.6rem] w-5/6 animate-pulse" />
        </div>
      )}

      {isGenerated && !isLoading && (
        <div className="flex flex-col gap-16 pt-6 border-t border-line border-solid">
          <p className="text-[1.5rem] leading-[1.55] text-ink font-[400]">{summary.lead}</p>
          <div className="grid gap-12 sm:grid-cols-2">
            {summary.items.map((it) => (
              <div key={it.title} className="bg-soft rounded-[1.2rem] p-16 flex flex-col gap-4">
                <span className="text-[1.2rem] font-[500] uppercase tracking-[0.04em] text-dim">{it.title}</span>
                <p className="text-[1.4rem] leading-[1.45] text-ink">{it.desc}</p>
              </div>
            ))}
          </div>
          {notice && <p className="text-[1.3rem] leading-[1.5] text-red">{notice}</p>}
          <p className="text-[1.2rem] text-dim">
            Ringkasan disusun otomatis oleh sistem analisis AI PERIKSA berdasarkan klausul yang diterbitkan. Naskah kontrak asli tetap menjadi rujukan hukum yang mengikat.
          </p>
        </div>
      )}
    </div>
  )
}
