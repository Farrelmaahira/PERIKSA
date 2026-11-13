import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Universal Select and Dropdown System', () => {
  const srcDir = path.resolve(import.meta.dirname, '../')

  it('Select component file should exist with accessible combobox attributes', () => {
    const selectContent = fs.readFileSync(path.join(srcDir, 'components/atoms/Select.tsx'), 'utf-8')
    expect(selectContent).toContain('role="combobox"')
    expect(selectContent).toContain('aria-haspopup="listbox"')
    expect(selectContent).toContain('aria-expanded')
    expect(selectContent).toContain('role="listbox"')
    expect(selectContent).toContain('role="option"')
  })

  it('BuatKontrakJawaban should utilize the universal Select component', () => {
    const buatKontrakContent = fs.readFileSync(path.join(srcDir, 'components/organisms/BuatKontrakJawaban.tsx'), 'utf-8')
    expect(buatKontrakContent).toContain("import Select from '@/components/atoms/Select'")
    expect(buatKontrakContent).toContain('<Select')
    expect(buatKontrakContent).toContain('options={methods}')
  })

  it('FormField should utilize smooth focus ring instead of jagged offset block shadow', () => {
    const formFieldContent = fs.readFileSync(path.join(srcDir, 'components/molecules/FormField.tsx'), 'utf-8')
    expect(formFieldContent).toContain('ring-blue/15')
    expect(formFieldContent).not.toContain('[box-shadow:0.3rem_0.3rem_0_var(--color-blue)]')
  })
})

