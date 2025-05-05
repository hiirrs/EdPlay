'use client'

import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Switch } from '../ui/switch'
import { useRouter } from 'next/navigation'
import { trpc } from '~/utils/trpc'

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
  isEditable?: boolean 
}

interface ClassCardProps {
  data: ClassData
}

export function ClassCard({ data }: ClassCardProps) {
  const router = useRouter()
  const utils = trpc.useUtils()

  const toggleMutation = trpc.course.update.useMutation({
    onSuccess: () => utils.course.getByUserRole.invalidate(),
  })

  const deleteMutation = trpc.course.delete.useMutation({
    onSuccess: () => utils.course.getByUserRole.invalidate(),
  })

  const handleToggleActive = () => {
    toggleMutation.mutate({
      id: data.id,
      name: data.subject,
      description: '',
      educationLevel: 'SMP', // TODO: replace with actual value
      grade: 7, // TODO: replace with actual value
      isActive: !data.isActive,
    })
  }

  const handleEdit = () => {
    router.push(`/course/${data.id}/edit`)
  }

  const handleDelete = () => {
    if (confirm('Yakin ingin menghapus kelas ini?')) {
      deleteMutation.mutate({ id: data.id })
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow rounded-2xl relative">
      <CardContent className="flex p-0">
        <div className="relative w-24 md:w-28 lg:w-32 aspect-[3/4] shrink-0">
          <Image
            src={data.imageUrl || '/images/default.png'}
            alt={data.subject}
            fill
            className="object-cover rounded-l-2xl"
          />
        </div>

        <div className="flex-1 p-4">
          <h3 className="font-bold text-lg">{data.subject}</h3>
          <p className="text-gray-500 mb-2">Kelas: {data.class}</p>

          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-600">
              Tugas ({data.taskDate} @{data.taskTime})
            </span>
          </div>

          {data.hasNewMaterial && (
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600">Materi Baru</span>
            </div>
          )}

          {data.hasExam && (
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-orange-600 mr-2"></div>
              <span className="text-sm text-gray-600">Ujian</span>
            </div>
          )}

          <p className="text-sm text-gray-700 mt-2">{data.teacher}</p>

          {data.isEditable && (
            <div className="mt-3 flex items-center justify-end">
              <Switch
                checked={data.isActive}
                onCheckedChange={handleToggleActive}
              />
              <span className="text-sm ml-2">{data.isActive ? 'Aktif' : 'Nonaktif'}</span>

              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Pencil className="w-2 h-4 text-blue-600" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="w-2 h-4 text-red-600" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
