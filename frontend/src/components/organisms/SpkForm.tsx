import Btn from '@/components/atoms/Btn'
import DatePicker from '@/components/atoms/DatePicker'
import ErrorText from '@/components/atoms/ErrorText'
import FormAlert from '@/components/atoms/FormAlert'
import Hint from '@/components/atoms/Hint'
import FormField from '@/components/molecules/FormField'
import type { useSpkForm } from '@/hooks/use-spk-form'
import type { DContract } from '@/interfaces/db'

interface Props {
  c: DContract
  spk: ReturnType<typeof useSpkForm>
}

/* Number and dates of the SPK, with the button to issue or save it */
export default function SpkForm({ c, spk }: Props) {
  const { form } = spk
  return (
    <>
      <div className="grid gap-16 md:grid-cols-[repeat(2,minmax(0,1fr))]">
        <FormField label="Nomor SPK">
          <input value={form.number} onChange={(e) => spk.set({ number: e.target.value })} />
        </FormField>
        <FormField label="Tanggal SPK">
          <DatePicker value={form.date} onChange={(val: string) => spk.set({ date: val })} />
        </FormField>
        <FormField label="Mulai bekerja">
          <DatePicker value={form.start} onChange={(val: string) => spk.set({ start: val })} />
        </FormField>
        <FormField label="Selesai paling lambat">
          <DatePicker value={form.end} onChange={(val: string) => spk.set({ end: val })} />
        </FormField>
      </div>
      {spk.error && <ErrorText as="p">{spk.error}</ErrorText>}
      {spk.serverError && <FormAlert>{spk.serverError}</FormAlert>}
      <div className="items-center flex flex-wrap gap-10">
        <Btn onClick={spk.save} disabled={spk.busy}>{spk.busy ? 'Menyimpan…' : c.spk ? 'Simpan perubahan' : 'Terbitkan SPK'}</Btn>
        {c.spk && <Btn variant="ghost" onClick={spk.cancel}>Batal</Btn>}
      </div>
      {c.status === 'ditandatangani' && <Hint className="text-[1.25rem]">Kontrak belum dipublikasikan. Status berubah menjadi Berjalan setelah publikasi.</Hint>}
    </>
  )
}
