'use client'

import { JSX, useState } from 'react'
import ContentList from './ContentList'
// import ContentView from './ContentView'

interface SidebarContentProps<T> {
  items: T[]
  renderTitle: (item: T) => string
  renderContent: (item: T) => JSX.Element
  typeLabel?: string
}

export default function SidebarContent<T extends { id: number }>({
  items,
  renderTitle,
  renderContent,
  typeLabel,
}: SidebarContentProps<T>) {
  const [activeId, setActiveId] = useState<number | null>(items[0]?.id ?? null)
  const selected = items.find((i) => i.id === activeId)

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-3/12">
        <ContentList
          items={items}
          activeId={activeId}
          onSelect={setActiveId}
          renderTitle={renderTitle}
          typeLabel={typeLabel}
        />
      </div>

      <div className="md:w-9/12 w-full">
        {selected ? renderContent(selected) : <p>Pilih item di samping.</p>}
      </div>
    </div>
  )
}
