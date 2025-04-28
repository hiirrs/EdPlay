'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import dynamic from 'next/dynamic';
import AnswerAssignment from './AnswerAssignment';

type ContentData = {
  id: number;
  contentTitle: string;
  contentType: 'TEXT' | 'VIDEO' | 'FILE' | 'LINK';
  contentData: string;
  filePath?: string;
};

interface ContentViewProps {
  title: string;
  contents: ContentData[];
  description?: string;
  showAnswerBox?: boolean; 
  assignmentId?: number;
  selectedStudentId?: number | null;
}

function convertYoutubeToEmbedUrl(url: string) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = regex.exec(url);
  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url; // fallback
}

const PdfViewer = dynamic(() => import('~/components/PdfViewer'), {
  ssr: false,
});

export default function ContentView({
  title,
  contents = [],
  description,
  showAnswerBox = false,
  assignmentId,
  selectedStudentId = null,
}: ContentViewProps) {
  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>

      <Accordion type="multiple" className="py-2">
        {contents.length > 0 ? (
          contents.map((content) => (
            <AccordionItem
              key={content.id}
              value={`content-${content.id}`}
              className="border rounded-lg overflow-hidden mb-2"
            >
              <AccordionTrigger className="p-2 font-semibold border-b bg-slate-100">
                {content.contentTitle}
              </AccordionTrigger>
              <AccordionContent className="p-2">
                {content.contentType === 'TEXT' && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: content.contentData }}
                  />
                )}
                {content.contentType === 'VIDEO' && (
                  <div className="aspect-video">
                    <iframe
                      src={convertYoutubeToEmbedUrl(content.contentData)}
                      className="w-full h-full rounded"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {content.contentType === 'FILE' && content.filePath && (
                  <PdfViewer filePath={content.filePath} />
                )}
                {content.contentType === 'LINK' && (
                  <a
                    href={content.contentData}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {content.contentData}
                  </a>
                )}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <p className="text-gray-600">Belum ada konten.</p>
        )}
      </Accordion>
      {showAnswerBox && assignmentId && (
        <div className="pt-6 border-t">
          <AnswerAssignment
            assignmentId={assignmentId}
            studentId={selectedStudentId ?? undefined}
            isSubmitted={false}
          />
        </div>
      )}
    </div>
  );
}
