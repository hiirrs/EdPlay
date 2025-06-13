'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

type QuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'true_false'
  | 'checkbox_multiple';

interface QuestionInput {
  id?: number;
  questionText: string;
  questionType: QuestionType;
  answerOptions?: { text: string; isCorrect: boolean }[];
  image?: File | null;
  imageUrl?: string;
}

export default function EditQuizForm() {
  const { quizId } = useParams();
  const router = useRouter();
  const quizQuery = trpc.quiz.getQuestions.useQuery({ quizId: Number(quizId) });
  const quizMeta = trpc.quiz.getMeta.useQuery({ quizId: Number(quizId) });
  const updateQuiz = trpc.quiz.update.useMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionInput[]>([]);

  useEffect(() => {
    if (quizQuery.data && quizMeta.data) {
      setTitle(quizMeta.data.title);
      setDescription(quizMeta.data.description ?? '');
      setQuestions(
        quizQuery.data.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          questionType: q.questionType as QuestionType, // tambahkan cast
          answerOptions: q.options?.map((opt) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect ?? false,
          })),
          imageUrl: q.imageUrl ?? undefined,
          image: null,
        })),
      );
    }
  }, [quizQuery.data, quizMeta.data]);

  const handleSubmit = async () => {
    try {
      const uploaded = await Promise.all(
        questions.map(async (q) => {
          let imageUrl = q.imageUrl;
          if (q.image) {
            const formData = new FormData();
            formData.append('file', q.image);
            const res = await fetch('/api/upload-course-bg', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            imageUrl = data.path;
          }

          return {
            id: q.id,
            questionText: q.questionText,
            questionType: q.questionType,
            imageUrl,
            answerOptions:
              q.questionType === 'short_answer'
                ? undefined
                : q.answerOptions?.map((opt) => ({
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                  })),
          };
        }),
      );

      await updateQuiz.mutateAsync({
        quizId: Number(quizId),
        title,
        description,
        questions: uploaded,
      });

      toast.success('Quiz berhasil diperbarui');
      router.back();
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui quiz');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] px-4 py-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-bold">Edit Quiz</h1>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul Quiz"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi"
        />

        {questions.map((q, qi) => (
          <div
            key={qi}
            className="border p-4 rounded-md bg-[#FDFDFD] shadow-sm space-y-3"
          >
            <div className="flex justify-end">
              <Trash2
                onClick={() =>
                  setQuestions(questions.filter((_, i) => i !== qi))
                }
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
                const file = e.target.files?.[0];
                const updated = [...questions];
                updated[qi].image = file || null;
                setQuestions(updated);
              }}
            />
            {q.imageUrl && !q.image && (
              <img
                src={q.imageUrl}
                alt="Preview"
                className="max-w-xs mb-2 rounded border"
              />
            )}
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
                  type === 'short_answer'
                    ? undefined
                    : [{ text: '', isCorrect: false }];
                setQuestions(updated);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipe Pertanyaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Pilihan Ganda</SelectItem>
                <SelectItem value="short_answer">Jawaban Singkat</SelectItem>
                <SelectItem value="true_false">Benar / Salah</SelectItem>
                <SelectItem value="checkbox_multiple">Checkbox</SelectItem>
              </SelectContent>
            </Select>

            {(q.questionType === 'multiple_choice' ||
              q.questionType === 'true_false' ||
              q.questionType === 'checkbox_multiple') &&
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
                        updated[qi].answerOptions![oi].isCorrect =
                          e.target.checked;
                        setQuestions(updated);
                      }}
                    />
                    Benar
                  </label>
                  <Trash2
                    onClick={() => {
                      const updated = [...questions];
                      updated[qi].answerOptions = updated[
                        qi
                      ].answerOptions?.filter((_, i) => i !== oi);
                      setQuestions(updated);
                    }}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              ))}
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() =>
              setQuestions([
                ...questions,
                {
                  questionText: '',
                  questionType: 'multiple_choice',
                  answerOptions: [{ text: '', isCorrect: false }],
                  image: null,
                },
              ])
            }
          >
            + Tambah Pertanyaan
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 text-white"
            disabled={!title.trim() || questions.length === 0}
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
