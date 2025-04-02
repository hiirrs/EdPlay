import { ClassCard } from "./class-card"

interface ClassData {
  id: number
  subject: string
  class: string
  taskDate: string
  taskTime: string
  hasNewMaterial: boolean
  hasExam: boolean
  teacher: string
  imageUrl?: string
}

interface ClassesSectionProps {
  classData: ClassData[]
}

export function ClassesSection({ classData }: ClassesSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Kelas Kamu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classData.map((item) => (
          <ClassCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  )
}

