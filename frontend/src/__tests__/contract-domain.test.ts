import { describe, it, expect } from 'vitest'
import { contractText } from '@/lib/contracts/contract-text'
import type { Contract } from '@/interfaces/contract'

describe('Contract Domain Formatting Specification', () => {
  it('should format contract canonical text starting with PERIKSA', () => {
    const dummyContract: Contract = {
      code: 'KTR-2026-001',
      type: 'pengadaan',
      title: 'Pembangunan Jalan Usaha Tani',
      first: 'Pemerintah Desa Sukamaju',
      second: 'CV Maju Bersama',
      value: 150000000,
      duration: '60 hari kalender',
      clauses: [
        { title: 'Ruang Lingkup', text: 'Pekerjaan perkerasan jalan.' },
        { title: 'Pembayaran', text: 'Pembayaran secara termin.' },
      ],
      createdAt: '2026-01-01',
      status: 'aktif',
      version: 1,
    } as unknown as Contract

    const formatted = contractText(dummyContract)
    const lines = formatted.split('\n')
    expect(lines[0]).toBe('PERIKSA KTR-2026-001')
  })
})
