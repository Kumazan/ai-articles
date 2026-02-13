'use client'

import { useState } from 'react'
import type { Card } from '@/types/kanban'

const priorities = ['P0', 'P1', 'P2', 'P3'] as const
const priorityColors: Record<string, string> = {
  P0: 'bg-p0 text-white',
  P1: 'bg-p1 text-white',
  P2: 'bg-p2 text-white',
  P3: 'bg-p3 text-white',
}

const MEMBERS = ['Kuma', 'Guo']

interface Props {
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedPriorities: Set<Card['priority']>
  onTogglePriority: (p: Card['priority']) => void
  allLabels: string[]
  selectedLabels: Set<string>
  onToggleLabel: (label: string) => void
  selectedAssignees: Set<string>
  onToggleAssignee: (a: string) => void
  onClearAll?: () => void
}

export function SearchFilter({
  searchQuery, onSearchChange,
  selectedPriorities, onTogglePriority,
  allLabels, selectedLabels, onToggleLabel,
  selectedAssignees, onToggleAssignee,
  onClearAll,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const activeCount = selectedPriorities.size + selectedLabels.size + selectedAssignees.size + (searchQuery ? 1 : 0)

  return (
    <div className="shrink-0 border-b border-border bg-surface">
      {/* Compact bar — always visible */}
      <div className="flex items-center gap-2 px-4 py-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text active:scale-95 transition-all"
        >
          <span className="text-base">🔍</span>
          <span>{expanded ? '收合篩選' : '搜尋 & 篩選'}</span>
          {activeCount > 0 && (
            <span className="ml-1 text-[10px] font-semibold bg-p2 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Active filter chips (inline preview when collapsed) */}
        {!expanded && activeCount > 0 && (
          <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
            {searchQuery && (
              <span className="text-[10px] bg-surface-hover text-text-secondary rounded-full px-2 py-0.5 whitespace-nowrap">
                &quot;{searchQuery.slice(0, 10)}{searchQuery.length > 10 ? '…' : ''}&quot;
              </span>
            )}
            {Array.from(selectedPriorities).map(p => (
              <span key={p} className={`text-[10px] font-mono font-semibold rounded-full px-1.5 py-0.5 ${priorityColors[p]}`}>{p}</span>
            ))}
            {Array.from(selectedLabels).map(l => (
              <span key={l} className="text-[10px] bg-surface-hover text-text-secondary rounded-full px-2 py-0.5 whitespace-nowrap">{l}</span>
            ))}
          </div>
        )}

        {/* Clear all button */}
        {activeCount > 0 && (
          <button
            onClick={() => {
              onSearchChange('')
              onClearAll?.()
            }}
            className="text-[10px] text-p0 hover:text-p0/80 active:scale-95 transition-all whitespace-nowrap px-2 py-1"
          >
            清除
          </button>
        )}
      </div>

      {/* Expanded filter panel */}
      {expanded && (
        <div className="px-4 pb-3 space-y-2 animate-fade-in">
          {/* Search input */}
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="搜尋卡片標題或說明..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2 transition-colors"
            autoFocus
          />

          {/* Priority chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-text-secondary mr-0.5">優先級</span>
            {priorities.map(p => (
              <button
                key={p}
                onClick={() => onTogglePriority(p)}
                className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full transition-all active:scale-90 ${
                  selectedPriorities.has(p)
                    ? priorityColors[p] + ' shadow-sm'
                    : 'bg-surface-hover text-text-secondary hover:text-text'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Label chips */}
          {allLabels.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-text-secondary mr-0.5">標籤</span>
              {allLabels.map(label => (
                <button
                  key={label}
                  onClick={() => onToggleLabel(label)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all active:scale-90 ${
                    selectedLabels.has(label)
                      ? 'bg-text text-surface shadow-sm'
                      : 'bg-surface-hover text-text-secondary hover:text-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Assignee chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-text-secondary mr-0.5">指派</span>
            {MEMBERS.map(m => (
              <button
                key={m}
                onClick={() => onToggleAssignee(m)}
                className={`text-xs px-2.5 py-1 rounded-full transition-all active:scale-90 flex items-center gap-1 ${
                  selectedAssignees.has(m)
                    ? 'bg-p2 text-white shadow-sm'
                    : 'bg-surface-hover text-text-secondary hover:text-text'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-p2/30 text-[10px] flex items-center justify-center font-semibold">{m[0]}</span>
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
