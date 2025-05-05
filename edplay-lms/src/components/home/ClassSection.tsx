import { ClassCard } from "./ClassCard"
import { Button } from "~/components/ui/button"

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
  isActive: boolean
}

interface ClassesSectionProps {
  classData: ClassData[]
  userRole?: 'student' | 'teacher' | 'admin'
  onAddClass?: () => void
}

export function ClassesSection({
  classData,
  userRole,
  onAddClass,
}: ClassesSectionProps) {
  const canEdit = userRole === "teacher" || userRole === "admin"

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Kelas Kamu</h2>
        {canEdit && (
          <Button onClick={onAddClass}>+ Tambah Kelas</Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classData.map((item) => (
          <ClassCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  )
}
