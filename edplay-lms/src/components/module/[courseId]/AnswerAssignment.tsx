'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { UploadDropzone } from '~/components/UploadDropzone';
import { trpc } from '~/utils/trpc';

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
  isSubmitted,
  submitTime,
}: AnswerAssignmentProps) {
  const [answerText, setAnswerText] = useState(initialAnswerText);
  const [files, setFiles] = useState(initialFiles);
  const [submitting, setSubmitting] = useState(false);

  const submitMutation = trpc.assignmentSubmisssion.submit.useMutation();
  const cancelMutation = trpc.assignmentSubmisssion.cancel.useMutation();

  const handleSubmit = async () => {
    if (!answerText.trim() && files.length === 0) {
      alert('Harap isi jawaban atau upload file.');
      return;
    }

    setSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        assignmentId,
        answerText,
        filePath: files.map((file) => file.id).join(','),
      });
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
      setAnswerText('');
      setFiles([]);
    } catch (err) {
      console.error('Cancel error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadSuccess = (uploadedFiles: { id: string; name: string }[]) => {
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {/* Info Sudah Submit */}
      {isSubmitted && submitTime && (
        <div className="text-sm text-green-700">
          Sudah dikumpulkan pada: {new Date(submitTime).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}

      {/* Jawaban Teks */}
      <Textarea
        placeholder="Tulis jawabanmu di sini..."
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        disabled={isSubmitted}
        className="w-full min-h-[150px]"
      />

      {/* Upload File */}
      <UploadDropzone
        multiple
        disabled={isSubmitted}
        onSuccess={handleUploadSuccess}
      />

      {/* List File Terupload */}
      <div className="space-y-1 text-sm">
        {files.map((file) => (
          <div key={file.id} className="text-gray-700">
            📄 {file.name}
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
