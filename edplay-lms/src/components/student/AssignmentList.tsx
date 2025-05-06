'use client';

import { useState, useMemo } from 'react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { trpc } from '~/utils/trpc';
import AssignmentRow from './AssignmentRow';
import Pagination from './Pagination';
import { Loader2 } from 'lucide-react';

export interface Assignment {
  id: number;
  courseId: number;
  courseCode?: string;
  courseName: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  status: 'Submitted' | 'Unanswered' | 'Answered';
  score?: number | null;
}

export default function AssignmentList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Submitted' | 'Unanswered' | 'Answered'
  >('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: assignments = [], isLoading } =
    trpc.assignment.getMyAssignments.useQuery();

  const filteredAssignments = useMemo(() => {
    let result = assignments;
    if (search) {
      result = result.filter(
        (a) => 
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.courseName.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (statusFilter !== 'All') {
      result = result.filter((a) => a.status === statusFilter);
    }
    return result;
  }, [assignments, search, statusFilter]);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssignments.slice(start, start + pageSize);
  }, [filteredAssignments, currentPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-600 gap-2">
        <Loader2 className="animate-spin" />
        <span>Loading daftar tugas...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <Input
          placeholder="Cari tugas..."
          className="w-full sm:w-64"
          value={search}
          onChange={(e) => {
            setCurrentPage(1);
            setSearch(e.target.value);
          }}
        />
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setStatusFilter(e.target.value as any);
            }}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="All">Semua Status</option>
            <option value="Submitted">Terkumpul</option>
            <option value="Unanswered">Belum Kumpul</option>
          </select>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Kelas</th>
              <th className="p-3">Nama Tugas</th>
              <th className="p-3">Rilis</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Nilai</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  Tidak ada tugas ditemukan.
                </td>
              </tr>
            ) : (
              pagedData.map((a, i) => (
                <AssignmentRow
                  key={a.id}
                  no={(currentPage - 1) * pageSize + i + 1}
                  assignment={a}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredAssignments.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
