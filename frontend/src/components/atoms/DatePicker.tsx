'use client'

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

export interface DatePickerProps {
  value?: string // YYYY-MM-DD
  defaultValue?: string
  onChange?: (value: string) => void
  min?: string // YYYY-MM-DD
  max?: string // YYYY-MM-DD
  placeholder?: string
  disabled?: boolean
  error?: boolean | string
  name?: string
  id?: string
  className?: string
  triggerClassName?: string
  popoverClassName?: string
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

function parseISODate(iso?: string): Date | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return isNaN(date.getTime()) ? null : date
}

function toISODate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatIndonesianDisplay(iso?: string): string {
  const d = parseISODate(iso)
  if (!d) return ''
  const day = d.getDate()
  const monthName = MONTH_NAMES[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${monthName} ${year}`
}

export default function DatePicker({
  value,
  defaultValue,
  onChange,
  min,
  max,
  placeholder = 'Pilih tanggal...',
  disabled = false,
  error,
  name,
  id: explicitId,
  className,
  triggerClassName,
  popoverClassName,
}: DatePickerProps) {
  const generatedId = useId()
  const componentId = explicitId || generatedId
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const [internalValue, setInternalValue] = useState<string>(() => {
    return value ?? defaultValue ?? ''
  })

  const currentValue = value !== undefined ? value : internalValue
  const selectedDate = useMemo(() => parseISODate(currentValue), [currentValue])

  // View state for navigating months & years
  const today = useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = useState<Date>(() => {
    return selectedDate ?? today
  })

  const [isOpen, setIsOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  const positionPopover = () => {
    const trigger = triggerRef.current
    const pop = popoverRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const width = pop?.offsetWidth ?? 224
    const height = pop?.offsetHeight ?? 320
    const margin = 8
    let top = rect.bottom + 6
    if (top + height > window.innerHeight - margin) {
      const above = rect.top - 6 - height
      top = above >= margin ? above : Math.max(margin, window.innerHeight - margin - height)
    }
    let left = rect.left
    left = Math.min(left, window.innerWidth - margin - width)
    left = Math.max(margin, left)
    setPos({ top: Math.round(top), left: Math.round(left) })
  }

  // Position the fixed popover against the trigger and keep it inside the viewport
  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()

  useLayoutEffect(() => {
    if (!isOpen) return
    positionPopover()
    window.addEventListener('scroll', positionPopover, true)
    window.addEventListener('resize', positionPopover)
    return () => {
      window.removeEventListener('scroll', positionPopover, true)
      window.removeEventListener('resize', positionPopover)
    }
  }, [isOpen, viewYear, viewMonth])

  // Close calendar popover on click outside
  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [isOpen])

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1))
  }

  const handleSelectDate = (date: Date) => {
    const iso = toISODate(date)
    if (min && iso < min) return
    if (max && iso > max) return

    if (value === undefined) {
      setInternalValue(iso)
    }
    setIsOpen(false)
    onChange?.(iso)
  }

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue('')
    }
    setIsOpen(false)
    onChange?.('')
  }

  const handleSelectToday = () => {
    const todayISO = toISODate(today)
    if (min && todayISO < min) return
    if (max && todayISO > max) return
    handleSelectDate(today)
  }

  // Calendar cells generation (prev month days, current month days, next month days)
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay() // 0 = Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const cells: Array<{
      date: Date
      isCurrentMonth: boolean
      iso: string
      isDisabled: boolean
      isSelected: boolean
      isToday: boolean
    }> = []

    const todayISO = toISODate(today)

    // Previous month padding
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i)
      const iso = toISODate(d)
      const isDisabled = Boolean((min && iso < min) || (max && iso > max))
      cells.push({
        date: d,
        isCurrentMonth: false,
        iso,
        isDisabled,
        isSelected: iso === currentValue,
        isToday: iso === todayISO,
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day)
      const iso = toISODate(d)
      const isDisabled = Boolean((min && iso < min) || (max && iso > max))
      cells.push({
        date: d,
        isCurrentMonth: true,
        iso,
        isDisabled,
        isSelected: iso === currentValue,
        isToday: iso === todayISO,
      })
    }

    // Next month padding to complete 35 or 42 grid cells
    const remaining = (7 - (cells.length % 7)) % 7
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(viewYear, viewMonth + 1, day)
      const iso = toISODate(d)
      const isDisabled = Boolean((min && iso < min) || (max && iso > max))
      cells.push({
        date: d,
        isCurrentMonth: false,
        iso,
        isDisabled,
        isSelected: iso === currentValue,
        isToday: iso === todayISO,
      })
    }

    return cells
  }, [viewYear, viewMonth, min, max, currentValue, today])

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen((prev) => !prev)
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  const displayText = formatIndonesianDisplay(currentValue)
  const isTodayDisabled = Boolean((min && toISODate(today) < min) || (max && toISODate(today) > max))

  return (
    <div ref={containerRef} className={cn('relative w-full min-w-0', className)}>
      {/* Hidden input for native form data */}
      {name && <input type="hidden" name={name} value={currentValue} />}

      <button
        ref={triggerRef}
        id={componentId}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Pilih tanggal"
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev)
            if (!isOpen && selectedDate) {
              setViewDate(selectedDate)
            }
          }
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full min-h-48 py-10 px-14 text-left flex items-center justify-between gap-10',
          'bg-white border-[0.15rem] border-[#d6d6d2] rounded-[1.2rem] text-[1.5rem] text-ink',
          'transition-all duration-200 select-none cursor-pointer',
          'focus:outline-none focus:border-blue focus:ring-4 focus:ring-blue/15',
          'hover:border-[#b8b8b2]',
          isOpen && 'border-blue ring-4 ring-blue/15',
          disabled && 'opacity-55 cursor-not-allowed bg-soft text-dim',
          Boolean(error) && 'border-red focus:border-red focus:ring-red/15',
          triggerClassName,
        )}
      >
        <span className={cn('truncate', !displayText && 'text-dim')}>
          {displayText || placeholder}
        </span>

        {/* Clean Calendar SVG Icon */}
        <svg
          className={cn(
            'w-18 h-18 text-dim shrink-0 transition-colors duration-200',
            isOpen && 'text-blue',
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {/* Floating Calendar Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Kalender"
          style={{
            top: pos?.top,
            left: pos?.left,
            visibility: pos ? 'visible' : 'hidden',
          }}
          className={cn(
            'fixed z-50 w-[224px]',
            'bg-white border border-[#e2e2de] rounded-[10px]',
            'shadow-[0_8px_24px_rgba(15,15,23,0.14)] p-[10px]',
            'animate-in fade-in-0 duration-150',
            popoverClassName,
          )}
        >
          {/* Header: Month Year and Navigation */}
          <div className="flex items-center justify-between gap-2 mb-[8px]">
            <span className="text-[13px] font-[500] text-ink">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-[2px]">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Bulan sebelumnya"
                className="w-[24px] h-[24px] flex items-center justify-center rounded-[6px] text-dim hover:text-blue hover:bg-[#f4f6fc] transition-colors cursor-pointer"
              >
                <svg className="w-[12px] h-[12px]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Bulan berikutnya"
                className="w-[24px] h-[24px] flex items-center justify-center rounded-[6px] text-dim hover:text-blue hover:bg-[#f4f6fc] transition-colors cursor-pointer"
              >
                <svg className="w-[12px] h-[12px]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-[2px] mb-[2px]">
            {DAY_NAMES.map((d, i) => (
              <div
                key={d}
                className={cn(
                  'text-center text-[10px] font-[500] uppercase tracking-wide py-[2px] select-none',
                  i === 0 ? 'text-red/80' : 'text-dim',
                )}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-[2px]">
            {calendarDays.map((cell) => {
              const dayNum = cell.date.getDate()

              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={cell.isDisabled}
                  onClick={() => handleSelectDate(cell.date)}
                  className={cn(
                    'h-[28px] rounded-[6px] text-[12px] font-[400] flex items-center justify-center select-none transition-all duration-150',
                    cell.isDisabled && 'opacity-25 cursor-not-allowed hover:bg-transparent',
                    !cell.isDisabled && !cell.isSelected && cell.isCurrentMonth && 'text-ink hover:bg-[#f4f6fc] hover:text-blue cursor-pointer',
                    !cell.isDisabled && !cell.isSelected && !cell.isCurrentMonth && 'text-dim/50 hover:bg-[#f4f6fc] cursor-pointer',
                    cell.isToday && !cell.isSelected && 'border border-blue/40 text-blue font-[500]',
                    cell.isSelected && 'bg-blue text-white font-[500] shadow-[0_0.2rem_0.8rem_rgba(10,60,206,0.35)]',
                  )}
                >
                  {dayNum}
                </button>
              )
            })}
          </div>

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between border-t border-[#ececea] pt-[6px] mt-[6px] text-[11px]">
            <button
              type="button"
              disabled={isTodayDisabled}
              onClick={handleSelectToday}
              className={cn(
                'text-blue hover:text-deep font-[450] transition-colors py-[2px] px-[6px] rounded-[4px] hover:bg-[#f4f6fc]',
                isTodayDisabled && 'opacity-40 cursor-not-allowed',
              )}
            >
              Hari ini
            </button>
            {currentValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-dim hover:text-red transition-colors py-[2px] px-[6px] rounded-[4px] hover:bg-red/5"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
