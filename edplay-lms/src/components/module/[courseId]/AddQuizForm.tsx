'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { trpc } from '~/utils/trpc';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

type QuestionType = 'multiple_choice' | 'short_answer' | 'true_false';

interface QuestionInput {
  questionText: string;
  questionType: QuestionType;
  answerOptions?: { text: string; isCorrect: boolean }[];
  image?: File | null;
  imageUrl?: string | null;
}

export default function AddQuizForm({
  courseId,
  onSuccess,
}: {
  courseId: number;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionInput[]>([
    {
      questionText: '',
      questionType: 'multiple_choice',
      answerOptions: [{ text: '', isCorrect: false }],
      image: null,
    },
  ]);

  const createQuiz = trpc.quiz.create.useMutation();
  const isLoading = createQuiz.isPending;

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'multiple_choice',
        answerOptions: [{ text: '', isCorrect: false }],
        image: null,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answerOptions = updated[qIndex].answerOptions || [];
    updated[qIndex].answerOptions.push({ text: '', isCorrect: false });
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answerOptions = updated[qIndex].answerOptions?.filter((_, i) => i !== optIndex);
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    try {
      const uploadedQuestions = await Promise.all(
        questions.map(async (q) => {
          let imageUrl: string | undefined;

          if (q.image) {
            const formData = new FormData();
            formData.append('file', q.image);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            imageUrl = data.path;
          }

          const base = {
            questionText: q.questionText,
            questionType: q.questionType,
            imageUrl: imageUrl || undefined,
          };

          if (q.questionType !== 'short_answer') {
            return {
              ...base,
              answerOptions: q.answerOptions?.filter((opt) => opt.text.trim() !== ''),
            };
          }

          return base;
        })
      );

      await createQuiz.mutateAsync({
        courseId,
        title,
        description,
        questions: uploadedQuestions,
      });

      toast.success('Quiz berhasil ditambahkan');
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menambahkan quiz');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] px-4 py-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-bold">Tambah Quiz</h1>

        <Input
          placeholder="Judul Quiz"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {questions.map((q, qi) => (
          <div
            key={qi}
            className="border p-4 rounded-md bg-[#FDFDFD] shadow-sm space-y-3"
          >
            <div className="flex justify-end">
              <Trash2
                onClick={() => handleRemoveQuestion(qi)}
                className="text-red-600 cursor-pointer"
              />
            </div>

            <Input
              placeholder="Pertanyaan"
              value={q.questionText}
              onChange={(e) => {
                const updated = [...questions];
                updated[qi].questionText = e.target.value;
                setQuestions(updated);
              }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const updated = [...questions];
                updated[qi].image = e.target.files?.[0] || null;
                setQuestions(updated);
              }}
            />
            {q.image && (
              <img
                src={URL.createObjectURL(q.image)}
                alt="Preview"
                className="max-w-xs mb-2 rounded border"
              />
            )}

            <Select
              value={q.questionType}
              onValueChange={(val) => {
                const type = val as QuestionType;
                const updated = [...questions];
                updated[qi].questionType = type;
                updated[qi].answerOptions =
                  type === 'short_answer' ? undefined : [{ text: '', isCorrect: false }];
                setQuestions(updated);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tipe pertanyaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Pilihan Ganda</SelectItem>
                <SelectItem value="short_answer">Jawaban Singkat</SelectItem>
                <SelectItem value="true_false">Benar / Salah</SelectItem>
              </SelectContent>
            </Select>

            {(q.questionType === 'multiple_choice' || q.questionType === 'true_false') &&
              q.answerOptions?.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <Input
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qi].answerOptions![oi].text = e.target.value;
                      setQuestions(updated);
                    }}
                    placeholder="Teks Opsi"
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qi].answerOptions![oi].isCorrect = e.target.checked;
                        setQuestions(updated);
                      }}
                    />
                    Benar
                  </label>
                  <Trash2
                    onClick={() => handleRemoveOption(qi, oi)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              ))}

            {(q.questionType === 'multiple_choice' || q.questionType === 'true_false') && (
              <Button
                variant="ghost"
                onClick={() => handleAddOption(qi)}
                className="text-blue-600 w-fit text-sm"
              >
                + Tambah Opsi
              </Button>
            )}
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={handleAddQuestion}
            className="w-full sm:w-auto"
          >
            + Tambah Pertanyaan
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 text-white w-full sm:w-auto"
            disabled={isLoading || !title.trim() || questions.length === 0}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Quiz'}
          </Button>
        </div>
      </div>
    </div>
  );
}
