'use client';

import Image from 'next/image';
import toast from 'react-hot-toast';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Pencil, Trash2, Copy } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useRouter } from 'next/navigation';
import { trpc } from '~/utils/trpc';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { useState, useEffect } from 'react';

interface ClassData {
  id: number;
  subject: string;
  description: string;
  educationLevel: 'SD' | 'SMP' | 'SMA';
  grade: number;
  class: string;
  taskDate: string;
  taskTime: string;
  hasNewMaterial: boolean;
  hasExam: boolean;
  teacher: string;
  imageUrl?: string;
  isActive: boolean;
  isEditable?: boolean;
  token: string;
}

interface ClassCardProps {
  data: ClassData;
}

export function ClassCard({ data }: ClassCardProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [isActive, setIsActive] = useState(data.isActive);
  const [isToggling, setIsToggling] = useState(false);

  // Debug: Log received data to console
  useEffect(() => {
    console.log('ClassCard received data:', data);
  }, [data]);

  const toggleMutation = trpc.course.update.useMutation({
    onSuccess: () => {
      utils.course.getByUserRole.invalidate();
      setIsToggling(false);
      setIsActive(!isActive);
      toast.success(`Kelas ${isActive ? 'dinonaktifkan' : 'diaktifkan'}`);
    },
    onError: (error) => {
      setIsToggling(false);
      toast.error(
        'Gagal mengubah status kelas: ' +
          (error.message || 'Silakan coba lagi'),
      );
      console.error('Toggle error details:', error);
    },
  });

  const deleteMutation = trpc.course.delete.useMutation({
    onSuccess: () => {
      toast.success('Kelas berhasil dihapus');
      utils.course.getByUserRole.invalidate();
    },
    onError: (error) => {
      setShowConfirm(false);
      setPendingDelete(false);
      if (error.data?.code === 'FORBIDDEN') {
        toast.error('Kelas ini tidak dapat dihapus.');
      } else {
        toast.error('Gagal menghapus kelas. Silakan coba lagi.');
      }
    },
  });

  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isToggling) return;
    setIsToggling(true);

    // Ensure id is a valid number - Parse as int and verify
    const courseId = parseInt(String(data.id), 10);

    // Only proceed if we have a valid numeric ID
    if (isNaN(courseId)) {
      toast.error('ID kelas tidak valid');
      setIsToggling(false);
      return;
    }

    const updatePayload = {
      id: courseId,
      name: data.subject || '',
      description: data.description || '',
      educationLevel: data.educationLevel || 'SD',
      grade: typeof data.grade === 'number' ? data.grade : 1,
      isActive: !isActive,
      ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
    };

    console.log('Sending update payload:', updatePayload);

    toggleMutation.mutate(updatePayload);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/course/${data.id}?tab=Informasi`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const onConfirmDelete = () => {
    setPendingDelete(true);
    const courseId = parseInt(String(data.id), 10);

    if (isNaN(courseId)) {
      toast.error('ID kelas tidak valid');
      setPendingDelete(false);
      setShowConfirm(false);
      return;
    }

    deleteMutation.mutate(
      { id: courseId },
      {
        onSettled: () => {
          setShowConfirm(false);
          setPendingDelete(false);
        },
      },
    );
  };

  const handleCardClick = () => {
    router.push(`/course/${data.id}`);
  };

  const copyToken = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.token);
    toast.success('Token berhasil disalin');
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        className="h-[232px] overflow-hidden hover:shadow-md transition-shadow rounded-2xl relative cursor-pointer"
      >
        <CardContent className="flex p-0 h-full">
          {/* Gambar */}
          <div className="relative w-28 h-full shrink-0">
            <Image
              src={data.imageUrl || '/images/default.png'}
              alt={data.subject || 'Kelas'}
              fill
              className="object-cover rounded-l-2xl"
              sizes="96px"
            />
          </div>

          {/* Konten */}
          <div className="flex flex-1 flex-col justify-between p-3 overflow-hidden">
            <div className="overflow-hidden">
              <h3 className="font-bold text-lg truncate">
                {data.subject || 'Tidak diketahui'}
              </h3>
              <p className="text-gray-500 text-sm mb-2 truncate">
                Kelas: {data.class}
              </p>

              {/* Token */}
              <div className="flex items-center mb-2">
                <div className="bg-gray-100 text-gray-800 text-xs rounded px-2 py-1 flex items-center">
                  <span className="mr-1 truncate">
                    Token: {data.token || 'Tidak diketahui'}
                  </span>
                  {data.token && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={copyToken}
                      title="Salin token"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Informasi Tambahan atau Spacer */}
              {data.taskDate && data.taskTime ? (
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-600 truncate">
                    Tugas ({data.taskDate} @{data.taskTime})
                  </span>
                </div>
              ) : (
                <div className="h-5" /> // spacer
              )}

              {data.hasNewMaterial ? (
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-600 truncate">
                    Materi Baru
                  </span>
                </div>
              ) : (
                <div className="h-2" />
              )}

              {data.hasExam ? (
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-orange-600 mr-2"></div>
                  <span className="text-sm text-gray-600 truncate">Ujian</span>
                </div>
              ) : (
                <div className="h-2" />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 truncate">{data.teacher}</p>
              {data.isEditable && (
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8"
                    onClick={handleToggleActive}
                    disabled={isToggling}
                  >
                    <Switch checked={isActive} disabled={isToggling} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kelas</DialogTitle>
          </DialogHeader>
          <p>
            Yakin ingin menghapus kelas <strong>{data.subject || 'ini'}</strong>
            ?
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={pendingDelete}
            >
              {pendingDelete ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
