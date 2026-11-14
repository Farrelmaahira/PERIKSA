import type { CounterpartyResponse } from '@/lib/api/contracts'
import type { Counterparty, CounterpartyType } from '@/interfaces/master'

const TYPES: Record<string, CounterpartyType> = { umkm: 'UMKM', bumdes: 'BUMDes', penerima_hibah: 'Penerima hibah', penyewa: 'Penyewa' }

/* Maps a backend counterparty to the store shape and preserves the provider account email. */
export function toCounterparty(c: CounterpartyResponse): Counterparty {
  return {
    id: String(c.id),
    name: c.nama,
    type: TYPES[c.jenis?.toLowerCase() ?? ''] ?? 'Penyedia',
    email: c.email ?? '',
    contact: c.nama,
    address: c.alamat || '-',
    invited: false,
  }
}
