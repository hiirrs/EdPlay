'use client'

interface ContentListProps<T> {
  items: T[]
  activeId: number | null
  onSelect: (id: number) => void
  renderTitle: (item: T) => string
  typeLabel?: string
}

export default function ContentList<T extends { id: number }>({
  items,
  activeId,
  onSelect,
  renderTitle,
  typeLabel = "Item",
}: ContentListProps<T>) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center p-2 border-b last:border-b-0 cursor-pointer 
          hover:bg-[#D0F2FF] transition-colors ${
            activeId === item.id ? 'bg-[#D0F2FF]' : ''
          }`}
          onClick={() => onSelect(item.id)}
        >
          <div className="bg-[#D0F2FF] text-[#2E3E83] rounded-md text-center mr-2 w-14 py-1">
            <div className="text-xs font-medium">{typeLabel}</div>
            <div className="font-bold">{item.id}</div>
          </div>
          <span className="text-sm font-semibold">{renderTitle(item)}</span>
        </div>
      ))}
    </div>
  )
}
