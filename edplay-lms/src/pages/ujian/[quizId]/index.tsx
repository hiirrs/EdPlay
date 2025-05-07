'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '~/utils/trpc'
import QuizView from '~/components/module/[courseId]/QuizView'
import { formatDistanceToNowStrict, addMinutes } from 'date-fns'

export default function QuizUjianPage() {
  const { quizId } = useParams()
  const router = useRouter()
  const { data: questions, isLoading } = trpc.quiz.getQuestions.useQuery({ quizId: Number(quizId) })
  const { data: meta } = trpc.quiz.getMeta.useQuery({ quizId: Number(quizId) })

  const [endTime, setEndTime] = useState<Date | null>(null)
  const [remaining, setRemaining] = useState<string>('')

  useEffect(() => {
    if (meta?.durationMinutes) {
      const deadline = addMinutes(new Date(), meta.durationMinutes)
      setEndTime(deadline)
    }
  }, [meta])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!endTime) return
      const diff = formatDistanceToNowStrict(endTime, { unit: 'second' })
      setRemaining(diff)

      if (new Date() >= endTime) {
        clearInterval(interval)
        router.push(`/course/${meta?.courseId}/quiz/${quizId}/selesai`) // misalnya redirect setelah waktu habis
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime, meta?.courseId, quizId, router])

  const handleSubmit = (answers: { questionId: number; answer: string | number[] | null }[]) => {
    // call tRPC untuk simpan jawaban
    console.log('Jawaban:', answers)
    toast.success('Jawaban berhasil dikirim')
    router.push(`/course/${meta?.courseId}/quiz/${quizId}/selesai`)
  }

  if (isLoading || !questions) return <p>Loading soal...</p>

  return (
    <div className="min-h-screen bg-[#FDF8F4] py-4 px-2">
      <div className="text-center text-sm mb-2 text-gray-600">
        ⏰ Waktu tersisa: <strong>{remaining}</strong>
      </div>
      <QuizView questions={questions} onSubmit={handleSubmit} />
    </div>
  )
}
