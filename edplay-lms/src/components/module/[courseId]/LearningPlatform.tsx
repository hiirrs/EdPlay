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

  const deleteModule = trpc.module.delete.useMutation({
    onSuccess: () => {
      toast.success('Modul berhasil dihapus');
      utils.module.getByCourseId.invalidate({ courseId });
    },
  });
  
  const deleteAssignment = trpc.assignment.delete.useMutation({
    onSuccess: () => {
      toast.success('Tugas berhasil dihapus');
      utils.assignment.getByCourseId.invalidate({ courseId });
    },
  });
  
  const deleteQuiz = trpc.quiz.delete.useMutation({
    onSuccess: () => {
      toast.success('Ujian berhasil dihapus');
      utils.quiz.getByCourseId.invalidate({ courseId });
    },
  });
  
  const handleDelete = (id: number, type: 'modul' | 'tugas' | 'ujian') => {
    if (!confirm(`Yakin ingin menghapus ${type.toLowerCase()} ini?`)) return;
  
    switch (type) {
      case 'modul':
        deleteModule.mutate({ id });
        break;
      case 'tugas':
        deleteAssignment.mutate({ id });
        break;
      case 'ujian':
        deleteQuiz.mutate({ id });
        break;
    }
  }


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
      return <ContentView title={item.title} description={item.description || ''} contents={[]}/>;
    }

    return <p>Silakan pilih tab.</p>;
  };

  const renderSidebarContent = (onSelectItem: (id: number) => void) => {
    if (activeTab === 'Materi') {
      return (
        <ContentList
          items={modules}
          activeId={activeId}
          onSelect={onSelectItem}
          renderTitle={(m) => m.title}
          typeLabel="Modul"
          isTeacher={isAllowed}
          courseId={courseId}
          onDelete={(id) => {
            deleteModule.mutate({ id });
          }}
        />
      );
    }

    if (activeTab === 'Tugas') {
      return (
        <ContentList
          items={assignments}
          activeId={activeId}
          onSelect={onSelectItem}
          renderTitle={(t) => t.title}
          typeLabel="Tugas"
          isTeacher={isAllowed}
          courseId={courseId}
          onDelete={handleDelete}
        />
      );
    }

    if (activeTab === 'Ujian') {
      return (
        <ContentList
          items={quizzes}
          activeId={activeId}
          onSelect={onSelectItem}
          renderTitle={(q) => q.title}
          typeLabel="Ujian"
          isTeacher={isAllowed}
          courseId={courseId}
          onDelete={handleDelete}
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
