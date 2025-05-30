'use client';

import { useState, useMemo } from 'react';
import Navbar from '../../NavbarAlt';
import TabNavigation from './TabNav';
import ContentView from './ContentView';
import ContentList from './ContentList';
import AnswerView from './AnswerView';
import QuizView from './QuizView';
import { trpc } from '~/utils/trpc';
import toast from 'react-hot-toast';
import { Menu, X } from 'lucide-react';
import CourseInfoTab from './CourseInfoTab';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface LearningPlatformProps {
  courseId: number;
}

interface SubmissionStudentItem {
  id: number;
  name: string;
  grade: number;
  status: 'Sudah' | 'Belum';
}

export default function LearningPlatform({ courseId }: LearningPlatformProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const defaultTab = useMemo(() => {
    const tab = searchParams.get('tab');
    const validTabs = ['Informasi', 'Materi', 'Tugas', 'Ujian'];
    return validTabs.includes(tab ?? '') ? tab! : 'Materi';
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState(defaultTab);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'default' | 'submissionList'>(
    'default',
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [quizStarted, setQuizStarted] = useState(false);

  const { data: modules = [] } = trpc.module.getByCourseId.useQuery({
    courseId,
  });
  const { data: assignments = [] } = trpc.assignment.getByCourseId.useQuery({
    courseId,
  });
  const { data: quizzes = [] } = trpc.quiz.getByCourseId.useQuery({ courseId });
  const { data: currentUser } = trpc.user.me.useQuery();

  const { data: submissions = [] } =
    trpc.assignment.getEnrolledStudentsWithSubmission.useQuery(
      {
        assignmentId: activeId ?? 0,
        courseId,
      },
      {
        enabled:
          activeTab === 'Tugas' && viewMode === 'submissionList' && !!activeId,
      },
    );

  const { data: mySubmission, isLoading: isMySubmissionLoading } =
    trpc.assignmentSubmission.getMySubmission.useQuery(
      { assignmentId: activeId ?? 0 },
      {
        enabled: activeTab === 'Tugas' && !!activeId,
      },
    );

  const { data: studentSubmission } =
    trpc.assignmentSubmission.getByStudent.useQuery(
      {
        assignmentId: activeId ?? 0,
        studentId: selectedStudentId ?? 0,
      },
      {
        enabled:
          activeTab === 'Tugas' &&
          viewMode === 'submissionList' &&
          !!selectedStudentId &&
          !!activeId,
      },
    );

  const studentItems: SubmissionStudentItem[] = submissions.map((s) => ({
    id: s.id,
    name: s.name ?? '',
    grade: s.grade ?? 0,
    status: s.status === 'Sudah' ? 'Sudah' : 'Belum',
  }));

  const { data: quizQuestions = [] } = trpc.quiz.getQuestions.useQuery(
    { quizId: activeId ?? 0 },
    { enabled: activeTab === 'Ujian' && !!activeId },
  );

  const submitQuiz = trpc.quiz.submitAnswers.useMutation();

  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin';
  const isAllowed = isTeacher || isAdmin;

  const utils = trpc.useUtils();
  const deleteModule = trpc.module.delete.useMutation();
  const deleteAssignment = trpc.assignment.delete.useMutation();
  const deleteQuiz = trpc.quiz.delete.useMutation();
  const gradeSubmission =
    trpc.assignmentSubmission.gradeSubmission.useMutation();

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

  const handleSelectItem = (id: number) => {
    setActiveId(id);
    if (activeTab === 'Tugas' && viewMode === 'submissionList') {
      setSelectedStudentId(id);
    } else {
      setSelectedStudentId(null);
    }
  };

  const handleSelectAssignment = (id: number) => {
    setActiveId(id);
    setSelectedStudentId(null);
    setViewMode('submissionList');
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudentId(id);
  };

  const handleSubmitQuizAnswers = async (
    answers: { questionId: number; answer: string | number[] | null }[],
  ) => {
    if (!activeId) return;

    try {
      const cleanedAnswers = answers.map((ans) => ({
        questionId: ans.questionId,
        answer: ans.answer ?? '',
      }));

      await submitQuiz.mutateAsync({
        quizId: activeId,
        answers: cleanedAnswers,
      });

      toast.success('Jawaban berhasil dikumpulkan!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengumpulkan jawaban.');
    }
  };

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
          onSelect={handleSelectItem}
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
          onSelect={handleSelectAssignment}
          items={assignments}
          renderTitle={(t) => t.title}
          typeLabel="Tugas"
        />
      );
    }
    if (activeTab === 'Tugas' && viewMode === 'submissionList') {
      if (!isAllowed) return null;
      return (
        <ContentList
          {...commonProps}
          onSelect={handleSelectStudent}
          items={studentItems}
          activeId={selectedStudentId}
          selectedStudentId={selectedStudentId}
          renderTitle={(s) => (
            <div className="flex w-full items-center">
              <span className="flex-grow">{s.name}</span>
              <div
                className={`text-xs font-semibold px-2 py-1 rounded-full`}
              ></div>
            </div>
          )}
          typeLabel="Murid"
        />
      );
    }
    if (activeTab === 'Ujian') {
      return (
        <ContentList
          {...commonProps}
          onSelect={handleSelectItem}
          items={quizzes}
          renderTitle={(q) => q.title}
          typeLabel="Ujian"
        />
      );
    }
    return null;
  };

  const renderContentPanel = () => {
    if (
      activeTab === 'Tugas' &&
      viewMode === 'submissionList' &&
      selectedStudentId &&
      activeId
    ) {
      if (!studentSubmission) {
        return <p className="p-4">Tidak ada submission dari murid ini.</p>;
      }

      const assignment = assignments.find((a) => a.id === activeId);
      if (!assignment) return <p className="p-4">Tugas tidak ditemukan.</p>;

      return (
        <div className="bg-white p-4 rounded-md shadow-md">
          <AnswerView
            student={studentSubmission.user}
            submission={studentSubmission}
            assignment={assignment}
            onSubmitScore={async (score) => {
              await gradeSubmission.mutateAsync({
                submissionId: studentSubmission.id,
                score,
              });
              toast.success('Nilai berhasil disimpan');
            }}
          />
        </div>
      );
    }

    if (activeTab === 'Informasi') {
      return (
        <div>
          <CourseInfoTab
            courseId={courseId}
            userRole={currentUser?.role ?? 'student'}
          />
        </div>
      );
    }

    if (!activeItem) return <p className="p-4">Pilih item di samping.</p>;

    if (activeTab === 'Materi') {
      const item = activeItem as (typeof modules)[0];
      return (
        <div className="bg-white p-4 rounded-md shadow-md">
          <ContentView
            title={item.title}
            description={item.description || ''}
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

    if (activeTab === 'Tugas') {
      const item = activeItem as (typeof assignments)[0];

      if (isMySubmissionLoading) {
        return <p className="p-4">Loading jawabanmu...</p>;
      }

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
            showAnswerBox={true}
            assignmentId={item.id}
            selectedStudentId={selectedStudentId}
            initialAnswerText={mySubmission?.answerText ?? ''}
            initialFiles={
              mySubmission?.filesJson
                ? [
                    {
                      id: mySubmission.filesJson,
                      name: mySubmission.filesJson
                        .split('_')
                        .slice(1)
                        .join('_'),
                    },
                  ]
                : []
            }
            isSubmitted={!!mySubmission?.submittedAt}
          />
        </div>
      );
    }

    if (activeTab === 'Ujian') {
      const item = activeItem as (typeof quizzes)[0];
      if (!item) {
        return <p className="p-4">Pilih ujian di samping.</p>;
      }

      if (!quizStarted) {
        return (
          <div className="bg-white p-4 rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            {item.description && (
              <p className="text-gray-700 mb-4">{item.description}</p>
            )}
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              <li>
                <strong>Jumlah Soal:</strong> {quizQuestions.length}
              </li>
              <li>
                <strong>Durasi:</strong> {item.durationMinutes ?? 60} menit
              </li>
              <li>
                <strong>Deadline:</strong>{' '}
                {item.deadline
                  ? new Date(item.deadline).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Tidak ada'}
              </li>
            </ul>
            <button
              onClick={() => setQuizStarted(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Mulai Ujian
            </button>
          </div>
        );
      }

      return (
        <div className="bg-white p-4 rounded-md shadow-md">
          {quizQuestions.length > 0 ? (
            <QuizView
              questions={quizQuestions}
              onSubmit={handleSubmitQuizAnswers}
            />
          ) : (
            <p>Belum ada konten.</p>
          )}
        </div>
      );
    }

    return <p className="p-4">Pilih item di samping.</p>;
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setActiveId(null);
    setSidebarOpen(false);
    setViewMode(tab === 'Tugas' && isAllowed ? 'default' : 'default');

    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);

    // Update the URL with the current pathname and the new search params
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] relative">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hamburger for mobile */}
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
          onTabChange={handleTabChange}
        />

        <div className="mt-6">
          {activeTab === 'Informasi' ? (
            <div>{renderContentPanel()}</div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 relative">
              <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 md:w-[280px] md:min-w-[280px] md:max-w-[280px] md:rounded-lg md:shadow-md z-40`}
              >
                {renderSidebarContent(handleSelectItem)}
              </div>
              {sidebarOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30"
                  onClick={() => setSidebarOpen(false)}
                ></div>
              )}
              <div className="w-full md:w-9/12">{renderContentPanel()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
