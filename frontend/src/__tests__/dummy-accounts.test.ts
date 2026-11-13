import { describe, it, expect } from 'vitest'
import { seedAccounts, seedUsers, DEMO_PASSWORD } from '@/data/auth'

describe('Dummy Tester Multi-Role Account Specification', () => {
  it('should have a dedicated tester account in seedAccounts', () => {
    const testerAcc = seedAccounts.find((a) => a.email === 'tester@periksa.id')
    expect(testerAcc).toBeDefined()
    expect(testerAcc?.label).toContain('Tester')
  })

  it('should have tester user in seedUsers with all 5 distinct roles', () => {
    const testerUser = seedUsers.find((u) => u.email === 'tester@periksa.id')
    expect(testerUser).toBeDefined()
    expect(testerUser?.roles.length).toBeGreaterThanOrEqual(5)

    const roleKeys = testerUser?.roles.map((r) => r.role)
    expect(roleKeys).toContain('perangkat_desa')
    expect(roleKeys).toContain('pihak_kedua')
    expect(roleKeys).toContain('bpd')
    expect(roleKeys).toContain('inspektorat')
    expect(roleKeys).toContain('warga')
  })

  it('should use periksa123 as the default demo password', () => {
    expect(DEMO_PASSWORD).toBe('periksa123')
  })
})

