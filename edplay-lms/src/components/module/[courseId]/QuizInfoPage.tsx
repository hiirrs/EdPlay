'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { Button } from '~/components/ui/button';

export default function QuizIntroPage() {
  const router = useRouter();
  const rawQuizId = useParams()?.quizId;
  const [loading, setLoading] = useState(false);

  if (!rawQuizId || Array.isArray(rawQuizId)) {
    return <p>Quiz ID tidak valid</p>;
  }

  const quizId = Number(rawQuizId);

  const numericQuizId = Number(quizId);
  const quizMetaQuery = trpc.quiz.getMeta.useQuery({ quizId: numericQuizId });
  const questionsQuery = trpc.quiz.getQuestions.useQuery({
    quizId: numericQuizId,
  });

  const handleStart = () => {
    setLoading(true);
    router.push(`/ujian/${quizId}`);
  };

  if (!quizMetaQuery.data || !questionsQuery.data) return <p>Loading...</p>;

  const quizMeta = quizMetaQuery.data;
  const questionCount = questionsQuery.data.length;

  return (
    <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{quizMeta.title}</h1>
        <p className="text-gray-600">{quizMeta.description}</p>

        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            <strong>Jumlah Soal:</strong> {questionCount}
          </li>
          <li>
            <strong>Durasi:</strong> {quizMeta.durationMinutes ?? 60} menit
          </li>
          <li>
            <strong>Deadline:</strong>{' '}
            {new Date(quizMeta.deadline).toLocaleString()}
          </li>
        </ul>

        <Button
          className="w-full bg-blue-600 text-white"
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? 'Memulai...' : 'Mulai Kuis'}
        </Button>
      </div>
    </div>
  );
}
