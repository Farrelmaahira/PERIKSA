import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('UI and Components Layout Specification', () => {
  const srcDir = path.resolve(import.meta.dirname, '../')

  it('Navbar should contain PERIKSA brand and full acronym caption', () => {
    const navbarContent = fs.readFileSync(path.join(srcDir, 'components/organisms/Navbar.tsx'), 'utf-8')
    expect(navbarContent).toContain('PERIKSA')
    expect(navbarContent).toContain('Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel')
  })

  it('Footer should contain PERIKSA branding', () => {
    const footerContent = fs.readFileSync(path.join(srcDir, 'components/organisms/Footer.tsx'), 'utf-8')
    expect(footerContent).toContain('periksa')
  })

  it('HomeHero should reference PERIKSA and correct acronym', () => {
    const heroContent = fs.readFileSync(path.join(srcDir, 'components/organisms/HomeHero.tsx'), 'utf-8')
    expect(heroContent).toContain('PERIKSA')
    expect(heroContent).toContain('Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel')
  })

  it('Logo component should reference periksa logo', () => {
    const logoContent = fs.readFileSync(path.join(srcDir, 'components/atoms/Logo.tsx'), 'utf-8')
    expect(logoContent).toContain('periksa')
  })

  it('Root layout and site metadata should have PERIKSA title template and metadata', () => {
    const layoutContent = fs.readFileSync(path.join(srcDir, 'app/layout.tsx'), 'utf-8')
    expect(layoutContent).toContain('SITE_TITLE')
    expect(layoutContent).toContain('SITE_NAME')

    const siteContent = fs.readFileSync(path.join(srcDir, 'data/site.ts'), 'utf-8')
    expect(siteContent).toContain('PERIKSA')
    expect(siteContent).toContain('Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel')
  })
})
