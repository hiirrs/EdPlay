'use client'

import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion'

interface ModuleContentProps {
  title: string
  contents: {
    id: number
    contentType: 'TEXT' | 'VIDEO' | 'PDF' | 'LINK'
    contentData: string
  }[]
}

export default function ModuleContent({ title, contents }: ModuleContentProps) {
  const [openSection, setOpenSection] = useState<string | null>('section-1')

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        value={openSection || undefined}
        onValueChange={setOpenSection}
      >
        <AccordionItem value="section-1" className="border rounded-lg overflow-hidden mb-4">
          <AccordionTrigger className="px-4 py-3 hover:no-underline font-semibold text-lg">
            {title}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-6 min-h-[300px] space-y-6">
            {contents.length === 0 ? (
              <p className="text-gray-500">Belum ada konten untuk modul ini.</p>
            ) : (
              contents.map((content) => (
                <div key={content.id}>
                  {content.contentType === 'TEXT' && (
                    <p className="text-gray-800 whitespace-pre-line">{content.contentData}</p>
                  )}

                  {content.contentType === 'VIDEO' && (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={content.contentData}
                        title="Video"
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                  {content.contentType === 'PDF' && (
                    <iframe
                      src={content.contentData}
                      className="w-full h-[500px] border rounded"
                      title="PDF Preview"
                    ></iframe>
                  )}

                  {content.contentType === 'LINK' && (
                    <a
                      href={content.contentData}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Buka Link: {content.contentData}
                    </a>
                  )}
                </div>
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
