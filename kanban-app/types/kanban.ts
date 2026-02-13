export interface Card {
  id: string
  title: string
  description: string
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  labels: string[]
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
}
