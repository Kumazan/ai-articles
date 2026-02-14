'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Card, Column, Comment } from '@/types/kanban'
import { v4 as uuidv4 } from 'uuid'
import ReactMarkdown from 'react-markdown'

const priorities = ['P0', 'P1', 'P2', 'P3'] as const
const priorityColors: Record<string, string> = {
  P0: 'bg-p0 text-white',
  P1: 'bg-p1 text-white',
  P2: 'bg-p2 text-white',
  P3: 'bg-p3 text-white',
}
const priorityBadge: Record<string, string> = {
  P0: 'bg-p0/15 text-p0 border-p0/30',
  P1: 'bg-p1/15 text-p1 border-p1/30',
  P2: 'bg-p2/15 text-p2 border-p2/30',
  P3: 'bg-p3/15 text-p3 border-p3/30',
}

const DEFAULT_LABEL_COLORS: Record<string, string> = {
  '前端': '#3b82f6',
  '後端': '#10b981',
  'UI': '#a855f7',
  'Bug': '#ef4444',
  '功能': '#f59e0b',
  '優化': '#06b6d4',
}

export interface CardEntry {
  card: Card
  columnId: string
}

interface Props {
  card: Card | null
  columnId: string
  columns: Column[]
  labelColors?: Record<string, string>
  allLabels?: string[]
  onSave: (card: Card, columnId: string) => void
  onDelete: (id: string) => void
  onClose: () => void
  cardList?: CardEntry[]
  onNavigate?: (entry: CardEntry) => void
}

export function CardModal({ card, columnId, columns, labelColors, allLabels, onSave, onDelete, onClose, cardList, onNavigate }: Props) {
  const isNew = !card
  const canCarousel = !isNew && onNavigate && cardList && cardList.length > 0

  // Current index in the flat card list
  const initialIdx = card && cardList ? cardList.findIndex(e => e.card.id === card.id) : -1
  // Local visible index — driven by scroll, no parent re-render
  const [visibleIdx, setVisibleIdx] = useState(initialIdx)
  const activeEntry = canCarousel && cardList ? cardList[visibleIdx] ?? cardList[initialIdx] : null
  const activeCard = activeEntry?.card ?? card
  const activeColumnId = activeEntry?.columnId ?? columnId

  // ── Editable state (for the currently displayed card) ──
  const [editing, setEditing] = useState(isNew)
  const [title, setTitle] = useState(activeCard?.title ?? '')
  const [description, setDescription] = useState(activeCard?.description ?? '')
  const [priority, setPriority] = useState<Card['priority']>(activeCard?.priority ?? 'P3')
  const [labels, setLabels] = useState<string[]>(activeCard?.labels ?? [])
  const [newLabel, setNewLabel] = useState('')
  const [dueDate, setDueDate] = useState(activeCard?.dueDate ?? '')
  const [prUrl, setPrUrl] = useState(activeCard?.prUrl ?? '')
  const [assignee, setAssignee] = useState(activeCard?.assignee ?? '')
  const [selectedColumn, setSelectedColumn] = useState(activeColumnId)
  const [showPreview, setShowPreview] = useState(false)
  const [comments, setComments] = useState<Comment[]>(activeCard?.comments ?? [])
  const [newComment, setNewComment] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  // Sync edit form when visibleIdx changes (carousel swipe)
  const prevVisibleIdx = useRef(visibleIdx)
  useEffect(() => {
    if (prevVisibleIdx.current === visibleIdx) return
    prevVisibleIdx.current = visibleIdx
    const entry = cardList?.[visibleIdx]
    if (!entry) return
    const c = entry.card
    setEditing(false)
    setTitle(c.title ?? '')
    setDescription(c.description ?? '')
    setPriority(c.priority ?? 'P3')
    setLabels(c.labels ?? [])
    setNewLabel('')
    setDueDate(c.dueDate ?? '')
    setPrUrl(c.prUrl ?? '')
    setAssignee(c.assignee ?? '')
    setSelectedColumn(entry.columnId)
    setShowPreview(false)
    setComments(c.comments ?? [])
    setNewComment('')
    setConfirmDelete(false)
    // Sync parent so closing/saving uses the right card
    onNavigate?.(entry)
  }, [visibleIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll-snap carousel ref ──
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const didInitScroll = useRef(false)

  // Scroll to initial card on mount (instant, no animation)
  useEffect(() => {
    if (!canCarousel || initialIdx < 0 || !scrollRef.current || didInitScroll.current) return
    didInitScroll.current = true
    const el = scrollRef.current
    el.scrollLeft = initialIdx * el.offsetWidth
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle scroll-snap settling → update visibleIdx (local only, no parent re-render)
  const handleScroll = useCallback(() => {
    if (!canCarousel || !scrollRef.current || !cardList) return
    clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      const el = scrollRef.current
      if (!el) return
      const cardWidth = el.offsetWidth
      if (cardWidth === 0) return
      const idx = Math.round(el.scrollLeft / cardWidth)
      if (idx >= 0 && idx < cardList.length) {
        setVisibleIdx(idx)
      }
    }, 80)
  }, [canCarousel, cardList])

  // Escape key
  useEffect(() => {
    if (editing) titleRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose, editing])

  // Disable Telegram vertical swipe when modal is open
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg?.disableVerticalSwipes) {
      tg.disableVerticalSwipes()
      return () => { tg.enableVerticalSwipes?.() }
    }
  }, [])

  // Swipe-down-to-close (vertical only, for single modal / edit mode)
  const modalRef = useRef<HTMLDivElement>(null)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const touchStart = useRef<{ y: number; scrollTop: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const el = modalRef.current
    if (!el) return
    touchStart.current = { y: e.touches[0].clientY, scrollTop: el.scrollTop }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dy = e.touches[0].clientY - touchStart.current.y
    if (touchStart.current.scrollTop <= 0 && dy > 0) {
      e.preventDefault()
      setDragging(true)
      setDragY(Math.max(0, dy))
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (dragY > 120) {
      onClose()
    } else {
      setDragY(0)
    }
    setDragging(false)
    touchStart.current = null
  }, [dragY, onClose])

  const handleSave = () => {
    if (!title.trim()) return
    const now = new Date().toISOString()
    const savedCard: Card = {
      id: activeCard?.id ?? uuidv4(),
      title: title.trim(),
      description: description.trim(),
      priority,
      labels,
      dueDate: dueDate || undefined,
      prUrl: prUrl || undefined,
      assignee: assignee || undefined,
      comments,
      createdAt: activeCard?.createdAt ?? now,
      updatedAt: now,
    }
    onSave(savedCard, selectedColumn)
  }

  const colors = { ...DEFAULT_LABEL_COLORS, ...labelColors }
  const getColTitle = (cid: string) => columns.find(c => c.id === cid)?.title ?? ''
  const colTitle = getColTitle(selectedColumn)

  // ─── CARD READ VIEW (reusable for carousel) ───
  function renderCardRead(c: Card, cId: string, isActive: boolean) {
    const ct = getColTitle(cId)
    const cardComments = isActive ? comments : (c.comments ?? [])
    return (
      <div className="px-5 py-5 sm:p-5 space-y-4">
        {/* Drag handle */}
        <div className="flex justify-center -mt-2 mb-1 sm:hidden">
          <div className="w-10 h-1.5 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold leading-snug break-words">{c.title}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-sm sm:text-xs font-mono font-semibold px-2.5 py-1 rounded-lg border ${priorityBadge[c.priority ?? 'P3']}`}>
                {c.priority}
              </span>
              <span className="text-sm sm:text-xs text-text-secondary bg-surface-hover rounded-lg px-2.5 py-1">
                {ct}
              </span>
              {c.assignee && (
                <span className="text-sm sm:text-xs text-text-secondary bg-surface-hover rounded-lg px-2.5 py-1">
                  👤 {c.assignee}
                </span>
              )}
            </div>
          </div>
          {isActive && (
            <button onClick={onClose} className="text-text-secondary hover:text-text text-2xl sm:text-xl leading-none w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl hover:bg-surface-hover transition-colors shrink-0">
              ×
            </button>
          )}
        </div>

        {/* Labels */}
        {c.labels.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {c.labels.map(label => {
              const color = colors[label] || '#6b7280'
              return (
                <span key={label} className="text-sm sm:text-xs text-text-secondary bg-surface-hover rounded-lg px-3 py-1.5 sm:px-2 sm:py-1 flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  {label}
                </span>
              )
            })}
          </div>
        )}

        {/* Due date */}
        {c.dueDate && (() => {
          const now = new Date(); now.setHours(0,0,0,0)
          const due = new Date(c.dueDate + 'T00:00:00')
          const diff = (due.getTime() - now.getTime()) / (1000*60*60*24)
          const style = diff < 0 ? 'text-p0' : diff <= 3 ? 'text-p1' : 'text-text-secondary'
          const lbl = diff < 0 ? '已過期' : diff === 0 ? '今天' : diff <= 3 ? `${Math.ceil(diff)} 天內` : c.dueDate
          return <p className={`text-sm ${style}`}>📅 到期：{lbl}</p>
        })()}

        {/* PR Link */}
        {c.prUrl && (
          <a href={c.prUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-p2 hover:underline">
            🔗 PR 連結
          </a>
        )}

        {/* Description */}
        {c.description && (
          <div>
            <label className="text-sm sm:text-xs text-text-secondary block mb-2">說明</label>
            <div className="px-4 py-3 sm:px-3 sm:py-2 rounded-xl border border-border bg-surface-alt text-sm prose prose-sm dark:prose-invert max-w-none break-words overflow-wrap-anywhere [word-break:break-word]">
              <ReactMarkdown>{c.description}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <label className="text-sm sm:text-xs text-text-secondary block mb-2">留言 & 活動記錄</label>
          <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
            {[...cardComments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(cm => (
              <div key={cm.id} className={`text-sm sm:text-xs p-3 sm:p-2 rounded-xl sm:rounded-lg ${cm.isSystem ? 'bg-surface-hover text-text-secondary italic' : 'bg-surface-alt border border-border'}`}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{cm.author}</span>
                  <span className="text-text-secondary text-xs">{new Date(cm.createdAt).toLocaleString('zh-TW')}</span>
                </div>
                <p>{cm.text}</p>
              </div>
            ))}
            {cardComments.length === 0 && <p className="text-sm sm:text-xs text-text-secondary/50">尚無留言</p>}
          </div>
          {isActive && (
            <div className="flex gap-2">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newComment.trim()) {
                    e.preventDefault()
                    setComments(prev => [...prev, { id: uuidv4(), author: 'Kuma', text: newComment.trim(), createdAt: new Date().toISOString() }])
                    setNewComment('')
                  }
                }}
                placeholder="輸入留言..."
                className="flex-1 px-4 py-3 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2"
              />
              <button type="button"
                onClick={() => {
                  if (newComment.trim()) {
                    setComments(prev => [...prev, { id: uuidv4(), author: 'Kuma', text: newComment.trim(), createdAt: new Date().toISOString() }])
                    setNewComment('')
                  }
                }}
                className="text-sm px-4 py-3 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg bg-surface-hover text-text-secondary hover:text-text transition-colors"
              >送出</button>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="text-xs text-text-secondary/60 flex gap-4">
          <span>建立：{new Date(c.createdAt).toLocaleString('zh-TW')}</span>
          <span>更新：{new Date(c.updatedAt).toLocaleString('zh-TW')}</span>
        </div>

        {/* Action bar */}
        {isActive && (
          <div className="flex items-center justify-between pt-4 sm:pt-2 border-t border-border">
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-white bg-p2 px-4 py-2.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              ✏️ 編輯
            </button>
            <div className="flex items-center gap-2">
              {cardList && visibleIdx >= 0 && (
                <span className="text-xs text-text-secondary/50">{visibleIdx + 1}/{cardList.length}</span>
              )}
              <button
                onClick={onClose}
                className="text-sm sm:text-xs text-text-secondary px-4 py-2.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-lg hover:bg-surface-hover transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── EDIT MODE ───
  const editView = (
    <div className="px-5 py-5 sm:p-5 space-y-4">
      <div className="flex justify-center -mt-2 mb-1 sm:hidden">
        <div className="w-10 h-1.5 rounded-full bg-border" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-base font-semibold">
          {isNew ? '新增卡片' : '編輯卡片'}
        </h2>
        <button onClick={() => isNew ? onClose() : setEditing(false)} className="text-text-secondary hover:text-text text-2xl sm:text-xl leading-none w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl hover:bg-surface-hover transition-colors">
          ×
        </button>
      </div>

      <div>
        <label className="text-sm sm:text-xs text-text-secondary block mb-2 sm:mb-1">標題</label>
        <input
          ref={titleRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="卡片標題..."
          className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2 transition-colors"
        />
      </div>

      <div>
        <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">優先順序</label>
        <div className="flex gap-3 sm:gap-2">
          {priorities.map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`text-sm sm:text-xs font-mono font-semibold px-3 py-2 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg transition-all ${
                priority === p
                  ? priorityColors[p] + ' shadow-sm scale-105'
                  : 'bg-surface-hover text-text-secondary hover:text-text'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {!isNew && (
        <div>
          <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">欄位</label>
          <select
            value={selectedColumn}
            onChange={e => setSelectedColumn(e.target.value)}
            className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2"
          >
            {columns.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">標籤</label>
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {(() => {
            const available = Array.from(new Set([...Object.keys(DEFAULT_LABEL_COLORS), ...(allLabels ?? [])]))
            return available.map(l => {
              const selected = labels.includes(l)
              const color = colors[l] || '#6b7280'
              return (
                <button key={l} type="button"
                  onClick={() => setLabels(prev => selected ? prev.filter(x => x !== l) : [...prev, l])}
                  className={`text-sm sm:text-xs px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full border transition-all ${selected ? 'border-current shadow-sm' : 'border-transparent bg-surface-hover text-text-secondary hover:text-text'}`}
                  style={selected ? { color, borderColor: color, backgroundColor: color + '20' } : {}}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: color }} />
                  {l}
                </button>
              )
            })
          })()}
        </div>
        <div className="flex gap-2">
          <input
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newLabel.trim()) {
                e.preventDefault()
                if (!labels.includes(newLabel.trim())) setLabels(prev => [...prev, newLabel.trim()])
                setNewLabel('')
              }
            }}
            placeholder="自訂標籤..."
            className="flex-1 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2 transition-colors"
          />
          <button type="button"
            onClick={() => { if (newLabel.trim() && !labels.includes(newLabel.trim())) { setLabels(prev => [...prev, newLabel.trim()]); setNewLabel('') } }}
            className="text-sm px-4 py-2.5 rounded-xl sm:rounded-lg bg-surface-hover text-text-secondary hover:text-text transition-colors"
          >+</button>
        </div>
      </div>

      <div>
        <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">到期日</label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2 transition-colors"
        />
      </div>

      <div>
        <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">PR 連結</label>
        <input
          type="url"
          value={prUrl}
          onChange={e => setPrUrl(e.target.value)}
          placeholder="https://github.com/..."
          className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2 transition-colors"
        />
      </div>

      <div>
        <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">指派給</label>
        <select
          value={assignee}
          onChange={e => setAssignee(e.target.value)}
          className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2"
        >
          <option value="">未指派</option>
          <option value="Kuma">Kuma</option>
          <option value="Guo">Guo</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5 sm:mb-1">
          <label className="text-sm sm:text-xs text-text-secondary">說明（支援 Markdown）</label>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs sm:text-[10px] text-text-secondary hover:text-text px-3 py-1 sm:px-2 sm:py-0.5 rounded bg-surface-hover"
          >
            {showPreview ? '編輯' : '預覽'}
          </button>
        </div>
        {showPreview ? (
          <div className="min-h-[120px] px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg border border-border bg-surface-alt text-sm prose prose-sm dark:prose-invert max-w-none break-words [word-break:break-word]">
            <ReactMarkdown>{description || '*（空白）*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="描述卡片內容..."
            rows={5}
            className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2 transition-colors resize-none"
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-4 sm:pt-2 border-t border-border">
        {activeCard ? (
          confirmDelete ? (
            <div className="flex items-center gap-3 sm:gap-2">
              <span className="text-sm sm:text-xs text-p0">確定刪除？</span>
              <button onClick={() => onDelete(activeCard.id)} className="text-sm sm:text-xs text-white bg-p0 px-3 py-2 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg hover:opacity-90">
                刪除
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-sm sm:text-xs text-text-secondary px-3 py-2 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg hover:bg-surface-hover">
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-sm sm:text-xs text-p0/70 hover:text-p0 transition-colors py-3 sm:py-2"
            >
              刪除卡片
            </button>
          )
        ) : <div />}
        <div className="flex gap-3 sm:gap-2">
          <button
            onClick={() => isNew ? onClose() : setEditing(false)}
            className="text-sm sm:text-xs text-text-secondary px-4 py-2.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-lg hover:bg-surface-hover transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="text-sm sm:text-xs text-white bg-p2 px-4 py-2.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {isNew ? '新增' : '儲存'}
          </button>
        </div>
      </div>
    </div>
  )

  // ─── RENDER ───
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-overlay" style={{ opacity: dragging ? Math.max(0.1, 1 - dragY / 300) : 1 }} />

      {canCarousel && !editing ? (
        // ── CAROUSEL MODE: native scroll-snap ──
        <div
          ref={scrollRef}
          className="carousel-scroll relative w-full max-w-lg mx-4 sm:mx-auto"
          onClick={e => e.stopPropagation()}
          onScroll={handleScroll}
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`.carousel-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="inline-flex gap-3">
            {cardList!.map((entry, idx) => (
              <div
                key={entry.card.id}
                className="shrink-0"
                style={{
                  width: 'calc(100vw - 2rem)', // match container width (mx-4 = 1rem each side)
                  maxWidth: '32rem', // max-w-lg
                  scrollSnapAlign: 'start',
                }}
              >
                <div
                  ref={idx === visibleIdx ? modalRef : undefined}
                  className="bg-surface rounded-2xl border border-border shadow-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto"
                  style={{
                    transform: idx === visibleIdx && dragY > 0 ? `translateY(${dragY}px) scale(${Math.max(0.95, 1 - dragY / 1000)})` : undefined,
                    transition: dragging ? 'none' : 'transform 0.3s ease-out',
                  }}
                >
                  {renderCardRead(entry.card, entry.columnId, idx === visibleIdx)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ── SINGLE MODAL (new card / edit mode) ──
        <div
          ref={modalRef}
          className="relative w-full max-w-lg bg-surface rounded-2xl border border-border shadow-2xl animate-modal-in mx-4 my-4 sm:mx-auto sm:my-8 max-h-[calc(100dvh-2rem)] overflow-y-auto"
          style={{
            transform: dragY > 0 ? `translateY(${dragY}px) scale(${Math.max(0.95, 1 - dragY / 1000)})` : undefined,
            transition: dragging ? 'none' : 'transform 0.3s ease-out',
          }}
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {editing ? editView : (activeCard ? renderCardRead(activeCard, activeColumnId, true) : null)}
        </div>
      )}
    </div>
  )
}
