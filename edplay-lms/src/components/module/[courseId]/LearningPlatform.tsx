'use client';

import { useState } from 'react';
import Navbar from '../../NavbarAlt';
import TabNavigation from './TabNav';
import ContentView from './ContentView';
import ContentList from './ContentList';
import { trpc } from '~/utils/trpc';
import toast from 'react-hot-toast';

interface LearningPlatformProps {
  courseId: number;
}

export default function LearningPlatform({ courseId }: LearningPlatformProps) {
  const [activeTab, setActiveTab] = useState<string>('Materi');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: modules = [] } = trpc.module.getByCourseId.useQuery({ courseId });
  const { data: assignments = [] } = trpc.assignment.getByCourseId.useQuery({ courseId });
  const { data: quizzes = [] } = trpc.quiz.getByCourseId.useQuery({ courseId });
  const { data: currentUser } = trpc.user.me.useQuery();
  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin';
  const isAllowed = isTeacher || isAdmin;

  const utils = trpc.useUtils();

  const deleteModule = trpc.module.delete.useMutation();
  const deleteAssignment = trpc.assignment.delete.useMutation();
  const deleteQuiz = trpc.quiz.delete.useMutation();

  const handleDelete = async (id: number, type: 'modul' | 'tugas' | 'ujian') => {
    let previousData: any[] = [];
    let invalidate: () => Promise<any>;

    if (type === 'modul') {
      previousData = modules;
      utils.module.getByCourseId.setData({ courseId }, modules.filter((m) => m.id !== id));
      invalidate = () => utils.module.getByCourseId.invalidate({ courseId });
      deleteModule.mutate(
        { id },
        {
          onError: () => {
            utils.module.getByCourseId.setData({ courseId }, previousData);
            toast.error('Gagal menghapus modul');
          },
          onSuccess: () => {
            toast.success('Modul berhasil dihapus');
          },
          onSettled: async () => {
            await invalidate();
          },
        }
      );
    }

    if (type === 'tugas') {
      previousData = assignments;
      utils.assignment.getByCourseId.setData({ courseId }, assignments.filter((a) => a.id !== id));
      invalidate = () => utils.assignment.getByCourseId.invalidate({ courseId });
      deleteAssignment.mutate(
        { id },
        {
          onError: () => {
            utils.assignment.getByCourseId.setData({ courseId }, previousData);
            toast.error('Gagal menghapus tugas');
          },
          onSuccess: () => {
            toast.success('Tugas berhasil dihapus');
          },
          onSettled: async () => {
            await invalidate();
          },
        }
      );
    }

    if (type === 'ujian') {
      previousData = quizzes;
      utils.quiz.getByCourseId.setData({ courseId }, quizzes.filter((q) => q.id !== id));
      invalidate = () => utils.quiz.getByCourseId.invalidate({ courseId });
      deleteQuiz.mutate(
        { id },
        {
          onError: () => {
            utils.quiz.getByCourseId.setData({ courseId }, previousData);
            toast.error('Gagal menghapus ujian');
          },
          onSuccess: () => {
            toast.success('Ujian berhasil dihapus');
          },
          onSettled: async () => {
            await invalidate();
          },
        }
      );
    }
  };

  const activeItem = (() => {
    if (activeTab === 'Materi') return modules.find((m) => m.id === activeId);
    if (activeTab === 'Tugas') return assignments.find((a) => a.id === activeId);
    if (activeTab === 'Ujian') return quizzes.find((q) => q.id === activeId);
    return null;
  })();

  const renderContentPanel = () => {
    if (!activeItem) return <p>Pilih item di samping.</p>;

    if (activeTab === 'Materi') {
      const item = activeItem as (typeof modules)[0];
      return (
        <ContentView
          title={item.title}
          contents={item.contents.map((c) => ({
            id: c.id,
            contentTitle: c.contentTitle,
            contentType: c.contentType.toUpperCase() as 'TEXT' | 'VIDEO' | 'FILE' | 'LINK',
            contentData: c.contentData,
            filePath: c.filePath ?? undefined
          }))}
          description={item.description || ''}
        />
      );
    }

    if (activeTab === 'Tugas' || activeTab === 'Ujian') {
      const item = activeItem as (typeof assignments)[0];
      return <ContentView title={item.title} description={item.description || ''} contents={[]} />;
    }

    return <p>Silakan pilih tab.</p>;
  };

  const renderSidebarContent = (onSelectItem: (id: number) => void) => {
    const commonProps = {
      activeId,
      onSelect: onSelectItem,
      isTeacher: isAllowed,
      courseId,
      onDelete: handleDelete,
    };

    if (activeTab === 'Materi') {
      return (
        <ContentList
          {...commonProps}
          items={modules}
          renderTitle={(m) => m.title}
          typeLabel="Modul"
        />
      );
    }

    if (activeTab === 'Tugas') {
      return (
        <ContentList
          {...commonProps}
          items={assignments}
          renderTitle={(t) => t.title}
          typeLabel="Tugas"
        />
      );
    }

    if (activeTab === 'Ujian') {
      return (
        <ContentList
          {...commonProps}
          items={quizzes}
          renderTitle={(q) => q.title}
          typeLabel="Ujian"
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl rounded-lg">
        {/* Mobile sidebar toggle */}
        <div className="flex justify-between items-center md:hidden mb-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#2E3E83] text-2xl px-2 py-1"
          >
            ☰
          </button>
        </div>

        <TabNavigation
          tabs={['Informasi', 'Materi', 'Tugas', 'Ujian']}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setActiveId(null);
          }}
        />

        {['Materi', 'Tugas', 'Ujian'].includes(activeTab) && (
          <div className="mt-6 flex flex-col md:flex-row gap-6">
            {/* Mobile Drawer */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-50 bg-black bg-opacity-30"
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-lg">Daftar {activeTab}</span>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="text-gray-600 hover:text-black text-xl"
                    >
                      ×
                    </button>
                  </div>
                  {renderSidebarContent((id) => {
                    setActiveId(id);
                    setSidebarOpen(false);
                  })}
                </div>
              </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:block md:w-3/12">
              {renderSidebarContent(setActiveId)}
            </div>

            {/* Main Content */}
            <div className="w-full md:w-9/12">
              {renderContentPanel()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
