export interface Comment {
  id: string
  author: string
  text: string
  createdAt: string
  isSystem?: boolean
}

export interface Card {
  id: string
  title: string
  description: string
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  labels: string[]
  dueDate?: string
  comments?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: string
  title: string
  cards: Card[]
}

export interface KanbanData {
  columns: Column[]
  labelColors?: Record<string, string>
}
