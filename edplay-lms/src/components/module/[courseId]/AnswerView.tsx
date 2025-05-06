'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
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
    score?: number | null;
    id: number;
  };
  onSubmitScore?: (score: number) => Promise<void>;
}

export default function AnswerView({
  student,
  submission,
  assignment,
  onSubmitScore,
}: AnswerViewProps) {
  const files = submission.filesJson
    ? submission.filesJson.split(',').map((id) => ({
        id,
        name: id.split('_').slice(1).join('_'),
      }))
    : [];

  const isLate =
    !!submission.submittedAt &&
    (!assignment.dueDate || new Date(submission.submittedAt) > new Date(assignment.dueDate));

  const [scoreInput, setScoreInput] = useState(submission.score ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreSubmit = async () => {
    if (!onSubmitScore || scoreInput === '') return;
    const scoreNumber = Number(scoreInput);
    if (isNaN(scoreNumber) || scoreNumber < 0 || scoreNumber > 100) {
      toast.error('Nilai harus berupa angka antara 0 dan 100');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitScore(scoreNumber);
    } catch {
      toast.error('Gagal menyimpan nilai');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {submission.submittedAt ? (
          <p className={`font-semibold ${isLate ? 'text-red-600' : 'text-green-700'}`}>
            {isLate ? 'Terlambat' : 'Tepat Waktu'}: {new Date(submission.submittedAt).toLocaleString('id-ID')}
          </p>
        ) : (
          <p className="text-gray-500 italic">Belum mengumpulkan</p>
        )}
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

      {/* File Terlampir */}
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

      {/* Input Nilai oleh Guru */}
      {onSubmitScore && (
        <div className="pt-4 border-t mt-4">
          <label className="block font-semibold mb-1">Nilai (0–100):</label>
          <input
            type="number"
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            className="border px-3 py-2 rounded w-32"
            min={0}
            max={100}
          />
          <button
            onClick={handleScoreSubmit}
            disabled={isSubmitting}
            className="ml-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Nilai'}
          </button>
        </div>
      )}
    </div>
  );
}
