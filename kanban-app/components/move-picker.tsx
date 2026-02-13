'use client'

import { useEffect, useRef, useState } from 'react'
import type { Column } from '@/types/kanban'

interface Props {
  columns: Column[]
  currentColumnId: string
  onSelect: (columnId: string) => void
  onClose: () => void
}

export function MovePicker({ columns, currentColumnId, onSelect, onClose }: Props) {
  const selectableColumns = columns.filter(c => c.id !== currentColumnId)
  const [focusIdx, setFocusIdx] = useState(0)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    btnRefs.current[focusIdx]?.focus()
  }, [focusIdx])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          e.preventDefault()
          setFocusIdx(i => Math.min(i + 1, selectableColumns.length - 1))
          break
        case 'ArrowUp':
        case 'k':
          e.preventDefault()
          setFocusIdx(i => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (selectableColumns[focusIdx]) onSelect(selectableColumns[focusIdx].id)
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        default: {
          // 1-5 number keys to pick column by position
          const num = parseInt(e.key)
          if (num >= 1 && num <= selectableColumns.length) {
            e.preventDefault()
            onSelect(selectableColumns[num - 1].id)
          }
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [focusIdx, selectableColumns, onSelect, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-overlay" />
      <div className="relative bg-surface rounded-2xl border border-border shadow-2xl p-5 max-w-xs w-full mx-4 animate-modal-in" onClick={e => e.stopPropagation()}>
        <h2 className="text-base font-semibold mb-3">移動卡片到…</h2>
        <div className="space-y-1.5">
          {columns.map(col => {
            const selIdx = selectableColumns.findIndex(c => c.id === col.id)
            const isDisabled = col.id === currentColumnId
            return (
              <button
                key={col.id}
                ref={el => { if (selIdx >= 0) btnRefs.current[selIdx] = el }}
                disabled={isDisabled}
                onClick={() => onSelect(col.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors outline-none ${
                  isDisabled
                    ? 'bg-surface-hover text-text-secondary cursor-not-allowed'
                    : 'hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-p2/40 focus-visible:bg-surface-hover'
                }`}
              >
                <span className="text-text-secondary mr-1.5 text-xs">{isDisabled ? '  ' : `${selIdx + 1}.`}</span>
                {col.title} <span className="text-text-secondary">({col.cards.length})</span>
              </button>
            )
          })}
        </div>
        <button onClick={onClose} className="mt-3 w-full text-center text-sm text-text-secondary hover:text-text py-2">取消 <span className="text-xs opacity-60">(Esc)</span></button>
      </div>
    </div>
  )
}
