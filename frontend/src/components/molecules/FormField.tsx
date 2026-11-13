import type { ReactNode } from 'react'
import ErrorText from '@/components/atoms/ErrorText'
import { cn } from '@/lib/utils'

// full class names on purpose: Tailwind only generates classes it can read literally from the source
const FIELD = [
  'border-0 border-none grid gap-6 min-w-0',
  '[&>:is(span,legend)]:text-[1.25rem] [&>:is(span,legend)]:tracking-[0.04em] [&>:is(span,legend)]:text-dim [&>:is(span,legend)]:uppercase [&>legend]:mb-6',
  '[&_:is(input,select,textarea)]:bg-white [&_:is(input,select,textarea)]:border-[0.15rem] [&_:is(input,select,textarea)]:border-[#d6d6d2] [&_:is(input,select,textarea)]:border-solid [&_:is(input,select,textarea)]:rounded-[1.2rem] [&_:is(input,select,textarea)]:text-ink [&_:is(input,select,textarea)]:text-[1.5rem]',
  '[&_:is(input,select,textarea)]:min-h-48 [&_:is(input,select,textarea)]:[outline:none] [&_:is(input,select,textarea)]:py-10 [&_:is(input,select,textarea)]:px-14 [&_:is(input,select,textarea)]:w-full [&_:is(input,select,textarea)]:[transition:border-color_0.2s,_box-shadow_0.2s]',
  '[&_:is(input,select,textarea):focus]:border-blue [&_:is(input,select,textarea):focus]:ring-4 [&_:is(input,select,textarea):focus]:ring-blue/15 [&_:is(input,select,textarea):focus]:outline-none',
  '[&_textarea]:leading-[1.5] [&_textarea]:resize-y',
  '[&_select]:appearance-none [&_select]:cursor-pointer [&_select]:bg-[url("data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_fill=\'none\'_viewBox=\'0_0_24_24\'_stroke=\'%235c5c66\'_stroke-width=\'2\'%3E%3Cpath_stroke-linecap=\'round\'_stroke-linejoin=\'round\'_d=\'M19_9l-7_7-7-7\'%3E%3C/path%3E%3C/svg%3E")] [&_select]:bg-[position:right_1.4rem_center] [&_select]:bg-no-repeat [&_select]:bg-[size:1.6rem_1.6rem] [&_select]:pr-44 [&_select]:text-ellipsis',
].join(' ')

interface Props {
  label: string
  error?: string
  /* fieldset + legend for a group of buttons instead of a label around one control */
  group?: boolean
  /* keep the label for screen readers only */
  hideLabel?: boolean
  className?: string
  children: ReactNode
}

/* Labelled form control (input, select, textarea) with the dashboard field look and an error line */
export default function FormField({ label, error, group, hideLabel, className, children }: Props) {
  const Tag = group ? 'fieldset' : 'label'
  const Title = group ? 'legend' : 'span'
  return (
    <Tag className={cn(FIELD, className)}>
      <Title className={hideLabel ? 'sr-only' : undefined}>{label}</Title>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </Tag>
  )
}
