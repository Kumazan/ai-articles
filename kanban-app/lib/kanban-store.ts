import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type { KanbanData } from '@/types/kanban'

const KANBAN_PATH = path.resolve('/Users/kumax/.openclaw/workspace/kanban.json')

export function readKanban(): KanbanData {
  const raw = readFileSync(KANBAN_PATH, 'utf-8')
  return JSON.parse(raw)
}

export function writeKanban(data: KanbanData): void {
  writeFileSync(KANBAN_PATH, JSON.stringify(data, null, 2), 'utf-8')
}
