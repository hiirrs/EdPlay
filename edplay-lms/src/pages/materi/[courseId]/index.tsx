import { useParams } from "next/navigation"
import LearningPlatform from "~/components/materi/[courseId]/LearningPlatform"


export default function CourseMateriPage() {
  const params = useParams()
  const courseId = Number(params?.courseId)

  return <LearningPlatform courseId={courseId} />
}