'use client';

import { useState } from 'react';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { trpc } from '~/utils/trpc';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AddCoursePage() {
  const router = useRouter();
  const createCourse = trpc.course.create.useMutation();
  const { data: currentUser } = trpc.user.me.useQuery();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [educationLevel, setEducationLevel] = useState<'SD' | 'SMP' | 'SMA'>('SMA');
  const [grade, setGrade] = useState(10);
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-course-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.path);
        toast.success('Gambar berhasil diunggah');
      } else {
        throw new Error(data.error || 'Upload gagal');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunggah gambar');
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Nama kelas wajib diisi');
      return;
    }

    try {
      await createCourse.mutateAsync({
        name,
        description,
        educationLevel,
        grade,
        schoolId: currentUser?.schoolId || undefined,
        imageUrl,
      });
      toast.success('Kelas berhasil dibuat');
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Gagal membuat kelas');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] px-4 py-4">
      <div className="w-full max-w-3xl mx-auto space-y-4 bg-white rounded-lg shadow-md p-6">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#f4aa1f]">
          ← Kembali
        </Button>

        <h1 className="text-2xl font-bold mb-2">Tambah Kelas</h1>

        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Kelas" />
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi Kelas" />

        <div className="space-y-2">
          <label className="text-sm font-medium">Unggah Gambar Kelas (Opsional)</label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imageUrl && <p className="text-sm text-green-600">Gambar berhasil diunggah</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Jenjang Pendidikan</label>
          <select
            className="w-full border rounded p-2"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value as any)}
          >
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tingkat Kelas</label>
          <Input
            type="number"
            min={1}
            max={12}
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
          />
        </div>

        <Button onClick={handleCreate} className="bg-blue-600 text-white w-full sm:w-auto">
          Buat Kelas
        </Button>
      </div>
    </div>
  );
}
