"use client"

import { useState } from "react"
import Navbar from "../materi/NavbarAlt"
import TabNavigation from "../materi/TabNav"
import Sidebar from "../materi/SidebarModul"
import ModuleContent from "../materi/ModuleContent"

export default function LearningPlatform() {
  const [activeTab, setActiveTab] = useState<string>("Materi")
  const [activeModule, setActiveModule] = useState<number | null>(null)

  const modules = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    title: "Penjumlahan",
  }))

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl rounded-lg">
        <TabNavigation
          tabs={["Informasi", "Materi", "Tugas", "Ujian"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6 flex flex-col md:flex-row gap-6 bg-w">
          <div className="hidden md:block md:w-3/12">
            <Sidebar modules={modules} activeModule={activeModule} onModuleSelect={setActiveModule} />
          </div>

          <div className="md:hidden">
            <Sidebar modules={modules} activeModule={activeModule} onModuleSelect={setActiveModule} />
          </div>

          <div className="w-full md:w-9/12">
            <ModuleContent title="Penjumlahan" />
          </div>
        </div>
      </div>
    </div>
  )
}

