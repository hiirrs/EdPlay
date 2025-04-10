'use client'

import { useState } from 'react'
import Navbar from './NavbarAlt'
import TabNavigation from './TabNav'
import ContentView from './ContentView'
import ContentList from './ContentList'
import { trpc } from '~/utils/trpc'

interface LearningPlatformProps {
  courseId: number
}

export default function LearningPlatform({ courseId }: LearningPlatformProps) {
  const [activeTab, setActiveTab] = useState<string>('Materi')
  const [activeId, setActiveId] = useState<number | null>(null)

  const { data: modules = [] } = trpc.module.getByCourseId.useQuery({ courseId })
  const { data: assignments = [] } = trpc.assignment.getByCourseId.useQuery({ courseId })
  const { data: quizzes = [] } = trpc.quiz.getByCourseId.useQuery({ courseId })

  const activeItem = (() => {
    if (activeTab === 'Materi') return modules.find((m) => m.id === activeId)
    if (activeTab === 'Tugas') return assignments.find((a) => a.id === activeId)
    if (activeTab === 'Ujian') return quizzes.find((q) => q.id === activeId)
    return null
  })()

  // Title & content untuk panel kanan
  const renderContentPanel = () => {
    if (!activeItem) return <p>Pilih item di samping.</p>

    if (activeTab === 'Materi') {
      const item = activeItem as (typeof modules)[0]
      return (
        <ContentView
          title={item.title}
          contents={item.contents.map((c) => ({
            id: c.id,
            contentType: c.contentType.toUpperCase() as 'TEXT' | 'VIDEO' | 'PDF' | 'LINK',
            contentData: c.contentData,
          }))}
        />
      )
    }

    if (activeTab === 'Tugas' || activeTab === 'Ujian') {
      const item = activeItem as (typeof assignments)[0]
      return <ContentView title={item.title} description={item.description || ''} />
    }

    return <p>Silakan pilih tab.</p>
  }

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl rounded-lg">
        <TabNavigation
          tabs={['Informasi', 'Materi', 'Tugas', 'Ujian']}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setActiveId(null)
          }}
        />

        {['Materi', 'Tugas', 'Ujian'].includes(activeTab) && (
          <div className="mt-6 flex flex-col md:flex-row gap-6 bg-w">
            {/* Sidebar */}
            <div className="md:w-3/12">
              {activeTab === 'Materi' && (
                <ContentList
                  items={modules}
                  activeId={activeId}
                  onSelect={setActiveId}
                  renderTitle={(m) => m.title}
                  typeLabel="Modul"
                />
              )}

              {activeTab === 'Tugas' && (
                <ContentList
                  items={assignments}
                  activeId={activeId}
                  onSelect={setActiveId}
                  renderTitle={(t) => t.title}
                  typeLabel="Tugas"
                />
              )}

              {activeTab === 'Ujian' && (
                <ContentList
                  items={quizzes}
                  activeId={activeId}
                  onSelect={setActiveId}
                  renderTitle={(u) => u.title}
                  typeLabel="Ujian"
                />
              )}
            </div>

            {/* Main content */}
            <div className="w-full md:w-9/12">
              {renderContentPanel()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
