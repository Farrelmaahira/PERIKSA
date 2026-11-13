import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Universal DatePicker and Calendar System', () => {
  const srcDir = path.resolve(import.meta.dirname, '../')

  it('DatePicker component file should exist with dialog or calendar accessibility', () => {
    const datePickerContent = fs.readFileSync(path.join(srcDir, 'components/atoms/DatePicker.tsx'), 'utf-8')
    expect(datePickerContent).toContain('role="dialog"')
    expect(datePickerContent).toContain('aria-label')
    expect(datePickerContent).toContain('min')
    expect(datePickerContent).toContain('max')
  })

  it('BuatKontrakJawaban should utilize the universal DatePicker component', () => {
    const buatKontrakContent = fs.readFileSync(path.join(srcDir, 'components/organisms/BuatKontrakJawaban.tsx'), 'utf-8')
    expect(buatKontrakContent).toContain("import DatePicker from '@/components/atoms/DatePicker'")
    expect(buatKontrakContent).toContain('<DatePicker')
    expect(buatKontrakContent).toContain('min={daysFromNow(1)}')
  })
})
