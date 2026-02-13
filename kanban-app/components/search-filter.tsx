'use client'

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
}

export function SearchFilter({
  searchQuery, onSearchChange,
  selectedPriorities, onTogglePriority,
  allLabels, selectedLabels, onToggleLabel,
  selectedAssignees, onToggleAssignee,
}: Props) {
  return (
    <div className="shrink-0 px-5 py-3 sm:px-3 sm:py-2 border-b border-border bg-surface space-y-2">
      {/* Search input */}
      <input
        type="text"
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="🔍 搜尋卡片..."
        className="w-full px-3 py-2 sm:py-1.5 rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2 transition-colors"
      />

      {/* Priority chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-text-secondary mr-1">優先級</span>
        {priorities.map(p => (
          <button
            key={p}
            onClick={() => onTogglePriority(p)}
            className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full transition-all ${
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
          <span className="text-xs text-text-secondary mr-1">標籤</span>
          {allLabels.map(label => (
            <button
              key={label}
              onClick={() => onToggleLabel(label)}
              className={`text-xs px-2.5 py-1 rounded-full transition-all ${
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
        <span className="text-xs text-text-secondary mr-1">指派</span>
        {MEMBERS.map(m => (
          <button
            key={m}
            onClick={() => onToggleAssignee(m)}
            className={`text-xs px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
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
  )
}
