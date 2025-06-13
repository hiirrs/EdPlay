'use client'

import { useState } from 'react';
import { trpc } from '~/utils/trpc';
import toast from 'react-hot-toast';

type QuestionType = "multiple_choice" | "short_answer" | "true_false";

interface QuestionInput {
  questionText: string;
  questionType: QuestionType;
  options?: { text: string; isCorrect: boolean }[];
}

export default function AddQuizForm({ courseId, onSuccess }: { courseId: number, onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionInput[]>([
    {
      questionText: '',
      questionType: 'multiple_choice',
      options: [{ text: '', isCorrect: false }],
    },
  ]);

  const createQuiz = trpc.quiz.create.useMutation();

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      questionType: 'multiple_choice',
      options: [{ text: '', isCorrect: false }],
    }]);
  };

  const handleSubmit = async () => {
    try {
      await createQuiz.mutateAsync({
        courseId,
        title,
        description,
        questions,
      });
      toast.success('Quiz berhasil ditambahkan');
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menambahkan quiz');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Tambah Quiz</h2>
      <input
        type="text"
        placeholder="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-2 py-1 mb-2 w-full"
      />
      <textarea
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border px-2 py-1 mb-2 w-full"
      />
      {questions.map((q, qi) => (
        <div key={qi} className="mb-4 border p-2 rounded">
          <input
            type="text"
            placeholder="Pertanyaan"
            value={q.questionText}
            onChange={(e) => {
              const updated = [...questions];
              updated[qi].questionText = e.target.value;
              setQuestions(updated);
            }}
            className="border px-2 py-1 w-full mb-1"
          />
          <select
            value={q.questionType}
            onChange={(e) => {
              const updated = [...questions];
              updated[qi].questionType = e.target.value as QuestionType;
              setQuestions(updated);
            }}
            className="border px-2 py-1 w-full mb-2"
          >
            <option value="multiple_choice">Pilihan Ganda</option>
            <option value="short_answer">Jawaban Singkat</option>
            <option value="true_false">Benar/Salah</option>
          </select>

          {(q.questionType === 'multiple_choice' || q.questionType === 'true_false') && (
            <>
              {q.options?.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    placeholder="Opsi"
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qi].options![oi].text = e.target.value;
                      setQuestions(updated);
                    }}
                    className="border px-2 py-1 flex-grow"
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qi].options![oi].isCorrect = e.target.checked;
                        setQuestions(updated);
                      }}
                    /> Benar
                  </label>
                </div>
              ))}
              <button
                onClick={() => {
                  const updated = [...questions];
                  updated[qi].options?.push({ text: '', isCorrect: false });
                  setQuestions(updated);
                }}
                className="text-sm text-blue-500"
              >
                + Tambah Opsi
              </button>
            </>
          )}
        </div>
      ))}
      <button onClick={handleAddQuestion} className="mt-2 bg-gray-200 px-4 py-1 rounded">+ Pertanyaan</button>
      <br />
      <button onClick={handleSubmit} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Simpan Quiz</button>
    </div>
  );
}
