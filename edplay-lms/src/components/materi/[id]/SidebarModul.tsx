"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "../../ui/button"
import ModuleList from "./ModuleList"
import React from "react"

interface SidebarProps {
  modules: { id: number; title: string }[]
  activeModule: number | null
  onModuleSelect: (moduleId: number) => void
}

export default function Sidebar({ modules, activeModule, onModuleSelect }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-[#2E3E83] text-white hover:bg-[#253570]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar content */}
      <div
        className={`
        fixed md:relative top-0 left-0 h-full z-40
        w-[280px] md:w-full bg-white md:bg-transparent
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        overflow-auto md:overflow-visible
        p-4 md:p-0
      `}
      >
        <div className="md:hidden flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Materi</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <div className="flex items-center text-orange-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          <span>Pilih Kelas</span>
        </div>

        <h2 className="text-xl font-medium mb-4">Materi Matematika</h2>

        <ModuleList
          modules={modules}
          activeModule={activeModule}
          onModuleSelect={(moduleId) => {
            onModuleSelect(moduleId)
            // Close sidebar on mobile after selection
            if (window.innerWidth < 768) {
              setIsOpen(false)
            }
          }}
        />
      </div>
    </>
  )
}

