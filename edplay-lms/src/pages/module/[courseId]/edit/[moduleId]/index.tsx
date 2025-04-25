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

export default function EditModulePage() {
  const router = useRouter();
  const params = useParams();
  const moduleIdParam = params?.moduleId;
  const moduleId = moduleIdParam ? Number(moduleIdParam) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contents, setContents] = useState<
    {
      type: 'TEXT' | 'FILE' | 'LINK' | 'VIDEO';
      contentData: string;
      filePath?: string;
      file?: File;
    }[]
  >([]);

  const { data: moduleData, isLoading } = trpc.module.getByModuleId.useQuery(
    { id: moduleId ?? 0 },
    { enabled: !!moduleId },
  );

  const updateModule = trpc.module.update.useMutation({
    onSuccess: () => {
      toast.success('Modul berhasil diperbarui');
      router.back();
    },
    onError: () => toast.error('Gagal memperbarui modul'),
  });

  useEffect(() => {
    if (moduleData) {
      setTitle(moduleData.title);
      setDescription(moduleData.description || '');
      setContents(
        moduleData.contents.map((c) => ({
          type: c.contentType.toUpperCase() as
            | 'TEXT'
            | 'FILE'
            | 'LINK'
            | 'VIDEO',
          contentData: c.contentData,
          filePath: c.filePath ?? undefined,
        })),
      );
    }
  }, [moduleData]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error('Judul tidak boleh kosong');
      return;
    }
    if (!moduleId) return;

    const uploads = await Promise.all(
      contents.map(async (c) => {
        if (c.type === 'FILE' && c.file) {
          const formData = new FormData();
          formData.append('file', c.file);
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const { path } = await res.json();
          return { ...c, contentData: '', filePath: path };
        }
        return c;
      }),
    );

    updateModule.mutate({
      id: moduleId,
      title,
      description,
      contents: uploads.map((c) => ({
        contentType: c.type,
        contentData:
          c.type === 'TEXT' ? sanitize(c.contentData) : c.contentData,
        filePath: c.filePath,
      })),
    });
  };

  if (!moduleId || isNaN(moduleId)) return <p>Modul tidak valid.</p>;
  if (isLoading || !moduleData) return <p>Loading...</p>;

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

        <h1 className="text-2xl font-bold">Edit Modul</h1>

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
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="FILE">File (PDF, PPT)</SelectItem>
                  <SelectItem value="LINK">Link</SelectItem>
                  <SelectItem value="VIDEO">YouTube</SelectItem>
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

            {c.type === 'TEXT' && (
              <RichTextEditor
                content={c.contentData}
                onChange={(val) => {
                  const newContents = [...contents];
                  newContents[i].contentData = val;
                  setContents(newContents);
                }}
              />
            )}

            {c.type === 'FILE' && (
              <>
                {c.filePath && (
                  <div className="text-sm text-gray-600 mb-1">
                    File saat ini:{' '}
                    <a
                      href={c.filePath}
                      target="_blank"
                      className="underline text-blue-600"
                    >
                      {c.filePath.split('/').pop()}
                    </a>
                  </div>
                )}
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
              </>
            )}

            {c.type === 'LINK' && (
              <>
                {c.contentData && (
                  <div className="text-sm text-gray-600 mb-1">
                    Link saat ini:{' '}
                    <a
                      href={c.contentData}
                      target="_blank"
                      className="underline text-blue-600"
                    >
                      {c.contentData}
                    </a>
                  </div>
                )}
                <Input
                  placeholder="https://..."
                  value={c.contentData}
                  onChange={(e) => {
                    const newContents = [...contents];
                    newContents[i].contentData = e.target.value;
                    setContents(newContents);
                  }}
                />
              </>
            )}

            {c.type === 'VIDEO' && (
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
              setContents([...contents, { type: 'TEXT', contentData: '' }])
            }
            className="w-full sm:w-auto bg-black text-white hover:bg-zinc-800"
          >
            + Tambah Konten
          </Button>

          <Button
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-800"
            onClick={handleUpdate}
            disabled={title.trim() === ''}
          >
            Perbarui Modul
          </Button>
        </div>
      </div>
    </div>
  );
}
