'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { UploadDropzone } from '~/components/UploadDropzone';
import { trpc } from '~/utils/trpc';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const RichTextEditor = dynamic(() => import('~/components/RichTextEditor'), {
  ssr: false,
});

interface AnswerAssignmentProps {
  assignmentId: number;
  initialAnswerText?: string;
  initialFiles?: { id: string; name: string }[];
  isSubmitted: boolean;
  submitTime?: string;
  studentId?: number | null;
}

export default function AnswerAssignment({
  assignmentId,
  initialAnswerText = '',
  initialFiles = [],
  isSubmitted: initialIsSubmitted,
  submitTime,
}: AnswerAssignmentProps) {
  const [answerText, setAnswerText] = useState(initialAnswerText);
  const [files, setFiles] =
    useState<{ id: string; name: string; file?: File }[]>(initialFiles);
  const [isSubmitted, setIsSubmitted] = useState(initialIsSubmitted);
  const [submitting, setSubmitting] = useState(false);

  const submitMutation = trpc.assignmentSubmission.submit.useMutation();
  const cancelMutation = trpc.assignmentSubmission.cancel.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async () => {
    if (!answerText.trim() && files.length === 0) {
      toast.error('Harap isi jawaban atau upload file.');
      return;
    }

    setSubmitting(true);
    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          if (file.file) {
            const formData = new FormData();
            formData.append('file', file.file);
            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            return { id: data.path, name: file.name };
          }
          return { id: file.id, name: file.name };
        }),
      );

      await submitMutation.mutateAsync({
        assignmentId,
        answerText,
        filePath: uploads.map((f) => f.id).join(','),
      });

      setFiles(uploads);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setSubmitting(true);
    try {
      await cancelMutation.mutateAsync({ assignmentId });
      setIsSubmitted(false);
      utils.assignmentSubmission.getMySubmission.invalidate({ assignmentId });
    } catch (err) {
      console.error('Cancel error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadSuccess = (
    uploadedFiles: { id: string; name: string; file: File }[],
  ) => {
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {/* Info Sudah Submit */}
      {isSubmitted && submitTime && (
        <div className="text-sm text-green-700">
          Sudah dikumpulkan pada:{' '}
          {new Date(submitTime).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}

      {/* Jawaban Rich Text */}
      {!isSubmitted ? (
        <RichTextEditor content={answerText} onChange={setAnswerText} />
      ) : (
        <div
          className="prose max-w-none border rounded p-3 bg-gray-50 min-h-[150px]"
          dangerouslySetInnerHTML={{ __html: answerText }}
        />
      )}

      {/* Upload File */}
      {!isSubmitted ? (
        <UploadDropzone multiple onSuccess={handleUploadSuccess} />
      ) : (
        <p className="text-sm text-gray-500">
          Anda sudah mengumpulkan tugas ini. Untuk mengubah, silakan batalkan
          pengumpulan terlebih dahulu.
        </p>
      )}

      {/* List File Terupload */}
      <div className="space-y-2 text-sm mt-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <a
              href={`${file.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm truncate max-w-[80%]"
            >
              {file.name}
            </a>
            {!isSubmitted && (
              <button
                onClick={() => handleRemoveFile(file.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-2 mt-4">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting || (!answerText.trim() && files.length === 0)}
          >
            Submit Jawaban
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={submitting}
          >
            Batalkan Submission
          </Button>
        )}
      </div>
    </div>
  );
}
