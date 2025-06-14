'use client';

import { useRouter } from 'next/router';
import AddQuizForm from '~/components/module/[courseId]/AddQuizForm'; 

export default function AddQuizPage() {
  const router = useRouter();
  const courseId = Number(router.query.courseId);

  if (isNaN(courseId)) return <div>Invalid Course ID</div>;

  return (
    <AddQuizForm
      courseId={courseId}
      onSuccess={() => router.push(`/course/${courseId}?tab=Ujian`)}
    />
  );
}
