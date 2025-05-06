'use client';

import AssignmentList from '~/components/student/AssignmentList';

export default function AssignmentPage() {
  return (
    <main className="min-h-screen bg-[#FDF8F4] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#2E3E83]">Daftar Tugas</h1>
        <AssignmentList />
      </div>
    </main>
  );
}
