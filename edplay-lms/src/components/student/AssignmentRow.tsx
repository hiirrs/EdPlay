'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

interface Assignment {
  id: number;
  title: string;
  courseId: number;
  courseName: string;
  startDate: string;
  endDate: string;
  status: 'Submitted' | 'Unanswered' | 'Answered';
  score?: number | null;
}

interface Props {
  no: number;
  assignment: Assignment;
}

export default function AssignmentRow({ no, assignment }: Props) {
  const router = useRouter();

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColor =
    assignment.status === 'Submitted'
      ? 'bg-green-500'
      : assignment.status === 'Answered'
        ? 'bg-yellow-500'
        : 'bg-red-500';

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">{no}</td>
      <td
        className="p-3 text-blue-600 underline cursor-pointer"
        onClick={() => router.push(`/course/${assignment.courseId}`)}
      >
        {assignment.courseName}
      </td>
      <td className="p-3">{assignment.title}</td>
      <td className="p-3">{formatDateTime(assignment.startDate)}</td>
      <td className="p-3">{formatDateTime(assignment.endDate)}</td>
      <td className="p-3">{assignment.score}</td>
      <td className="p-3">
        <Badge className={`${statusColor} text-white`}>
          {assignment.status}
        </Badge>
      </td>
      <td className="p-3 text-center">
        <Button
          size="sm"
          onClick={() => router.push(`/course/${assignment.courseId}?tab=Tugas`)}
        >
          Open
        </Button>
      </td>
    </tr>
  );
}
