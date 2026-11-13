"use client"

import { useMemo } from 'react'
import Bar from '@/components/atoms/Bar'
import type { SealedContract } from '@/interfaces/contract'

interface Props {
  registry: SealedContract[]
  active: string | null
  onPick: (village: string | null) => void
}

interface VillageRecap {
  name: string
  total: number
  count: number
  sealed: number
  avgProgress: number
}

const recap = (registry: SealedContract[]): VillageRecap[] => {
  const map = new Map<string, VillageRecap & { progressSum: number }>()
  for (const c of registry) {
    let v = map.get(c.village)
    if (!v) {
      v = { name: c.village, total: 0, count: 0, sealed: 0, avgProgress: 0, progressSum: 0 }
      map.set(c.village, v)
    }
    v.total += c.value
    v.count += 1
    v.progressSum += c.progress
    if (c.hash) v.sealed += 1
  }
  return [...map.values()]
    .map(({ progressSum, ...v }) => ({ ...v, avgProgress: v.count ? Math.round(progressSum / v.count) : 0 }))
    .sort((a, b) => b.total - a.total)
}

const shortRp = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} jt`
  return n.toLocaleString('id-ID')
}

export default function VillageFilterSection({ registry, active, onPick }: Props) {
  const villages = useMemo(() => recap(registry), [registry])
  if (villages.length < 2) return null

  return (
    <section className="bg-soft py-100 px-0 lg:py-140 lg:px-0" id="per-desa">
      <div className="my-0 mx-auto max-w-1680 py-0 px-20 relative w-full md:py-0 md:px-40 lg:py-0 lg:px-80 [.auth>&]:relative [.auth>&]:z-1 [.page-hero>&]:relative [.page-hero>&]:z-1 container">
        <div className="mb-60 max-w-1300 lg:mb-80">
          <p className="text-[1.4rem] font-[350] tracking-[0.01em] leading-[1.6] mb-30 uppercase text-dim md:text-[2rem] md:mb-40">
            Transparansi per desa
          </p>
          <h2 className="text-[5.2rem] font-[320] tracking-[-0.04em] leading-[1] md:text-[8rem] lg:text-[10rem]">
            Pilih desanya.
          </h2>
          <p className="text-[1.8rem] leading-[1.5] mt-30 max-w-600 lg:text-[2.2rem]">
            Rekap perjanjian yang diterbitkan lewat PERIKSA, dirangkum per desa.
            Pilih satu desa untuk menyaring daftar kontrak di atas.
          </p>
        </div>
        <div className="grid gap-y-50 gap-x-20 md:grid-cols-[1fr_1fr] lg:gap-30 lg:grid-cols-[repeat(3,1fr)]">
          {villages.map((v) => {
            const isActive = active === v.name
            return (
              <button
                key={v.name}
                type="button"
                aria-pressed={isActive}
                onClick={() => onPick(isActive ? null : v.name)}
                className={`text-left border-[0.15rem] border-solid rounded-[1.2rem] p-24 flex flex-col gap-12 min-w-0 bg-white [transition:border-color_0.2s,_box-shadow_0.2s,_transform_0.2s] hover:[box-shadow:0.3rem_0.3rem_0_var(--color-blue)] ${
                  isActive ? 'border-blue [box-shadow:0.3rem_0.3rem_0_var(--color-blue)]' : 'border-line'
                }`}
              >
                <p className="text-[1.2rem] uppercase tracking-[0.06em] text-dim">{v.name}</p>
                <p className="text-[4.2rem] font-[300] tracking-[-0.04em] leading-[1] [&_small]:text-[0.45em] [&_small]:tracking-0 [&_small]:opacity-80">
                  <small>Rp</small>
                  {shortRp(v.total)}
                </p>
                <p className="text-[1.4rem] text-dim">
                  {v.count} perjanjian · {v.sealed} tersegel
                </p>
                <div className="flex items-center gap-10">
                  <Bar value={v.avgProgress} />
                  <p className="text-[1.4rem] font-[400] leading-none shrink-0">{v.avgProgress}%</p>
                </div>
                <p className={`text-[1.4rem] font-[450] mt-auto ${isActive ? 'text-deep' : 'text-blue'}`}>
                  {isActive ? 'Dipilih — tampilkan semua desa' : 'Tampilkan kontrak desa ini →'}
                </p>
              </button>
            )
          })}
        </div>
        <p className="text-[1.3rem] text-dim mt-50 max-w-520">
          Angka mencakup perjanjian dengan penyedia yang diterbitkan lewat
          PERIKSA; kegiatan swakelola belum termasuk, dan nilai kontrak bukan
          realisasi belanja.
        </p>
      </div>
    </section>
  )
}
