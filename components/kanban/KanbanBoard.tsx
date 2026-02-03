'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard, KanbanCardProps } from './KanbanCard'

export interface KanbanColumnConfig {
  id: string
  title: string
  icon?: string
  color?: string
}

export interface KanbanItem extends KanbanCardProps {
  id: string
  columnId: string
}

interface KanbanBoardProps {
  columns: KanbanColumnConfig[]
  items: KanbanItem[]
  onItemMove: (itemId: string, fromColumn: string, toColumn: string) => Promise<void>
  onItemClick?: (item: KanbanItem) => void
  isLoading?: boolean
}

export function KanbanBoard({
  columns,
  items,
  onItemMove,
  onItemClick,
  isLoading = false
}: KanbanBoardProps) {
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (event: DragStartEvent) => {
    const item = items.find(i => i.id === event.active.id)
    setActiveItem(item || null)
    setIsDragging(true)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false)
    setActiveItem(null)

    const { active, over } = event

    if (!over || active.id === over.id) return

    const activeItem = items.find(item => item.id === active.id)
    if (!activeItem) return

    // Check if dropped on a column
    const targetColumn = columns.find(col => col.id === over.id)
    if (targetColumn && activeItem.columnId !== targetColumn.id) {
      await onItemMove(activeItem.id, activeItem.columnId, targetColumn.id)
    }
  }

  const getColumnItems = (columnId: string) => {
    return items.filter(item => item.columnId === columnId)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map(column => (
          <Card key={column.id} className="bg-[#111827] border-[#1e293b]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                {column.icon && <span>{column.icon}</span>}
                {column.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-20 bg-[#0a0f1a] animate-pulse rounded-lg" />
                <div className="h-20 bg-[#0a0f1a] animate-pulse rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map(column => {
          const columnItems = getColumnItems(column.id)
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              icon={column.icon}
              count={columnItems.length}
              items={columnItems}
              onItemClick={onItemClick}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="rotate-3 opacity-90">
            <KanbanCard {...activeItem} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
