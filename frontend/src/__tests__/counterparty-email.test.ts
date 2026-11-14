import { describe, expect, it } from 'vitest'
import { toCounterparty } from '@/lib/master/to-counterparty'

describe('counterparty email mapping', () => {
  it('uses the email returned by the backend account', () => {
    const party = toCounterparty({
      id: 12,
      nama: 'PT Maju Konstruksi Desa',
      jenis: 'penyedia',
      email: 'penyedia@periksa.id',
    })

    expect(party.email).toBe('penyedia@periksa.id')
  })

  it('does not invent an email address when the backend has none', () => {
    const party = toCounterparty({
      id: 13,
      nama: 'CV Contoh',
      jenis: 'penyedia',
    })

    expect(party.email).toBe('')
  })
})
