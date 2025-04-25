'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '~/components/ui/button';

interface ContentListProps<T> {
  items: T[];
  activeId: number | null;
  onSelect: (id: number) => void;
  renderTitle: (item: T) => string;
  typeLabel?: string;
  isTeacher?: boolean;
  courseId?: number;
  onDelete: (id: number, type: 'modul' | 'tugas' | 'ujian') => void;
}

function getColor(typeLabel: string) {
  switch (typeLabel.toLowerCase()) {
    case 'modul':
      return {
        badge: 'bg-blue-100 border-blue-400 text-[#2E3E83]',
        addBtn: 'bg-[#2E3E83] hover:bg-blue-900',
        icon: 'text-blue-600 hover:text-blue-800',
        activeBg: 'bg-blue-50',
      };
    case 'tugas':
      return {
        badge: 'bg-yellow-100 border-yellow-400 text-[#2E3E83]',
        addBtn: 'bg-yellow-500 hover:bg-yellow-600',
        icon: 'text-yellow-600 hover:text-yellow-800',
        activeBg: 'bg-yellow-50',
      };
    case 'ujian':
      return {
        badge: 'bg-red-100 border-red-400 text-[#2E3E83]',
        addBtn: 'bg-red-500 hover:bg-red-600',
        icon: 'text-red-600 hover:text-red-800',
        activeBg: 'bg-red-50',
      };
    case 'informasi':
      return {
        badge: 'bg-green-100 border-green-400 text-[#2E3E83]',
        addBtn: 'bg-green-500 hover:bg-green-600',
        icon: 'text-green-600 hover:text-green-800',
        activeBg: 'bg-green-50',
      };
    default:
      return {
        badge: 'bg-gray-100 border-gray-400 text-[#2E3E83]',
        addBtn: 'bg-gray-500 hover:bg-gray-600',
        icon: 'text-gray-600 hover:text-gray-800',
        activeBg: 'bg-gray-50',
      };
  }
}

export default function ContentList<T extends { id: number }>({
  items,
  activeId,
  onSelect,
  renderTitle,
  typeLabel = 'Item',
  isTeacher = false,
  courseId,
  onDelete,
}: ContentListProps<T>) {
  const color = getColor(typeLabel);
  const router = useRouter();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<
    'modul' | 'tugas' | 'ujian' | null
  >(null);

  const handleAddClick = () => {
    if (!courseId) return;
    if (typeLabel.toLowerCase() === 'modul') {
      router.push(`/module/${courseId}/add`);
    } else if (typeLabel.toLowerCase() === 'tugas') {
      router.push(`/assignment/${courseId}/add`);
    } else if (typeLabel.toLowerCase() === 'ujian') {
      router.push(`/quiz/${courseId}/add`);
    }
  };

  const handleEditClick = (itemId: number) => {
    if(!courseId) return;
    const basePath = {
      modul: 'module',
      tugas: 'assignment',
      ujian: 'quiz',
    }[typeLabel.toLocaleLowerCase() as 'modul' | 'tugas' | 'ujian'];

    if (basePath) {
      router.push(`/${basePath}/${courseId}/edit/${itemId}`);
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {showConfirmModal && selectedItemId !== null && selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus {selectedType} ini?</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Batal
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  onDelete(selectedItemId, selectedType);
                  setShowConfirmModal(false);
                }}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
      {isTeacher && (
        <div className="flex justify-end p-2">
          <button
            onClick={() => handleAddClick()}
            className={`${color.addBtn} text-white text-xs px-3 py-1 rounded hover:bg-green-600`}
          >
            + Tambah {typeLabel}
          </button>
        </div>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center justify-between p-2 border-b last:border-b-0 cursor-pointer 
            transition-colors ${activeId === item.id ? color.activeBg : 'hover:bg-gray-50'}`}
          onClick={() => onSelect(item.id)}
        >
          {/* Left info */}
          <div className="flex items-center gap-2">
            <div
              className={`${color.badge} text-[#2E3E83] rounded-md text-center w-14 py-1 border border-yellow-400`}
            >
              <div className="text-xs font-medium">{typeLabel}</div>
              <div className="font-bold">{item.id}</div>
            </div>
            <span className="text-sm font-semibold">{renderTitle(item)}</span>
          </div>

          {isTeacher && (
            <div
              className="flex items-center gap-2 pr-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleEditClick(item.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => {
                  setSelectedItemId(item.id);
                  setSelectedType(
                    typeLabel.toLowerCase() as 'modul' | 'tugas' | 'ujian',
                  );
                  setShowConfirmModal(true);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
