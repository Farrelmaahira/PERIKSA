import { describe, it, expect } from 'vitest'
import * as storageKeys from '@/data/storage-keys'
import * as authData from '@/data/auth'
import * as dashNav from '@/data/dash-nav'

describe('Brand Integrity Specification', () => {
  it('should use periksa: prefixes for general storage keys', () => {
    expect(storageKeys.SIM_KEY).toBe('periksa:sim-contracts')
    expect(storageKeys.REPORT_KEY).toBe('periksa:reports')
  })

  it('should use periksa: prefixes for auth storage keys and events', () => {
    expect(authData.SESSION_KEY).toBe('periksa:session-v2')
    expect(authData.AUTH_EVENT).toBe('periksa:auth')
    expect(authData.USERS_KEY).toBe('periksa:users-v2')
    expect(authData.TOKENS_KEY).toBe('periksa:auth-tokens')
    expect(authData.REMEMBERED_EMAIL_KEY).toBe('periksa:auth-email')
  })

  it('should use periksa: prefix for navigation storage key', () => {
    expect(dashNav.NAV_KEY).toBe('periksa:nav-collapsed')
  })

  it('should have all seed accounts using @periksa.id email domain', () => {
    for (const acc of authData.seedAccounts) {
      expect(acc.email).toMatch(/@periksa\.id$/)
    }
    for (const user of authData.seedUsers) {
      expect(user.email).toMatch(/@periksa\.id$/)
    }
  })
})
