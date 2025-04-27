'use client';

import { useEffect, useState, useRef } from 'react'; 
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '~/utils/trpc';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { sanitize } from '~/utils/sanitize';
import { useContentStore } from '~/stores/contentStore';
import RichTextEditor from '~/components/RichTextEditor';

export default function EditModulePage() {
  const router = useRouter();
  const params = useParams();
  const moduleIdParam = params?.moduleId;
  const moduleId = moduleIdParam ? Number(moduleIdParam) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const {
    contents,
    addContent,
    updateContent,
    removeContent,
    initializeContents,
    resetContents,
  } = useContentStore();

  const { data: moduleData, isLoading } = trpc.module.getByModuleId.useQuery(
    { id: moduleId ?? 0 },
    { enabled: !!moduleId }
  );

  const updateModule = trpc.module.update.useMutation({
    onSuccess: () => {
      toast.success('Modul berhasil diperbarui');
      resetContents();
      router.back();
    },
    onError: () => toast.error('Gagal memperbarui modul'),
  });

  const initializedRef = useRef(false); // Tambahkan ini

  useEffect(() => {
    if (moduleData && !initializedRef.current) {
      setTitle(moduleData.title);
      setDescription(moduleData.description || '');
      initializeContents(
        moduleData.contents.map((c) => ({
          contentTitle: c.contentTitle ?? '',
          contentType: c.contentType as 'TEXT' | 'FILE' | 'LINK' | 'VIDEO',
          contentData: c.contentData,
          filePath: c.filePath ?? undefined,
        }))
      );
      initializedRef.current = true; 
    }
  }, [moduleData, initializeContents]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error('Judul tidak boleh kosong');
      return;
    }
    if (!moduleId) return;

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

    updateModule.mutate({
      id: moduleId,
      title,
      description,
      contents: uploads.map((c) => ({
        contentTitle: c.contentTitle,
        contentType: c.contentType,
        contentData: c.contentType === 'TEXT' ? sanitize(c.contentData) : c.contentData,
        filePath: c.filePath,
      })),
    });
  };

  if (!moduleId || isNaN(moduleId)) return <p>Modul tidak valid.</p>;
  if (isLoading || !moduleData) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#FDF8F4] px-4 py-4">
      <div className="w-full max-w-3xl mx-auto space-y-4 bg-white rounded-lg shadow-md p-6">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#f4aa1f] hover:bg-gray-100 px-1 py-4">
          ← Kembali
        </Button>

        <h1 className="text-2xl font-bold">Edit Modul</h1>

        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul Modul" />
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi" />

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
              <Trash2 onClick={() => removeContent(c.id)} className="text-red-600 hover:text-red-800 cursor-pointer" />
            </div>

            {c.contentType === 'TEXT' && (
              <RichTextEditor content={c.contentData} onChange={(val) => updateContent(c.id, { contentData: val })} />
            )}
            {(c.contentType === 'LINK' || c.contentType === 'VIDEO') && (
              <Input
                value={c.contentData}
                placeholder={c.contentType === 'LINK' ? "https://..." : "YouTube Link"}
                onChange={(e) => updateContent(c.id, { contentData: e.target.value })}
              />
            )}
            {c.contentType === 'FILE' && (
              <>
                {c.filePath && (
                  <div className="text-sm text-gray-600 mb-1">
                    File saat ini: <a href={c.filePath} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{c.filePath.split('/').pop()}</a>
                  </div>
                )}
                <Input
                  type="file"
                  accept="application/pdf,application/vnd.ms-powerpoint"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) updateContent(c.id, { file });
                  }}
                />
              </>
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
            onClick={handleUpdate}
            className="w-full sm:w-auto bg-blue-600 text-white"
            disabled={!title.trim()}
          >
            Perbarui Modul
          </Button>
        </div>
      </div>
    </div>
  );
}
