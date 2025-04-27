'use client';

import { useState } from 'react';
import Navbar from '../../NavbarAlt';
import TabNavigation from './TabNav';
import ContentView from './ContentView';
import ContentList from './ContentList';
import { trpc } from '~/utils/trpc';
import toast from 'react-hot-toast';
import { Menu, X } from 'lucide-react';

interface LearningPlatformProps {
  courseId: number;
}

interface SubmissionStudentItem {
  id: number;
  name: string;
  status: 'Sudah Mengumpulkan' | 'Belum Mengumpulkan';
}

export default function LearningPlatform({ courseId }: LearningPlatformProps) {
  const [activeTab, setActiveTab] = useState('Materi');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'default' | 'submissionList'>(
    'default',
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: modules = [] } = trpc.module.getByCourseId.useQuery({
    courseId,
  });
  const { data: assignments = [] } = trpc.assignment.getByCourseId.useQuery({
    courseId,
  });
  const { data: quizzes = [] } = trpc.quiz.getByCourseId.useQuery({ courseId });
  const { data: currentUser } = trpc.user.me.useQuery();
  const { data: submissions = [] } =
    trpc.assignment.getSubmissionsByAssignmentId.useQuery(
      { assignmentId: activeId ?? 0 },
      {
        enabled:
          activeTab === 'Tugas' && viewMode === 'submissionList' && !!activeId,
      },
    );

  const studentItems: SubmissionStudentItem[] = submissions.map((s) => ({
    id: s.user.user_id,
    name: s.user.fullname ?? '',
    status:
      s.answerText || s.answerFile
        ? 'Sudah Mengumpulkan'
        : 'Belum Mengumpulkan',
  }));

  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin';
  const isAllowed = isTeacher || isAdmin;

  const utils = trpc.useUtils();
  const deleteModule = trpc.module.delete.useMutation();
  const deleteAssignment = trpc.assignment.delete.useMutation();
  const deleteQuiz = trpc.quiz.delete.useMutation();

  const handleDelete = async (
    id: number,
    type: 'modul' | 'tugas' | 'ujian',
  ) => {
    let previousData: any[] = [];
    let invalidate: () => Promise<any>;

    if (type === 'modul') {
      previousData = modules;
      utils.module.getByCourseId.setData(
        { courseId },
        modules.filter((m) => m.id !== id),
      );
      invalidate = () => utils.module.getByCourseId.invalidate({ courseId });
      deleteModule.mutate(
        { id },
        {
          onError: () => {
            utils.module.getByCourseId.setData({ courseId }, previousData);
            toast.error('Gagal menghapus modul');
          },
          onSuccess: () => toast.success('Modul berhasil dihapus'),
          onSettled: invalidate,
        },
      );
    }
    if (type === 'tugas') {
      previousData = assignments;
      utils.assignment.getByCourseId.setData(
        { courseId },
        assignments.filter((a) => a.id !== id),
      );
      invalidate = () =>
        utils.assignment.getByCourseId.invalidate({ courseId });
      deleteAssignment.mutate(
        { id },
        {
          onError: () => {
            utils.assignment.getByCourseId.setData({ courseId }, previousData);
            toast.error('Gagal menghapus tugas');
          },
          onSuccess: () => toast.success('Tugas berhasil dihapus'),
          onSettled: invalidate,
        },
      );
    }
    if (type === 'ujian') {
      previousData = quizzes;
      utils.quiz.getByCourseId.setData(
        { courseId },
        quizzes.filter((q) => q.id !== id),
      );
      invalidate = () => utils.quiz.getByCourseId.invalidate({ courseId });
      deleteQuiz.mutate(
        { id },
        {
          onError: () => {
            utils.quiz.getByCourseId.setData({ courseId }, previousData);
            toast.error('Gagal menghapus ujian');
          },
          onSuccess: () => toast.success('Ujian berhasil dihapus'),
          onSettled: invalidate,
        },
      );
    }
  };

  const activeItem = (() => {
    if (activeTab === 'Materi') return modules.find((m) => m.id === activeId);
    if (activeTab === 'Tugas')
      return assignments.find((a) => a.id === activeId);
    if (activeTab === 'Ujian') return quizzes.find((q) => q.id === activeId);
    return null;
  })();

  const renderSidebarContent = (onSelectItem: (id: number) => void) => {
    const commonProps = {
      activeId,
      onSelect: onSelectItem,
      isTeacher: isAllowed,
      courseId,
      onDelete: handleDelete,
      viewMode,
      setViewMode,
      setActiveId,
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
    if (activeTab === 'Tugas' && viewMode === 'default') {
      return (
        <ContentList
          {...commonProps}
          items={assignments}
          renderTitle={(t) => t.title}
          typeLabel="Tugas"
        />
      );
    }
    if (activeTab === 'Tugas' && viewMode === 'submissionList') {
      return (
        <ContentList
          {...commonProps}
          items={studentItems}
          renderTitle={(s) => `${s.name} - ${s.status}`}
          typeLabel="Murid"
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

  const renderContentPanel = () => {
    if (!activeItem) return <p className="p-4">Pilih item di samping.</p>;

    if (activeTab === 'Materi') {
      const item = activeItem as (typeof modules)[0];
      return (
        <div className=" bg-white p-4 rounded-md shadow-md">
          <ContentView
            title={item.title}
            contents={item.contents.map((c) => ({
              id: c.id,
              contentTitle: c.contentTitle,
              contentType: c.contentType.toUpperCase() as
                | 'TEXT'
                | 'VIDEO'
                | 'FILE'
                | 'LINK',
              contentData: c.contentData,
              filePath: c.filePath ?? undefined,
            }))}
            description={item.description || ''}
          />
        </div>
      );
    }
    if (activeTab === 'Tugas') {
      const item = activeItem as (typeof assignments)[0];
      return (
        <div className="bg-white p-4 rounded-md shadow-md">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          {item.description && (
            <p className="text-gray-700 mt-1">{item.description}</p>
          )}
          {item.dueDate && (
            <p className="text-sm text-red-600 mt-1">
              Deadline:{' '}
              {new Date(item.dueDate).toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
          <ContentView
            title=""
            description=""
            contents={item.contents.map((c) => ({
              id: c.id,
              contentTitle: c.contentTitle,
              contentType: c.contentType.toUpperCase() as
                | 'TEXT'
                | 'VIDEO'
                | 'FILE'
                | 'LINK',
              contentData: c.contentData,
              filePath: c.filePath ?? undefined,
            }))}
          />
        </div>
      );
    }
    if (activeTab === 'Ujian') {
      const item = activeItem as (typeof quizzes)[0];
      return (
        <ContentView
          title={item.title}
          description={item.description || ''}
          contents={[]}
        />
      );
    }
    return <p className="p-4">Pilih item di samping.</p>;
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] relative">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hamburger untuk Mobile */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#2E3E83] p-2"
          >
            {sidebarOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        <TabNavigation
          tabs={['Informasi', 'Materi', 'Tugas', 'Ujian']}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setActiveId(null);
            setViewMode('default'); // Reset ke default setiap ganti tab
            setSidebarOpen(false);
          }}
        />

        {['Materi', 'Tugas', 'Ujian'].includes(activeTab) && (
          <div className="mt-6 flex flex-col md:flex-row gap-6 relative">
            {/* Sidebar */}
            <div
              className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 md:w-[280px] md:min-w-[280px] md:max-w-[280px] md:rounded-lg md:shadow-md z-40`}
            >
              {renderSidebarContent(setActiveId)}
            </div>

            {/* Overlay blur saat sidebar open */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}

            {/* Main Content */}
            <div className="w-full md:w-9/12">{renderContentPanel()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
