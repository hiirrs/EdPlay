'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { trpc } from '~/utils/trpc';
import toast from 'react-hot-toast';
import { useContentStore } from '~/stores/contentStore';
import RichTextEditor from '~/components/RichTextEditor';
import { Trash2 } from 'lucide-react';

export default function AddAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params?.courseId);

  const { contents, addContent, updateContent, removeContent, resetContents } = useContentStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('');

  const createAssignment = trpc.assignment.create.useMutation({
    onSuccess: () => {
      toast.success('Tugas berhasil dibuat');
      resetContents();
      router.back();
    },
    onError: () => toast.error('Gagal membuat tugas'),
  });

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Judul tidak boleh kosong');
      return;
    }
    if (!dueDate.trim()) {
      toast.error('Tanggal Deadline wajib diisi');
      return;
    }

    const due = new Date(dueDate);
    const now = new Date();
    if (due <= now) {
      toast.error('Tanggal Deadline harus setelah waktu saat ini');
      return;
    }

    const uploads = await Promise.all(
      contents.map(async (c) => {
        if (c.contentType === 'FILE' && c.file) {
          const formData = new FormData();
          formData.append('file', c.file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const { path } = await res.json();
          return { ...c, filePath: path };
        }
        return c;
      })
    );

    createAssignment.mutate({
      courseId,
      title,
      description,
      dueDate: due,
      contents: uploads.map((c) => ({
        contentTitle: c.contentTitle,
        contentType: c.contentType,
        contentData: c.contentData,
        filePath: c.filePath,
      })),
    });
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#f4aa1f]">
          ← Kembali
        </Button>

        <h1 className="text-2xl font-bold">Tambah Tugas</h1>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul Tugas *"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi Tugas"
        />
        <Input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Tanggal Deadline *"
        />

        {contents.map((c) => (
          <div key={c.id} className="border p-4 rounded-md bg-[#FDFDFD] shadow-sm space-y-2">
            <Input
              value={c.contentTitle}
              onChange={(e) => updateContent(c.id, { contentTitle: e.target.value })}
              placeholder="Judul Konten"
            />
            <div className="flex items-center gap-2">
              <Select
                value={c.contentType}
                onValueChange={(val) => updateContent(c.id, {
                  contentType: val as 'TEXT' | 'FILE' | 'LINK' | 'VIDEO',
                  contentData: '',
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih tipe konten" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="FILE">File (PDF, PPT)</SelectItem>
                  <SelectItem value="LINK">Link</SelectItem>
                  <SelectItem value="VIDEO">YouTube</SelectItem>
                </SelectContent>
              </Select>
              <Trash2
                onClick={() => removeContent(c.id)}
                className="text-red-600 hover:text-red-800 cursor-pointer"
              />
            </div>

            {c.contentType === 'TEXT' && (
              <RichTextEditor
                content={c.contentData}
                onChange={(val) => updateContent(c.id, { contentData: val })}
              />
            )}
            {(c.contentType === 'LINK' || c.contentType === 'VIDEO') && (
              <Input
                value={c.contentData}
                placeholder={c.contentType === 'LINK' ? "https://..." : "YouTube Link"}
                onChange={(e) => updateContent(c.id, { contentData: e.target.value })}
              />
            )}
            {c.contentType === 'FILE' && (
              <Input
                type="file"
                accept="application/pdf,application/vnd.ms-powerpoint"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateContent(c.id, { file });
                }}
              />
            )}
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => addContent({ id: Date.now(), contentTitle: '', contentType: 'TEXT', contentData: '' })}
            className="w-full sm:w-auto bg-black text-white"
          >
            + Tambah Konten
          </Button>

          <Button
            onClick={handleCreate}
            className="w-full sm:w-auto bg-blue-600 text-white"
            disabled={!title.trim() || !dueDate.trim()}
          >
            Buat Tugas
          </Button>
        </div>
      </div>
    </div>
  );
}