'use client';

import PdfViewer from '~/components/PdfViewer';

interface AnswerViewProps {
  student: {
    fullname: string;
    grade: number;
  };
  assignment: {
    dueDate: Date | null;
  };
  submission: {
    answerText: string | null;
    filesJson: string | null;
    submittedAt: Date | null;
  };
}

export default function AnswerView({ student, submission, assignment }: AnswerViewProps) {
  const files = submission.filesJson
    ? submission.filesJson.split(',').map((id) => ({
        id,
        name: id.split('_').slice(1).join('_'),
      }))
    : [];

  const isLate =
    !!submission.submittedAt && (!assignment.dueDate || new Date(submission.submittedAt) > new Date(assignment.dueDate));

  return (
    <div className="space-y-4">
      {/* Info Murid */}
      <div className="bg-gray-100 p-4 rounded border">
        <p>
          <span className="font-semibold">Nama:</span> {student.fullname}
        </p>
        <p>
          <span className="font-semibold">Kelas:</span> {student.grade}
        </p>
        {submission.submittedAt && (
          <p className={`font-semibold ${isLate ? 'text-red-600' : 'text-green-700'}`}>
            {isLate ? 'Terlambat' : 'Tepat Waktu'}: {new Date(submission.submittedAt).toLocaleString('id-ID')}
          </p>
        )}
        {!submission.submittedAt && <p className="text-gray-500 italic">Belum mengumpulkan</p>}
      </div>

      {/* Jawaban Rich Text */}
      {submission.answerText ? (
        <div
          className="prose max-w-none border rounded p-4 bg-slate-50"
          dangerouslySetInnerHTML={{ __html: submission.answerText }}
        />
      ) : (
        <p className="text-gray-500 italic">Tidak ada jawaban teks.</p>
      )}

      {/* File yang Diupload */}
      {files.length > 0 ? (
        <div className="space-y-2">
          <h4 className="font-semibold">File Terlampir:</h4>
          {files.map((file) => (
            <div key={file.id}>
              <a
                href={`${file.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {file.name}
              </a>
              {file.name.toLowerCase().endsWith('.pdf') && (
                <div className="mt-2">
                  <PdfViewer filePath={`${file.id}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Tidak ada file terlampir.</p>
      )}
    </div>
  );
}
