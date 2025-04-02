import { Book, Calculator } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { JSX } from "react"

interface ClassData {
  id: number
  subject: string
  class: string
  taskDate: string
  taskTime: string
  hasNewMaterial: boolean
  hasExam: boolean
  teacher: string
}

interface ClassCardProps {
  data: ClassData
}

export function ClassCard({ data }: ClassCardProps) {
  const subjectIcons: Record<string, JSX.Element> = {
    Matematika: <Calculator className="w-14 h-14 text-blue-500" />,
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex border-b p-4">
          <div className="mr-4">{subjectIcons[data.subject] || <Book className="w-14 h-14 text-blue-500" />}</div>
          <div>
            <h3 className="font-bold text-lg">{data.subject}</h3>
            <p className="text-gray-500">Kelas: {data.class}</p>

            <div className="flex items-center mt-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-sm text-gray-600">
                Tugas ({data.taskDate} @{data.taskTime})
              </span>
            </div>

            {data.hasNewMaterial && (
              <div className="flex items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm text-gray-600">Materi Baru</span>
              </div>
            )}

            {data.hasExam && (
              <div className="flex items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-sm text-gray-600">Ujian</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-3 text-sm text-gray-600 bg-gray-50">{data.teacher}</div>
      </CardContent>
    </Card>
  )
}

