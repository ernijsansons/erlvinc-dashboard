# Reusable Kanban Board Component

A drag-and-drop Kanban board component built with `@dnd-kit` following Razikus/supabase-nextjs-template patterns. Use this across ERLV Inc for:

- **Projects Kanban** - Track tasks across backlog, todo, in_progress, review, done
- **LABS Pipeline** - Move opportunities through 5 stages
- **Domain Tasks** - Manage work, family, personal tasks
- **Any workflow** with column-based stages

## Installation

Already installed in this project:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Usage

### 1. Import Components

```typescript
import { KanbanBoard, KanbanColumnConfig, KanbanItem } from '@/components/kanban'
```

### 2. Define Columns

```typescript
const columns: KanbanColumnConfig[] = [
  { id: 'backlog', title: 'Backlog', icon: '📦' },
  { id: 'todo', title: 'To Do', icon: '📝' },
  { id: 'in_progress', title: 'In Progress', icon: '⚙️' },
  { id: 'review', title: 'Review', icon: '👀' },
  { id: 'done', title: 'Done', icon: '✅' },
]
```

### 3. Transform Data to Kanban Items

```typescript
const items: KanbanItem[] = tasks.map(task => ({
  id: task.id,
  columnId: task.status, // matches column id
  title: task.title,
  subtitle: task.description,
  badges: [
    { label: task.assigned_agent, variant: 'secondary' }
  ],
  metadata: [
    { label: 'Priority', value: task.priority.toString() }
  ]
}))
```

### 4. Handle Moves & Clicks

```typescript
const handleItemMove = async (itemId: string, from: string, to: string) => {
  // Update in Supabase
  await supabase
    .from('tasks')
    .update({ status: to })
    .eq('id', itemId)
}

const handleItemClick = (item: KanbanItem) => {
  router.push(`/tasks/${item.id}`)
}
```

### 5. Render Board

```typescript
<KanbanBoard
  columns={columns}
  items={items}
  onItemMove={handleItemMove}
  onItemClick={handleItemClick}
  isLoading={loading}
/>
```

## Complete Example: Projects Kanban

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { KanbanBoard, KanbanColumnConfig, KanbanItem } from '@/components/kanban'

const PROJECT_COLUMNS: KanbanColumnConfig[] = [
  { id: 'backlog', title: 'Backlog', icon: '📦' },
  { id: 'todo', title: 'To Do', icon: '📝' },
  { id: 'in_progress', title: 'In Progress', icon: '⚙️' },
  { id: 'review', title: 'Review', icon: '👀' },
  { id: 'done', title: 'Done', icon: '✅' },
]

export default function ProjectsKanbanPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()

    // Real-time subscription
    const channel = supabase
      .channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchTasks)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    setTasks(data || [])
    setLoading(false)
  }

  const handleItemMove = async (itemId: string, from: string, to: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === itemId ? { ...t, status: to } : t))

    // Database update
    const { error } = await supabase
      .from('tasks')
      .update({ status: to, updated_at: new Date().toISOString() })
      .eq('id', itemId)

    if (error) {
      console.error(error)
      fetchTasks() // Revert on error
    }
  }

  const kanbanItems: KanbanItem[] = tasks.map(task => ({
    id: task.id,
    columnId: task.status,
    title: task.title,
    subtitle: task.description,
    badges: task.assigned_agent ? [{ label: task.assigned_agent }] : undefined,
    metadata: [
      { label: 'Priority', value: task.priority.toString() },
      { label: 'Progress', value: `${task.progress}%` }
    ]
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Projects</h1>
      <KanbanBoard
        columns={PROJECT_COLUMNS}
        items={kanbanItems}
        onItemMove={handleItemMove}
        isLoading={loading}
      />
    </div>
  )
}
```

## Props Reference

### KanbanBoard

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `KanbanColumnConfig[]` | Yes | Array of column definitions |
| `items` | `KanbanItem[]` | Yes | Array of items to display |
| `onItemMove` | `(itemId, from, to) => Promise<void>` | Yes | Called when item moves between columns |
| `onItemClick` | `(item) => void` | No | Called when item is clicked |
| `isLoading` | `boolean` | No | Show loading skeleton |

### KanbanColumnConfig

```typescript
interface KanbanColumnConfig {
  id: string        // Unique identifier, matches item.columnId
  title: string     // Display name
  icon?: string     // Optional emoji/icon
  color?: string    // Optional color (future use)
}
```

### KanbanItem

```typescript
interface KanbanItem {
  id: string              // Unique identifier
  columnId: string        // Current column (matches column.id)
  title: string           // Card title
  subtitle?: string       // Optional subtitle
  badges?: Array<{
    label: string
    variant?: 'default' | 'secondary' | 'destructive'
  }>
  metadata?: Array<{
    label: string
    value: string
  }>
}
```

## Features

✅ **Drag & Drop** - Powered by `@dnd-kit` (modern, performant)
✅ **Real-time Ready** - Works with Supabase Realtime
✅ **Optimistic Updates** - Instant UI feedback
✅ **Dark Theme** - Matches ERLV Inc design system
✅ **Mobile Friendly** - Responsive grid layout
✅ **TypeScript** - Full type safety
✅ **Reusable** - Use anywhere in the dashboard

## Razikus Template Patterns

This component follows the patterns from [Razikus/supabase-nextjs-template](https://github.com/Razikus/supabase-nextjs-template):

- ✅ Supabase client integration
- ✅ Real-time subscriptions
- ✅ Optimistic UI updates
- ✅ Error handling with reverts
- ✅ TypeScript strict mode
- ✅ shadcn/ui components
- ✅ Tailwind CSS dark theme

## Where to Use

1. **Projects** (`/dashboard/projects`) - Task management across projects
2. **LABS** (`/dashboard/labs`) - Opportunity pipeline (already implemented)
3. **Domains** (`/dashboard/domains/*`) - Personal task boards
4. **Claire** (`/dashboard/claire/*`) - Trading signal workflow
5. **Any custom workflow** - Just define columns and map data

## Customization

### Custom Card Rendering

Need more complex cards? Extend `KanbanCard`:

```typescript
// Create CustomKanbanCard.tsx
export function CustomKanbanCard({ id, ...props }: KanbanCardProps & { customProp: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners}>
      {/* Your custom card UI */}
    </div>
  )
}
```

### Custom Columns

Add color-coded columns:

```typescript
const columns: KanbanColumnConfig[] = [
  { id: 'urgent', title: 'Urgent', icon: '🔥', color: 'red' },
  { id: 'normal', title: 'Normal', icon: '📌', color: 'blue' },
]
```

## Performance Tips

- Use `React.memo()` for large boards (100+ items)
- Implement virtualization for 1000+ items
- Debounce `onItemMove` calls if needed
- Use optimistic updates for instant feedback

## Support

Questions? Check:
- Task 007 implementation in `/app/(dashboard)/dashboard/labs/page.tsx`
- Original Razikus template: https://github.com/Razikus/supabase-nextjs-template
- dnd-kit docs: https://docs.dndkit.com/
