'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'

type ContentData = {
  id: number
  contentType: 'TEXT' | 'VIDEO' | 'PDF' | 'LINK'
  contentData: string
}

interface ContentViewProps {
  title: string
  contents?: ContentData[] 
  description?: string     
}

export default function ContentView({ title, contents = [], description }: ContentViewProps) {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible defaultValue="section-1">
        <AccordionItem value="section-1" className="border rounded-lg overflow-hidden mb-4">
          <AccordionTrigger className="px-4 py-3 font-semibold text-lg">{title}</AccordionTrigger>
          <AccordionContent className="px-4 py-6 space-y-6">
            {contents.length > 0 ? (
              contents.map((content) => (
                <div key={content.id}>
                  {content.contentType === 'TEXT' && (
                    <p className="whitespace-pre-line">{content.contentData}</p>
                  )}
                  {content.contentType === 'VIDEO' && (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe src={content.contentData} className="w-full h-full rounded" allowFullScreen />
                    </div>
                  )}
                  {content.contentType === 'PDF' && (
                    <iframe src={content.contentData} className="w-full h-[500px] rounded border" />
                  )}
                  {content.contentType === 'LINK' && (
                    <a href={content.contentData} target="_blank" className="text-blue-600 underline">
                      {content.contentData}
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">{description || 'Belum ada konten.'}</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
