'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import type { KanbanData, Card, Column } from '@/types/kanban'
import { fetchKanban, saveKanban } from '@/lib/api'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { CardModal } from './card-modal'
import { KeyboardHelp } from './keyboard-help'
import { MovePicker } from './move-picker'
import { SearchFilter } from './search-filter'

export function KanbanBoard() {
  const [data, setData] = useState<KanbanData | null>(null)
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [editingCard, setEditingCard] = useState<{ card: Card | null; columnId: string } | null>(null)
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(new Set(['archive']))
  const [loading, setLoading] = useState(true)

  // Undo/Redo
  const undoStack = useRef<KanbanData[]>([])
  const redoStack = useRef<KanbanData[]>([])
  const MAX_UNDO = 20

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriorities, setSelectedPriorities] = useState<Set<Card['priority']>>(new Set())
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set())

  // Keyboard navigation
  const [focusedColIdx, setFocusedColIdx] = useState(-1)
  const [focusedCardIdx, setFocusedCardIdx] = useState(-1)
  const [showHelp, setShowHelp] = useState(false)
  const [showMovePicker, setShowMovePicker] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const usingKeyboard = useRef(false)

  useEffect(() => {
    fetchKanban().then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  // Telegram theme
  useEffect(() => {
    try {
      const tg = (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void; setHeaderColor: (c: string) => void; colorScheme: string } } }).Telegram?.WebApp
      if (tg) {
        tg.ready()
        tg.expand()
        if (tg.colorScheme === 'dark') {
          document.documentElement.classList.add('dark')
        }
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark')
        }
      }
    } catch {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const persist = useCallback(async (newData: KanbanData) => {
    setData(prev => {
      if (prev) {
        undoStack.current = [...undoStack.current.slice(-(MAX_UNDO - 1)), prev]
        redoStack.current = []
      }
      return newData
    })
    await saveKanban(newData)
  }, [])

  const undo = useCallback(async () => {
    if (undoStack.current.length === 0) return
    const prev = undoStack.current[undoStack.current.length - 1]
    undoStack.current = undoStack.current.slice(0, -1)
    setData(current => {
      if (current) redoStack.current = [...redoStack.current, current]
      return prev
    })
    await saveKanban(prev)
  }, [])

  const redo = useCallback(async () => {
    if (redoStack.current.length === 0) return
    const next = redoStack.current[redoStack.current.length - 1]
    redoStack.current = redoStack.current.slice(0, -1)
    setData(current => {
      if (current) undoStack.current = [...undoStack.current, current]
      return next
    })
    await saveKanban(next)
  }, [])

  const findColumn = useCallback((cardId: string): Column | undefined => {
    return data?.columns.find(col => col.cards.some(c => c.id === cardId))
  }, [data])

  // Get visible (non-collapsed) columns
  const visibleColumns = useCallback(() => {
    return data?.columns.filter(c => !collapsedColumns.has(c.id)) ?? []
  }, [data, collapsedColumns])

  // Collect all labels
  const allLabels = Array.from(new Set(data?.columns.flatMap(c => c.cards.flatMap(card => card.labels)) ?? []))

  // Filter cards
  const filterCard = useCallback((card: Card) => {
    const q = searchQuery.toLowerCase()
    if (q && !card.title.toLowerCase().includes(q) && !card.description.toLowerCase().includes(q)) return false
    if (selectedPriorities.size > 0 && !selectedPriorities.has(card.priority)) return false
    if (selectedLabels.size > 0 && !card.labels.some(l => selectedLabels.has(l))) return false
    return true
  }, [searchQuery, selectedPriorities, selectedLabels])

  const togglePriority = useCallback((p: Card['priority']) => {
    setSelectedPriorities(prev => {
      const next = new Set(prev)
      if (next.has(p)) next.delete(p); else next.add(p)
      return next
    })
  }, [])

  const toggleLabel = useCallback((label: string) => {
    setSelectedLabels(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label); else next.add(label)
      return next
    })
  }, [])

  const isFiltering = searchQuery !== '' || selectedPriorities.size > 0 || selectedLabels.size > 0

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo: ⌘Z / ⌘⇧Z (works globally)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo(); else undo()
        return
      }

      // Don't handle if modal is open (modal has its own Esc handler) or typing in input
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (editingCard) return

      // Help overlay
      if (showHelp) {
        if (e.key === 'Escape' || e.key === '?') { setShowHelp(false); e.preventDefault() }
        return
      }

      // Move picker
      if (showMovePicker) {
        if (e.key === 'Escape') { setShowMovePicker(false); e.preventDefault() }
        return
      }

      // Delete confirmation
      if (confirmDeleteId) {
        if (e.key === 'Escape') { setConfirmDeleteId(null); e.preventDefault() }
        return
      }

      const cols = visibleColumns()
      if (!cols.length) return

      usingKeyboard.current = true

      switch (e.key) {
        case '?': {
          e.preventDefault()
          setShowHelp(true)
          break
        }
        case 'Escape': {
          e.preventDefault()
          setFocusedColIdx(-1)
          setFocusedCardIdx(-1)
          break
        }
        case 'ArrowRight': {
          e.preventDefault()
          setFocusedColIdx(prev => {
            const next = Math.min(prev + 1, cols.length - 1)
            setFocusedCardIdx(prev2 => cols[next].cards.length > 0 ? Math.min(prev2 < 0 ? 0 : prev2, cols[next].cards.length - 1) : -1)
            return next
          })
          break
        }
        case 'ArrowLeft': {
          e.preventDefault()
          setFocusedColIdx(prev => {
            const next = Math.max(prev - 1, 0)
            setFocusedCardIdx(prev2 => cols[next].cards.length > 0 ? Math.min(prev2 < 0 ? 0 : prev2, cols[next].cards.length - 1) : -1)
            return next
          })
          break
        }
        case 'Tab': {
          e.preventDefault()
          setFocusedColIdx(prev => {
            const next = e.shiftKey
              ? (prev <= 0 ? cols.length - 1 : prev - 1)
              : (prev >= cols.length - 1 ? 0 : prev + 1)
            setFocusedCardIdx(prev2 => cols[next].cards.length > 0 ? Math.min(prev2 < 0 ? 0 : prev2, cols[next].cards.length - 1) : -1)
            return next
          })
          break
        }
        case 'ArrowDown': {
          e.preventDefault()
          if (focusedColIdx < 0) { setFocusedColIdx(0); setFocusedCardIdx(0); break }
          const col = cols[focusedColIdx]
          if (col) setFocusedCardIdx(prev => Math.min(prev + 1, col.cards.length - 1))
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (focusedColIdx < 0) { setFocusedColIdx(0); setFocusedCardIdx(0); break }
          const col2 = cols[focusedColIdx]
          if (col2) setFocusedCardIdx(prev => Math.max(prev - 1, 0))
          break
        }
        case 'Enter': {
          e.preventDefault()
          if (focusedColIdx >= 0) {
            const col = cols[focusedColIdx]
            const card = col?.cards[focusedCardIdx]
            if (card && col) {
              setEditingCard({ card, columnId: col.id })
            }
          }
          break
        }
        case 'n':
        case 'N': {
          e.preventDefault()
          const colIdx = focusedColIdx >= 0 ? focusedColIdx : 0
          const col = cols[colIdx]
          if (col) {
            setFocusedColIdx(colIdx)
            setEditingCard({ card: null, columnId: col.id })
          }
          break
        }
        case 'm':
        case 'M': {
          e.preventDefault()
          if (focusedColIdx >= 0) {
            const col = cols[focusedColIdx]
            const card = col?.cards[focusedCardIdx]
            if (card) setShowMovePicker(true)
          }
          break
        }
        case 'd':
        case 'D': {
          e.preventDefault()
          if (focusedColIdx >= 0) {
            const col = cols[focusedColIdx]
            const card = col?.cards[focusedCardIdx]
            if (card) setConfirmDeleteId(card.id)
          }
          break
        }
        case '1': case '2': case '3': case '4': {
          e.preventDefault()
          const pMap: Record<string, Card['priority']> = { '1': 'P0', '2': 'P1', '3': 'P2', '4': 'P3' }
          if (focusedColIdx >= 0 && data) {
            const col = cols[focusedColIdx]
            const card = col?.cards[focusedCardIdx]
            if (card) {
              const newData = structuredClone(data)
              const targetCol = newData.columns.find(c => c.id === col.id)
              const targetCard = targetCol?.cards.find(c => c.id === card.id)
              if (targetCard) {
                targetCard.priority = pMap[e.key]
                targetCard.updatedAt = new Date().toISOString()
                persist(newData)
              }
            }
          }
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [data, editingCard, focusedColIdx, focusedCardIdx, collapsedColumns, showHelp, showMovePicker, confirmDeleteId, persist, visibleColumns, undo, redo])

  // Reset keyboard mode on mouse
  useEffect(() => {
    const handler = () => { usingKeyboard.current = false }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const card = data?.columns.flatMap(c => c.cards).find(c => c.id === event.active.id)
    if (card) setActiveCard(card)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!data) return
    const { active, over } = event
    if (!over) return

    const activeCol = findColumn(active.id as string)
    const overCol = data.columns.find(c => c.id === over.id) || findColumn(over.id as string)

    if (!activeCol || !overCol || activeCol.id === overCol.id) return

    setData(prev => {
      if (!prev) return prev
      const newData = structuredClone(prev)
      const srcCol = newData.columns.find(c => c.id === activeCol.id)!
      const dstCol = newData.columns.find(c => c.id === overCol.id)!
      const cardIdx = srcCol.cards.findIndex(c => c.id === active.id)
      if (cardIdx === -1) return prev
      const [card] = srcCol.cards.splice(cardIdx, 1)

      const overCardIdx = dstCol.cards.findIndex(c => c.id === over.id)
      if (overCardIdx >= 0) {
        dstCol.cards.splice(overCardIdx, 0, card)
      } else {
        dstCol.cards.push(card)
      }
      return newData
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    if (!data || !over) return

    const col = findColumn(active.id as string)
    if (!col) return

    if (active.id !== over.id) {
      const newData = structuredClone(data)
      const targetCol = newData.columns.find(c => c.id === col.id)!
      const oldIdx = targetCol.cards.findIndex(c => c.id === active.id)
      const newIdx = targetCol.cards.findIndex(c => c.id === over.id)
      if (oldIdx >= 0 && newIdx >= 0) {
        const [card] = targetCol.cards.splice(oldIdx, 1)
        targetCol.cards.splice(newIdx, 0, card)
        persist(newData)
        return
      }
    }
    persist(data)
  }

  const toggleCollapse = (colId: string) => {
    setCollapsedColumns(prev => {
      const next = new Set(prev)
      if (next.has(colId)) next.delete(colId)
      else next.add(colId)
      return next
    })
  }

  const handleAddCard = (columnId: string) => {
    setEditingCard({ card: null, columnId })
  }

  const handleEditCard = (card: Card) => {
    const col = findColumn(card.id)
    if (col) setEditingCard({ card, columnId: col.id })
  }

  const handleSaveCard = async (card: Card, columnId: string) => {
    if (!data) return
    const newData = structuredClone(data)

    // Remove from old column if moving
    for (const col of newData.columns) {
      const idx = col.cards.findIndex(c => c.id === card.id)
      if (idx >= 0 && col.id !== columnId) {
        col.cards.splice(idx, 1)
        break
      }
    }

    const col = newData.columns.find(c => c.id === columnId)
    if (!col) return

    const existing = col.cards.findIndex(c => c.id === card.id)
    if (existing >= 0) {
      col.cards[existing] = { ...card, updatedAt: new Date().toISOString() }
    } else {
      col.cards.push(card)
    }
    await persist(newData)
    setEditingCard(null)
  }

  const handleDeleteCard = async (cardId: string) => {
    if (!data) return
    const newData = structuredClone(data)
    for (const col of newData.columns) {
      const idx = col.cards.findIndex(c => c.id === cardId)
      if (idx >= 0) {
        col.cards.splice(idx, 1)
        break
      }
    }
    await persist(newData)
    setEditingCard(null)
  }

  // Handle move picker selection
  const handleMoveCard = async (targetColumnId: string) => {
    if (!data || focusedColIdx < 0) return
    const cols = visibleColumns()
    const col = cols[focusedColIdx]
    const card = col?.cards[focusedCardIdx]
    if (!card) return

    const newData = structuredClone(data)
    // Remove from source
    const srcCol = newData.columns.find(c => c.id === col.id)
    if (srcCol) {
      const idx = srcCol.cards.findIndex(c => c.id === card.id)
      if (idx >= 0) srcCol.cards.splice(idx, 1)
    }
    // Add to target
    const dstCol = newData.columns.find(c => c.id === targetColumnId)
    if (dstCol) dstCol.cards.push(card)

    await persist(newData)
    setShowMovePicker(false)
    // Adjust focus
    setFocusedCardIdx(prev => {
      const remaining = srcCol?.cards.length ?? 0
      // After splice the data is already updated in newData; remaining = srcCol length after splice
      return Math.min(prev, Math.max(0, (col.cards.length - 2)))
    })
  }

  // Handle keyboard delete confirmation
  const handleConfirmDelete = async () => {
    if (!confirmDeleteId || !data) return
    const newData = structuredClone(data)
    for (const col of newData.columns) {
      const idx = col.cards.findIndex(c => c.id === confirmDeleteId)
      if (idx >= 0) {
        col.cards.splice(idx, 1)
        break
      }
    }
    await persist(newData)
    setConfirmDeleteId(null)
    // Adjust card focus
    const cols = visibleColumns()
    if (focusedColIdx >= 0 && cols[focusedColIdx]) {
      const remaining = cols[focusedColIdx].cards.length - 1 // before persist updates
      setFocusedCardIdx(prev => Math.min(prev, Math.max(0, remaining - 1)))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-text-secondary border-t-text rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-text-secondary">
        無法載入看板資料
      </div>
    )
  }

  const cols = visibleColumns()

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="shrink-0 px-5 py-5 sm:px-4 sm:py-3 border-b border-border flex items-center justify-between bg-surface">
        <h1 className="text-xl sm:text-lg font-semibold tracking-tight">看板</h1>
        <div className="flex items-center gap-3">
          <button onClick={undo} disabled={undoStack.current.length === 0}
            className="text-lg text-text-secondary hover:text-text disabled:opacity-20 transition-colors" title="復原 ⌘Z">↩</button>
          <button onClick={redo} disabled={redoStack.current.length === 0}
            className="text-lg text-text-secondary hover:text-text disabled:opacity-20 transition-colors" title="重做 ⌘⇧Z">↪</button>
          <button
            onClick={() => setShowHelp(true)}
            className="hidden md:flex text-xs text-text-secondary hover:text-text bg-surface-hover rounded px-2 py-1 transition-colors"
            title="鍵盤快捷鍵"
          >
            ⌨️ <kbd className="ml-1 font-mono">?</kbd>
          </button>
          <span className="text-sm sm:text-xs text-text-secondary">
            {data.columns.reduce((sum, c) => sum + c.cards.length, 0)} 張卡片
          </span>
        </div>
      </header>

      {/* Search & Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPriorities={selectedPriorities}
        onTogglePriority={togglePriority}
        allLabels={allLabels}
        selectedLabels={selectedLabels}
        onToggleLabel={toggleLabel}
      />

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory md:snap-none">
          <div className="flex h-full gap-0 min-w-max md:min-w-0">
            {data.columns.map(column => {
              const visIdx = cols.findIndex(c => c.id === column.id)
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  collapsed={collapsedColumns.has(column.id)}
                  isFocused={visIdx >= 0 && visIdx === focusedColIdx}
                  focusedCardIndex={visIdx >= 0 && visIdx === focusedColIdx ? focusedCardIdx : -1}
                  onToggleCollapse={() => toggleCollapse(column.id)}
                  onAddCard={() => handleAddCard(column.id)}
                  onEditCard={handleEditCard}
                  filterCard={isFiltering ? filterCard : undefined}
                  labelColors={data.labelColors}
                />
              )
            })}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="drag-overlay">
              <KanbanCard card={activeCard} onEdit={() => {}} labelColors={data.labelColors} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      {editingCard && (
        <CardModal
          card={editingCard.card}
          columnId={editingCard.columnId}
          columns={data.columns}
          labelColors={data.labelColors}
          allLabels={allLabels}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          onClose={() => setEditingCard(null)}
        />
      )}

      {/* Keyboard help overlay */}
      {showHelp && <KeyboardHelp onClose={() => setShowHelp(false)} />}

      {/* Move picker */}
      {showMovePicker && focusedColIdx >= 0 && (
        <MovePicker
          columns={data.columns}
          currentColumnId={cols[focusedColIdx]?.id ?? ''}
          onSelect={handleMoveCard}
          onClose={() => setShowMovePicker(false)}
        />
      )}

      {/* Delete confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={() => setConfirmDeleteId(null)}>
          <div className="absolute inset-0 bg-overlay" />
          <div className="relative bg-surface rounded-2xl border border-border shadow-2xl p-5 max-w-xs w-full mx-4 animate-modal-in" onClick={e => e.stopPropagation()}>
            <p className="text-base font-medium mb-4">確定要刪除這張卡片嗎？</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDeleteId(null)} className="text-sm text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-hover transition-colors">取消</button>
              <button onClick={handleConfirmDelete} className="text-sm text-white bg-p0 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
