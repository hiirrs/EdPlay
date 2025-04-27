'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface ContentListProps<T> {
  items: T[];
  activeId: number | null;
  onSelect: (id: number) => void;
  renderTitle: (item: T) => string;
  typeLabel?: string;
  isTeacher?: boolean;
  courseId?: number;
  onDelete: (id: number, type: 'modul' | 'tugas' | 'ujian') => void;
  viewMode: 'default' | 'submissionList';
  setViewMode: React.Dispatch<
    React.SetStateAction<'default' | 'submissionList'>
  >;
  setActiveId: React.Dispatch<React.SetStateAction<number | null>>;
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
  viewMode,
  setViewMode,
  // setActiveId,
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
    const path = {
      modul: 'module',
      tugas: 'assignment',
      ujian: 'quiz',
    }[typeLabel.toLowerCase() as 'modul' | 'tugas' | 'ujian'];
    if (path) router.push(`${courseId}/${path}/add`);
  };

  const handleEditClick = (itemId: number) => {
    if (!courseId) return;
    const path = {
      modul: 'module',
      tugas: 'assignment',
      ujian: 'quiz',
    }[typeLabel.toLowerCase() as 'modul' | 'tugas' | 'ujian'];
    if (path) router.push(`${courseId}/${path}/${itemId}/edit`);
  };

  const handleConfirmDelete = () => {
    if (selectedItemId !== null && selectedType) {
      onDelete(selectedItemId, selectedType);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
                onClick={handleConfirmDelete}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tombol di atas List */}
      {isTeacher && (
        <div className="flex flex-col gap-2 p-2">
          {/* Toggle List Murid / List Tugas */}
          {typeLabel.toLowerCase() === 'tugas' && (
            <Button
              disabled={!activeId}
              onClick={() => {
                if (!activeId) return;
                setViewMode((prev) =>
                  prev === 'default' ? 'submissionList' : 'default',
                );
              }}
              className={`w-full text-xs transition ${
                viewMode === 'submissionList'
                  ? 'bg-green-700 hover:bg-green-800 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {viewMode === 'default' ? 'List Murid' : 'List Tugas'}
            </Button>
          )}

          {viewMode === 'submissionList' && (
            <Button
              onClick={() => {
                if (!activeId) return;
                setViewMode((prev) =>
                  prev === 'default' ? 'submissionList' : 'default',
                );
              }}
              className={`w-full text-xs transition ${
                viewMode === 'submissionList'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {viewMode === 'submissionList' ? 'List Tugas' : 'List Murid'}
            </Button>
          )}

          <Button
              onClick={handleAddClick}
              className={`${color.addBtn} w-full text-white text-xs hover:opacity-80 transition`}
            >
              + Tambah {typeLabel}
            </Button>
        </div>
      )}

      {/* List Item */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md mt-2">
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="p-6 text-center text-gray-400 text-sm"
            >
              Belum ada data
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between p-3 border-t cursor-pointer transition-colors w-full ${
                  activeId === item.id ? color.activeBg : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelect(item.id)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div
                    className={`${color.badge} rounded-md text-center w-14 py-1 border`}
                  >
                    <div className="text-xs font-medium">{typeLabel}</div>
                    <div className="font-bold">{item.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {renderTitle(item)}
                    </span>
                  </div>
                </div>

                {/* Tombol Edit dan Delete */}
                {isTeacher && (
                  <div
                    className="flex items-center gap-2 pl-2 pr-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleEditClick(item.id)}
                      className={color.icon}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setSelectedType(
                          typeLabel.toLowerCase() as
                            | 'modul'
                            | 'tugas'
                            | 'ujian',
                        );
                        setShowConfirmModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
