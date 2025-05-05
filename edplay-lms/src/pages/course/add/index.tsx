'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectItem } from '~/components/ui/select'
import { trpc } from '~/utils/trpc'

export default function AddCoursePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    description: '',
    educationLevel: 'SD',
    grade: 1,
    imageUrl: '',
  })

  const createCourse = trpc.course.create.useMutation({
    onSuccess: () => router.push('/'),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'grade' ? Number(value) : value })
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Tambah Kelas</h1>

      <Input label="Nama Kelas" name="name" value={form.name} onChange={handleChange} className="mb-3" />
      <Input label="Deskripsi" name="description" value={form.description} onChange={handleChange} className="mb-3" />
      <Select label="Jenjang" name="educationLevel" value={form.educationLevel} onChange={handleChange} className="mb-3">
        <SelectItem value="SD">SD</SelectItem>
        <SelectItem value="SMP">SMP</SelectItem>
        <SelectItem value="SMA">SMA</SelectItem>
      </Select>
      <Input label="Kelas (Grade)" name="grade" type="number" value={form.grade} onChange={handleChange} className="mb-3" />
      <Input label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="mb-3" />

      <Button onClick={() => createCourse.mutate(form)}>Simpan</Button>
    </div>
  )
}
