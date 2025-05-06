'use client';

import Image from 'next/image';
import toast from 'react-hot-toast';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
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
import { useState } from 'react';

interface ClassData {
  id: number;
  subject: string;
  class: string;
  taskDate: string;
  taskTime: string;
  hasNewMaterial: boolean;
  hasExam: boolean;
  teacher: string;
  imageUrl?: string;
  isActive: boolean;
  isEditable?: boolean;
}

interface ClassCardProps {
  data: ClassData;
}

export function ClassCard({ data }: ClassCardProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);

  const toggleMutation = trpc.course.update.useMutation({
    onSuccess: () => utils.course.getByUserRole.invalidate(),
  });

  const deleteMutation = trpc.course.delete.useMutation({
    onSuccess: () => {
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
    toggleMutation.mutate({
      id: data.id,
      name: data.subject,
      description: '',
      educationLevel: 'SMP',
      grade: 7,
      isActive: !data.isActive,
    });
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
    deleteMutation.mutate(
      { id: data.id },
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

  return (
    <>
      <Card
        onClick={handleCardClick}
        className="overflow-hidden hover:shadow-md transition-shadow rounded-2xl relative cursor-pointer"
      >
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
              <div className="mt-3 flex items-center justify-end gap-2">
                <div onClick={handleToggleActive}>
                  <Switch
                    checked={data.isActive}
                    onClick={handleToggleActive}
                  />
                </div>
                <span className="text-sm ml-1">
                  {data.isActive ? 'Aktif' : 'Nonaktif'}
                </span>

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

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kelas</DialogTitle>
          </DialogHeader>
          <p>
            Yakin ingin menghapus kelas <strong>{data.subject}</strong>?
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
