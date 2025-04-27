'use client';

import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { toast } from 'react-hot-toast';

export default function AnswerAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = Number(params?.assignmentId);

  const { data: assignment, isLoading } = trpc.assignment.getById.useQuery({ id: assignmentId });
  const submitMutation = trpc.assignmentSubmisssion.submit.useMutation();
  
  const [answerText, setAnswerText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    let filePath = undefined;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      filePath = data.path;
    }

    await submitMutation.mutateAsync({
      assignmentId,
      answerText,
      filePath,
    });

    toast.success("Jawaban berhasil disubmit!");
    router.back();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{assignment?.title}</h1>
      <p>{assignment?.description}</p>

      <h2 className="text-lg font-semibold mt-4">Jawaban:</h2>
      <Textarea
        placeholder="Tulis jawaban Anda..."
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
      />

      <h2 className="text-lg font-semibold mt-4">Upload File:</h2>
      <Input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          if (e.target.files?.[0]) setFile(e.target.files[0]);
        }}
      />

      <Button onClick={handleSubmit} className="mt-6 bg-blue-600 text-white">
        Submit Jawaban
      </Button>
    </div>
  );
}
