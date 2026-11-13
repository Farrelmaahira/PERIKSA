import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Contract AI Summary System', () => {
  const srcDir = path.resolve(import.meta.dirname, '../')

  it('ContractAiSummary component should exist with clean badge and summarize action', () => {
    const content = fs.readFileSync(path.join(srcDir, 'components/molecules/ContractAiSummary.tsx'), 'utf-8')
    expect(content).toContain('Ringkasan AI')
    expect(content).toContain('Ringkas kontrak dengan AI')
    expect(content).toContain('Ringkasan Bahasa Warga')
    // Ensure no emojis/emotes in the UI
    expect(content).not.toContain('✦')
    expect(content).not.toContain('✨')
  })

  it('ContractDetail should integrate ContractAiSummary', () => {
    const detailContent = fs.readFileSync(path.join(srcDir, 'components/organisms/ContractDetail.tsx'), 'utf-8')
    expect(detailContent).toContain('ContractAiSummary')
    expect(detailContent).toContain('<ContractAiSummary c={c} />')
  })
})
