'use client'

import { useState, useEffect, useRef } from 'react'
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

const DEFAULT_LABEL_COLORS: Record<string, string> = {
  '前端': '#3b82f6',
  '後端': '#10b981',
  'UI': '#a855f7',
  'Bug': '#ef4444',
  '功能': '#f59e0b',
  '優化': '#06b6d4',
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
}

export function CardModal({ card, columnId, columns, labelColors, allLabels, onSave, onDelete, onClose }: Props) {
  const isNew = !card
  const [title, setTitle] = useState(card?.title ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const [priority, setPriority] = useState<Card['priority']>(card?.priority ?? 'P3')
  const [labels, setLabels] = useState<string[]>(card?.labels ?? [])
  const [newLabel, setNewLabel] = useState('')
  const [dueDate, setDueDate] = useState(card?.dueDate ?? '')
  const [selectedColumn, setSelectedColumn] = useState(columnId)
  const [showPreview, setShowPreview] = useState(false)
  const [comments, setComments] = useState<Comment[]>(card?.comments ?? [])
  const [newComment, setNewComment] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleSave = () => {
    if (!title.trim()) return
    const now = new Date().toISOString()
    const savedCard: Card = {
      id: card?.id ?? uuidv4(),
      title: title.trim(),
      description: description.trim(),
      priority,
      labels,
      dueDate: dueDate || undefined,
      comments,
      createdAt: card?.createdAt ?? now,
      updatedAt: now,
    }
    onSave(savedCard, selectedColumn)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto animate-fade-in"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-overlay" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-surface sm:rounded-2xl border border-border shadow-2xl animate-modal-in my-0 sm:my-8 min-h-[100dvh] sm:min-h-0 sm:max-h-[90dvh] sm:overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-base font-semibold">
              {isNew ? '新增卡片' : '編輯卡片'}
            </h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text text-2xl sm:text-xl leading-none p-2 sm:p-1">
              ×
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">標題</label>
            <input
              ref={titleRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="卡片標題..."
              className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border border-border bg-surface-alt text-base sm:text-sm focus:outline-none focus:border-p2 transition-colors"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">優先順序</label>
            <div className="flex gap-2.5 sm:gap-2">
              {priorities.map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`text-sm sm:text-xs font-mono font-semibold px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg transition-all ${
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

          {/* Column (for moving) */}
          {!isNew && (
            <div>
              <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">欄位</label>
              <select
                value={selectedColumn}
                onChange={e => setSelectedColumn(e.target.value)}
                className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border border-border bg-surface-alt text-base sm:text-sm focus:outline-none focus:border-p2"
              >
                {columns.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Labels */}
          <div>
            <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">標籤</label>
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {(() => {
                const colors = { ...DEFAULT_LABEL_COLORS, ...labelColors }
                const available = Array.from(new Set([...Object.keys(DEFAULT_LABEL_COLORS), ...(allLabels ?? [])]))
                return available.map(l => {
                  const selected = labels.includes(l)
                  const color = colors[l] || '#6b7280'
                  return (
                    <button key={l} type="button"
                      onClick={() => setLabels(prev => selected ? prev.filter(x => x !== l) : [...prev, l])}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selected ? 'border-current shadow-sm' : 'border-transparent bg-surface-hover text-text-secondary hover:text-text'}`}
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
                className="flex-1 px-3 py-2 sm:py-1.5 rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2 transition-colors"
              />
              <button type="button"
                onClick={() => { if (newLabel.trim() && !labels.includes(newLabel.trim())) { setLabels(prev => [...prev, newLabel.trim()]); setNewLabel('') } }}
                className="text-xs px-3 py-2 rounded-lg bg-surface-hover text-text-secondary hover:text-text transition-colors"
              >+</button>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">到期日</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border border-border bg-surface-alt text-base sm:text-sm focus:outline-none focus:border-p2 transition-colors"
            />
          </div>

          {/* Description */}
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
              <div className="min-h-[120px] px-4 py-3 sm:px-3 sm:py-2 rounded-lg border border-border bg-surface-alt text-base sm:text-sm prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{description || '*（空白）*'}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="描述卡片內容..."
                rows={5}
                className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border border-border bg-surface-alt text-base sm:text-sm focus:outline-none focus:border-p2 transition-colors resize-none"
              />
            )}
          </div>

          {/* Comments / Activity */}
          {card && (
            <div>
              <label className="text-sm sm:text-xs text-text-secondary block mb-1.5 sm:mb-1">留言 & 活動記錄</label>
              <div className="max-h-40 overflow-y-auto space-y-2 mb-2">
                {comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(c => (
                  <div key={c.id} className={`text-xs p-2 rounded-lg ${c.isSystem ? 'bg-surface-hover text-text-secondary italic' : 'bg-surface-alt border border-border'}`}>
                    <div className="flex justify-between mb-0.5">
                      <span className="font-medium">{c.author}</span>
                      <span className="text-text-secondary">{new Date(c.createdAt).toLocaleString('zh-TW')}</span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-xs text-text-secondary/50">尚無留言</p>}
              </div>
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
                  className="flex-1 px-3 py-2 sm:py-1.5 rounded-lg border border-border bg-surface-alt text-sm focus:outline-none focus:border-p2"
                />
                <button type="button"
                  onClick={() => {
                    if (newComment.trim()) {
                      setComments(prev => [...prev, { id: uuidv4(), author: 'Kuma', text: newComment.trim(), createdAt: new Date().toISOString() }])
                      setNewComment('')
                    }
                  }}
                  className="text-xs px-3 py-2 rounded-lg bg-surface-hover text-text-secondary hover:text-text transition-colors"
                >送出</button>
              </div>
            </div>
          )}

          {/* Metadata */}
          {card && (
            <div className="text-[10px] text-text-secondary/60 flex gap-4">
              <span>建立：{new Date(card.createdAt).toLocaleString('zh-TW')}</span>
              <span>更新：{new Date(card.updatedAt).toLocaleString('zh-TW')}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 sm:pt-2 border-t border-border">
            {card ? (
              confirmDelete ? (
                <div className="flex items-center gap-2.5 sm:gap-2">
                  <span className="text-sm sm:text-xs text-p0">確定刪除？</span>
                  <button onClick={() => onDelete(card.id)} className="text-sm sm:text-xs text-white bg-p0 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg hover:opacity-90">
                    刪除
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="text-sm sm:text-xs text-text-secondary px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg hover:bg-surface-hover">
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm sm:text-xs text-p0/70 hover:text-p0 transition-colors py-2"
                >
                  刪除卡片
                </button>
              )
            ) : <div />}
            <div className="flex gap-2.5 sm:gap-2">
              <button
                onClick={onClose}
                className="text-sm sm:text-xs text-text-secondary px-5 py-3 sm:px-4 sm:py-2 rounded-lg hover:bg-surface-hover transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="text-sm sm:text-xs text-white bg-text px-5 py-3 sm:px-4 sm:py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                {isNew ? '新增' : '儲存'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
