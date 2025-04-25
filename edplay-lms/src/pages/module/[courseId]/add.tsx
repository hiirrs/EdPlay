'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '~/utils/trpc';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { toast } from 'react-hot-toast';
import RichTextEditor from '~/components/RichTextEditor';
import { sanitize } from '~/utils/sanitize';
import { Trash2 } from 'lucide-react';

export default function AddModulePage() {
  const router = useRouter();
  const params = useParams();
  const courseIdParam = params?.courseId as string;
  const [courseId, setCourseId] = useState<number | null>(null);

  useEffect(() => {
    const id = Number(courseIdParam);
    if (!isNaN(id)) setCourseId(id);
  }, [courseIdParam]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contents, setContents] = useState<
    {
      type: 'text' | 'file' | 'link' | 'video';
      contentData: string;
      file?: File;
    }[]
  >([]);

  const addModule = trpc.module.create.useMutation({
    onSuccess: () => {
      toast.success('Modul berhasil ditambahkan');
      router.back();
    },
    onError: () => toast.error('Gagal menambahkan modul'),
  });

  const handleSubmit = async () => {
    if (!courseId) return;
    if (!title.trim()) {
      toast.error('Judul modul tidak boleh kosong');
      return;
    }

    const uploads = await Promise.all(
      contents.map(async (c) => {
        if (c.type === 'file' && c.file) {
          const formData = new FormData();
          formData.append('file', c.file);
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const { path } = await res.json();
          return { ...c, contentData: '', filePath: path };
        }
        return { ...c, filePath: undefined };
      }),
    );

    addModule.mutate({
      courseId,
      title,
      description,
      contents: uploads.map((c) => ({
        contentType: c.type,
        contentData:
          c.type === 'text' ? sanitize(c.contentData) : c.contentData,
        filePath: c.filePath,
      })),
    });
  };

  if (!courseId) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#FDF8F4] px-4 py-4">
      <div className="w-full px-4 sm:px-6 md:px-10 max-w-3xl mx-auto mt-6 md:mt-10 space-y-4 bg-white rounded-lg shadow-md p-6">
        <Button
          variant="ghost"
          className="text-[#f4aa1f] hover:bg-gray-100 px-1 py-4"
          onClick={() => router.back()}
        >
          ← Kembali
        </Button>

        <h1 className="text-2xl font-bold">Tambah Modul</h1>

        <Input
          className="border rounded-md px-4 py-0"
          placeholder="Judul Modul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {contents.map((c, i) => (
          <div
            key={i}
            className="border p-4 rounded-md space-y-2 bg-[#FDFDFD] shadow-sm"
          >
            <div className="flex justify-between items-center">
              <Select
                value={c.type}
                onValueChange={(val) => {
                  const newContents = [...contents];
                  newContents[i].type = val as any;
                  setContents(newContents);
                }}
              >
                <SelectTrigger className="w-full max-w-full mr-1">
                  <SelectValue placeholder="Pilih tipe konten" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="file">File (PDF, PPT)</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="video">YouTube</SelectItem>
                </SelectContent>
              </Select>

              <div title="Hapus konten ini">
                <Trash2
                  onClick={() => {
                    const newContents = [...contents];
                    newContents.splice(i, 1);
                    setContents(newContents);
                  }}
                  className="ml-4 -mt-2 text-red-600 hover:text-red-800"
                />
              </div>
            </div>

            {c.type === 'text' && (
              <RichTextEditor
                content={c.contentData}
                onChange={(val) => {
                  const newContents = [...contents];
                  newContents[i].contentData = val;
                  setContents(newContents);
                }}
              />
            )}

            {c.type === 'file' && (
              <Input
                type="file"
                accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const newContents = [...contents];
                  newContents[i].file = file;
                  setContents(newContents);
                }}
              />
            )}

            {c.type === 'link' && (
              <Input
                placeholder="https://..."
                value={c.contentData}
                onChange={(e) => {
                  const newContents = [...contents];
                  newContents[i].contentData = e.target.value;
                  setContents(newContents);
                }}
              />
            )}

            {c.type === 'video' && (
              <Input
                placeholder="YouTube Video ID"
                value={c.contentData}
                onChange={(e) => {
                  const newContents = [...contents];
                  newContents[i].contentData = e.target.value;
                  setContents(newContents);
                }}
              />
            )}
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() =>
              setContents([...contents, { type: 'text', contentData: '' }])
            }
            className="w-full sm:w-auto bg-black text-white hover:bg-zinc-800"
          >
            + Tambah Konten
          </Button>

          <Button
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-800"
            onClick={handleSubmit}
            disabled={title.trim() === ''}
          >
            Simpan Modul
          </Button>
        </div>
      </div>
    </div>
  );
}
