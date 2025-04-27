'use client';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

interface PdfViewerProps {
  filePath: string;
}

export default function PdfViewer({ filePath }: PdfViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  console.log('📄 filePath yang dikirim ke PdfViewer:', filePath);

  return (
    <div className="w-full border rounded shadow">
      <Worker workerUrl="/pdf.worker.min.js">
        <div style={{ height: '600px' }}>
          <Viewer fileUrl={filePath} plugins={[defaultLayoutPluginInstance]} />
        </div>
      </Worker>
    </div>
  );
}
