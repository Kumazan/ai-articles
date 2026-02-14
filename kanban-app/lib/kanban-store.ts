import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import type { KanbanData, BoardsData } from '@/types/kanban'

const DATA_DIR = path.resolve('/Users/kumax/.openclaw/workspace')
const BOARDS_PATH = path.join(DATA_DIR, 'boards.json')
const LEGACY_KANBAN_PATH = path.join(DATA_DIR, 'kanban.json')

function boardDir(boardId: string) {
  return path.join(DATA_DIR, 'boards', boardId)
}

function boardKanbanPath(boardId: string) {
  return path.join(boardDir(boardId), 'kanban.json')
}

const DEFAULT_COLUMNS: KanbanData = {
  columns: [
    { id: 'backlog', title: '💡 Backlog', cards: [] },
    { id: 'todo', title: '📋 待辦', cards: [] },
    { id: 'ongoing', title: '🔨 進行中', cards: [] },
    { id: 'review', title: '👀 審查', cards: [] },
    { id: 'done', title: '✅ 完成', cards: [] },
    { id: 'archive', title: '📦 封存', cards: [] },
  ],
}

// ─── Boards ───

export function readBoards(): BoardsData {
  if (existsSync(BOARDS_PATH)) {
    return JSON.parse(readFileSync(BOARDS_PATH, 'utf-8'))
  }
  // First run: migrate legacy kanban.json → main board
  const defaultBoards: BoardsData = {
    boards: [
      { id: 'main', name: '主看板', emoji: '🦐', createdAt: new Date().toISOString() },
    ],
    defaultBoardId: 'main',
  }
  // Migrate legacy data
  if (existsSync(LEGACY_KANBAN_PATH)) {
    const dir = boardDir('main')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    const legacy = readFileSync(LEGACY_KANBAN_PATH, 'utf-8')
    writeFileSync(boardKanbanPath('main'), legacy, 'utf-8')
  }
  writeBoards(defaultBoards)
  return defaultBoards
}

export function writeBoards(data: BoardsData): void {
  writeFileSync(BOARDS_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// ─── Kanban per board ───

export function readKanban(boardId?: string): KanbanData {
  const id = boardId || readBoards().defaultBoardId
  const p = boardKanbanPath(id)
  if (existsSync(p)) {
    return JSON.parse(readFileSync(p, 'utf-8'))
  }
  // Fallback: legacy path (for backward compat during migration)
  if (!boardId && existsSync(LEGACY_KANBAN_PATH)) {
    return JSON.parse(readFileSync(LEGACY_KANBAN_PATH, 'utf-8'))
  }
  return structuredClone(DEFAULT_COLUMNS)
}

export function writeKanban(data: KanbanData, boardId?: string): void {
  const id = boardId || readBoards().defaultBoardId
  const dir = boardDir(id)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(boardKanbanPath(id), JSON.stringify(data, null, 2), 'utf-8')
}

export function createBoard(id: string, name: string, emoji: string): void {
  const boards = readBoards()
  if (boards.boards.some(b => b.id === id)) throw new Error('Board already exists')
  boards.boards.push({ id, name, emoji, createdAt: new Date().toISOString() })
  writeBoards(boards)
  // Init empty kanban
  writeKanban(structuredClone(DEFAULT_COLUMNS), id)
}

export function deleteBoard(id: string): void {
  const boards = readBoards()
  boards.boards = boards.boards.filter(b => b.id !== id)
  if (boards.defaultBoardId === id && boards.boards.length > 0) {
    boards.defaultBoardId = boards.boards[0].id
  }
  writeBoards(boards)
}
