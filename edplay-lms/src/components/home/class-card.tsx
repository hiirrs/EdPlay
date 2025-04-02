'use client'

import Image from 'next/image'
import { Card, CardContent } from '../ui/card'

interface ClassData {
  id: number
  subject: string
  class: string
  taskDate: string
  taskTime: string
  hasNewMaterial: boolean
  hasExam: boolean
  teacher: string
  imageUrl?: string // optional, bisa null dari DB
}

interface ClassCardProps {
  data: ClassData
}

export function ClassCard({ data }: ClassCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow rounded-2xl">
      <CardContent className="flex p-0">
        {/* Gambar ilustrasi */}
        <div className="relative w-24 md:w-28 lg:w-32 aspect-[3/4] shrink-0">
          <Image
            src={data.imageUrl || '/images/default.png'}
            alt={data.subject}
            fill
            className="object-cover rounded-l-2xl"
          />
        </div>

        {/* Konten utama */}
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
        </div>
      </CardContent>
    </Card>
  )
}
