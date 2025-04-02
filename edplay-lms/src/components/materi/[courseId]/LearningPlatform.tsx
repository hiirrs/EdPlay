'use client';

import { useState } from 'react';
import Navbar from './NavbarAlt';
import TabNavigation from './TabNav';
import Sidebar from './SidebarModul';
import ModuleContent from './ModuleContent';
import { trpc } from '~/utils/trpc';

interface LearningPlatformProps {
  courseId: number
}

export default function LearningPlatform({ courseId }: LearningPlatformProps) {
  const [activeTab, setActiveTab] = useState<string>('Materi')
  const [activeModule, setActiveModule] = useState<number | null>(null)

  const { data: modules = [] } = trpc.module.getByCourseId.useQuery({ courseId })
  const { data: assignments = [] } = trpc.assignment.getByCourseId.useQuery({ courseId })
  const { data: quizzes = [] } = trpc.quiz.getByCourseId.useQuery({ courseId })

  const selectedModule = modules.find((m) => m.id === activeModule)

  const tabContent = () => {
    switch (activeTab) {
      case 'Materi':
        return (
          <ModuleContent
            title={selectedModule?.title ?? 'Pilih Modul'}
            contents={
              selectedModule?.contents.map((c) => ({
                id: c.id,
                contentType: c.contentType.toUpperCase() as 'TEXT' | 'VIDEO' | 'PDF' | 'LINK',
                contentData: c.contentData,
              })) ?? []
            }
          />
        )

      case 'Tugas':
        return (
          <div className="space-y-4">
            {assignments.length > 0 ? (
              assignments.map((a) => (
                <div key={a.id} className="p-4 bg-yellow-100 rounded-lg shadow">
                  <h3 className="font-bold">{a.title}</h3>
                  <p className="text-sm text-gray-600">{a.description}</p>
                  <p className="text-xs text-gray-500">Deadline: {new Date(a.createdAt).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>Tidak ada tugas.</p>
            )}
          </div>
        )

      case 'Ujian':
        return (
          <div className="space-y-4">
            {quizzes.length > 0 ? (
              quizzes.map((q) => (
                <div key={q.id} className="p-4 bg-red-100 rounded-lg shadow">
                  <h3 className="font-bold">{q.title}</h3>
                  <p className="text-sm text-gray-600">{q.description}</p>
                  <p className="text-xs text-gray-500">Tanggal: {new Date(q.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>Tidak ada ujian.</p>
            )}
          </div>
        )

      default:
        return <p>Silakan pilih tab.</p>
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl rounded-lg">
        <TabNavigation
          tabs={['Informasi', 'Materi', 'Tugas', 'Ujian']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6 flex flex-col md:flex-row gap-6 bg-w">
          <div className="hidden md:block md:w-3/12">
            <Sidebar
              modules={modules}
              activeModule={activeModule}
              onModuleSelect={setActiveModule}
            />
          </div>

          <div className="md:hidden">
            <Sidebar
              modules={modules}
              activeModule={activeModule}
              onModuleSelect={setActiveModule}
            />
          </div>

          <div className="w-full md:w-9/12">{tabContent()}</div>
        </div>
      </div>
    </div>
  )
}