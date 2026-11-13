import type { Ref } from 'react'
import FormAlert from '@/components/atoms/FormAlert'
import Illustration from '@/components/atoms/Illustration'
import OpenContractCard from '@/components/molecules/OpenContractCard'
import type { SealedContract } from '@/interfaces/contract'
import { shortHash } from '@/lib/contracts/short-hash'
import ContractDetail from './ContractDetail'

interface Props {
  ref: Ref<HTMLElement>
  registry: SealedContract[]
  loading: boolean
  error?: string
  query: string
  found?: SealedContract
  onOpen: (code: string) => void
  onReport: () => void
  activeVillage?: string | null
  onClearVillage?: () => void
}

export default function TrackResults({ ref, registry, loading, error, query: q, found, onOpen, onReport, activeVillage, onClearVillage }: Props) {
  return (
    <section className="pt-80 px-0 pb-120 [scroll-margin-top:1rem] lg:pt-120 lg:px-0 lg:pb-160" ref={ref}>
      <div className="my-0 mx-auto max-w-1680 py-0 px-20 relative w-full md:py-0 md:px-40 lg:py-0 lg:px-80 [.auth>&]:relative [.auth>&]:z-1 [.page-hero>&]:relative [.page-hero>&]:z-1 container">
        {loading && <p className="text-[1.8rem] opacity-[0.6]" role="status">Memuat arsip kontrak…</p>}

        {!loading && error && <div className="mb-40"><FormAlert>{error}</FormAlert></div>}

        {!loading && !error && q && !found && (
          <div className="items-center [animation:pop_0.4s_ease-out] bg-soft rounded-[2rem] grid gap-30 mb-80 py-40 px-30 [&_img]:max-h-160 [&_h2]:text-[3.4rem] [&_h2]:font-[320] [&_h2]:tracking-[-0.03em] [&_h2]:mb-12 [&_p]:text-[1.7rem] [&_p]:leading-[1.5] [&_code]:font-code md:grid-cols-[18rem_1fr] md:p-40">
            <Illustration name="document-warning_2es6" />
            <div>
              <h2>Kontrak tidak ditemukan.</h2>
              <p>
                Tidak ada kontrak dengan kode atau hash <code>{q.length > 24 ? shortHash(q) : q}</code>. Periksa lagi penulisannya, atau pilih salah satu kontrak di bawah.
              </p>
            </div>
          </div>
        )}

        {found && <ContractDetail contract={found} onReport={onReport} />}

        <div className="open-list">
          <div className="[align-items:end] flex flex-wrap gap-20 justify-between mb-30 [&_p]:text-[1.5rem] [&_p]:opacity-[0.6]">
            <h2 className="text-[3.4rem] font-[320] tracking-[-0.035em] leading-[1.05] md:text-[4.4rem] lg:text-[5.2rem]">Kontrak terbuka</h2>
            <div className="flex items-center gap-16">
              {activeVillage && onClearVillage && (
                <button
                  type="button"
                  onClick={onClearVillage}
                  className="items-center bg-blue border-[0.1rem] border-transparent border-solid rounded-[2rem] text-white inline-flex text-[1.2rem] gap-8 leading-[1.2] py-3.5 px-10 whitespace-nowrap cursor-pointer [transition:background_0.2s] hover:bg-ink"
                  aria-label={`Hapus saringan desa ${activeVillage}`}
                >
                  {activeVillage} ✕
                </button>
              )}
              <p>{registry.length} kontrak dapat dipantau</p>
            </div>
          </div>
          <div className="grid gap-16 md:grid-cols-[1fr_1fr] lg:grid-cols-[repeat(3,1fr)]">
            {registry.map((c) => (
              <OpenContractCard key={c.code} contract={c} active={found?.code === c.code} onOpen={onOpen} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
