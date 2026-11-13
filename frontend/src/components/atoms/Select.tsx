'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SelectOptionInput = string | { value: string | number; label: string; disabled?: boolean }

export interface SelectProps {
  value?: string | number
  defaultValue?: string | number
  options: readonly SelectOptionInput[]
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean | string
  name?: string
  id?: string
  className?: string
  triggerClassName?: string
  popoverClassName?: string
}

function normalizeOptions(options: readonly SelectOptionInput[]): SelectOption[] {
  return options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt }
    }
    return {
      value: String(opt.value),
      label: opt.label,
      disabled: opt.disabled,
    }
  })
}

export default function Select({
  value,
  defaultValue,
  options: rawOptions,
  onChange,
  placeholder = 'Pilih opsi...',
  disabled = false,
  error,
  name,
  id: explicitId,
  className,
  triggerClassName,
  popoverClassName,
}: SelectProps) {
  const generatedId = useId()
  const componentId = explicitId || generatedId
  const listboxId = `${componentId}-listbox`
  const containerRef = useRef<HTMLDivElement>(null)

  const normalizedOptions = normalizeOptions(rawOptions)

  const [internalValue, setInternalValue] = useState<string>(() => {
    if (value !== undefined) return String(value)
    if (defaultValue !== undefined) return String(defaultValue)
    return normalizedOptions[0]?.value ?? ''
  })

  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  const currentValue = value !== undefined ? String(value) : internalValue
  const selectedOption = normalizedOptions.find((o) => o.value === currentValue)

  // Close dropdown on click outside
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

  const selectOption = (opt: SelectOption) => {
    if (opt.disabled || disabled) return

    if (value === undefined) {
      setInternalValue(opt.value)
    }
    setIsOpen(false)
    onChange?.(opt.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ': {
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
          const opt = normalizedOptions[highlightedIndex]
          if (opt && !opt.disabled) {
            selectOption(opt)
          }
        } else {
          setIsOpen((prev) => !prev)
          const currIdx = normalizedOptions.findIndex((o) => o.value === currentValue)
          setHighlightedIndex(currIdx >= 0 ? currIdx : 0)
        }
        break
      }
      case 'ArrowDown': {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          const currIdx = normalizedOptions.findIndex((o) => o.value === currentValue)
          setHighlightedIndex(currIdx >= 0 ? currIdx : 0)
        } else {
          setHighlightedIndex((prev) => {
            const next = prev + 1
            return next >= normalizedOptions.length ? 0 : next
          })
        }
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          const currIdx = normalizedOptions.findIndex((o) => o.value === currentValue)
          setHighlightedIndex(currIdx >= 0 ? currIdx : normalizedOptions.length - 1)
        } else {
          setHighlightedIndex((prev) => {
            const next = prev - 1
            return next < 0 ? normalizedOptions.length - 1 : next
          })
        }
        break
      }
      case 'Escape': {
        if (isOpen) {
          e.preventDefault()
          setIsOpen(false)
        }
        break
      }
      case 'Tab': {
        if (isOpen) {
          setIsOpen(false)
        }
        break
      }
    }
  }

  return (
    <div ref={containerRef} className={cn('relative w-full min-w-0', className)}>
      {/* Hidden input for form data serialization */}
      {name && <input type="hidden" name={name} value={currentValue} />}

      <button
        id={componentId}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev)
            if (!isOpen) {
              const currIdx = normalizedOptions.findIndex((o) => o.value === currentValue)
              setHighlightedIndex(currIdx >= 0 ? currIdx : 0)
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
        <span className={cn('truncate', !selectedOption && 'text-dim')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Clean crisp SVG Chevron with smooth 180-deg flip */}
        <svg
          className={cn(
            'w-16 h-16 text-dim shrink-0 transition-transform duration-200 ease-out',
            isOpen && 'rotate-180 text-blue',
          )}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 7.5L10 12.5L15 7.5" />
        </svg>
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className={cn(
            'absolute left-0 right-0 z-50 mt-6 max-h-240 overflow-y-auto',
            'bg-white border-[0.15rem] border-[#e2e2de] rounded-[1.2rem]',
            'shadow-[0_1.2rem_3.2rem_rgba(15,15,23,0.12)] p-4',
            'animate-in fade-in-0 duration-150',
            popoverClassName,
          )}
        >
          {normalizedOptions.length === 0 ? (
            <div className="py-12 px-14 text-[1.4rem] text-dim text-center">Tidak ada opsi tersedia</div>
          ) : (
            normalizedOptions.map((opt, idx) => {
              const isSelected = opt.value === currentValue
              const isHighlighted = idx === highlightedIndex

              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => selectOption(opt)}
                  className={cn(
                    'py-9 px-12 rounded-[0.8rem] text-[1.45rem] flex items-center justify-between gap-8 select-none transition-colors duration-150',
                    opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                    isSelected
                      ? 'bg-[#edf2fd] text-blue font-medium'
                      : isHighlighted
                        ? 'bg-[#f4f6fc] text-ink'
                        : 'text-ink hover:bg-[#f4f6fc]',
                  )}
                >
                  <span className="truncate">{opt.label}</span>

                  {/* Refined Blue Checkmark for selected item */}
                  {isSelected && (
                    <svg
                      className="w-16 h-16 text-blue shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 10.5L8 14.5L16 6.5" />
                    </svg>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

