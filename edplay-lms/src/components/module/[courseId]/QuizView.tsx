'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';

interface QuizQuestion {
  id: number;
  questionText: string;
  questionType:
    | 'multiple_choice'
    | 'checkbox_multiple'
    | 'short_answer'
    | 'true_false';
  imageUrl?: string | null;
  options?: { id: number; text: string }[];
}

interface QuizViewProps {
  questions: QuizQuestion[];
  onSubmit: (
    answers: { questionId: number; answer: string | number[] | null }[],
  ) => void;
}

export default function QuizView({ questions, onSubmit }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAnswerChange = (value: any) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleCheckboxToggle = (optionId: number) => {
    const prev = answers[current.id] || [];
    if (prev.includes(optionId)) {
      handleAnswerChange(prev.filter((id: number) => id !== optionId));
    } else {
      handleAnswerChange([...prev, optionId]);
    }
  };

  const handleSubmit = () => {
    const finalAnswers = questions.map((q) => ({
      questionId: q.id,
      answer:
        answers[q.id] ?? (q.questionType === 'checkbox_multiple' ? [] : ''),
    }));
    onSubmit(finalAnswers);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow-md w-full max-w-2xl mx-auto">
      <p className="text-lg font-semibold text-gray-800">
        Soal {currentIndex + 1} dari {questions.length}
      </p>

      <div className="space-y-3">
        {current.imageUrl && (
          <img
            src={current.imageUrl}
            alt="Gambar Soal"
            className="max-w-sm rounded border mx-auto"
          />
        )}
        <p className="text-md font-medium text-gray-700">
          {current.questionText}
        </p>

        {/* Multiple Choice */}
        {current.questionType === 'multiple_choice' && (
          <>
            {current.options?.length ? (
              current.options.map((opt) => (
                <label key={opt.id} className="block">
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    value={opt.id}
                    checked={answers[current.id] === opt.id}
                    onChange={() => handleAnswerChange(opt.id)}
                    className="mr-2"
                  />
                  {opt.text}
                </label>
              ))
            ) : (
              <p className="text-sm text-red-500">Belum ada pilihan jawaban.</p>
            )}
          </>
        )}

        {/* Checkbox Multiple */}
        {current.questionType === 'checkbox_multiple' && (
          <>
            {current.options?.length ? (
              current.options.map((opt) => (
                <label key={opt.id} className="block">
                  <input
                    type="checkbox"
                    value={opt.id}
                    checked={(answers[current.id] || []).includes(opt.id)}
                    onChange={() => handleCheckboxToggle(opt.id)}
                    className="mr-2"
                  />
                  {opt.text}
                </label>
              ))
            ) : (
              <p className="text-sm text-red-500">Belum ada opsi checkbox.</p>
            )}
          </>
        )}

        {/* Short Answer */}
        {current.questionType === 'short_answer' && (
          <input
            type="text"
            value={answers[current.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Jawabanmu..."
          />
        )}

        {/* True / False */}
        {current.questionType === 'true_false' && (
          <>
            {current.options?.length ? (
              current.options.map((opt) => (
                <label key={opt.id} className="block">
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    value={opt.id}
                    checked={answers[current.id] === opt.id}
                    onChange={() => handleAnswerChange(opt.id)}
                    className="mr-2"
                  />
                  {opt.text}
                </label>
              ))
            ) : (
              <p className="text-sm text-red-500">
                Opsi true/false belum tersedia.
              </p>
            )}
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Sebelumnya
        </Button>
        {isLast ? (
          <Button onClick={handleSubmit}>Kumpulkan</Button>
        ) : (
          <Button onClick={handleNext}>Berikutnya</Button>
        )}
      </div>
    </div>
  );
}
