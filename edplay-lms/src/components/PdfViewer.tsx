'use client'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

interface PdfViewerProps {
  fileUrl: string
}

export default function PdfViewer({ fileUrl }: PdfViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  console.log('📄 fileUrl yang dikirim ke PdfViewer:', fileUrl);

  return (
    <div className="w-full border rounded shadow">
      <Worker workerUrl="/pdf.worker.min.js">
        <div style={{ height: '600px' }}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
          />
        </div>
      </Worker>
    </div>
  )
}
