import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Public Brand Assets Specification', () => {
  const publicDir = path.resolve(import.meta.dirname, '../../public')

  it('periksa_logo_klasik.svg should exist and have title PERIKSA', () => {
    const svgPath = path.join(publicDir, 'periksa_logo_klasik.svg')
    expect(fs.existsSync(svgPath)).toBe(true)
    const content = fs.readFileSync(svgPath, 'utf-8')
    expect(content).toContain('PERIKSA logo klasik')
  })

  it('logo_periksa.png should exist in public directory', () => {
    const pngPath = path.join(publicDir, 'logo_periksa.png')
    expect(fs.existsSync(pngPath)).toBe(true)
  })
})
