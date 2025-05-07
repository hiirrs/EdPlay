'use client';

import { useState } from 'react';
import { BookOpen, Calculator, Microscope, PenTool } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { trpc } from '~/utils/trpc';
import { ClassCard } from '~/components/home/ClassCard';
import { FeatureModal } from '~/components/home/feature-modal';
import { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import toast from 'react-hot-toast';
import Navbar from '~/components/NavbarAlt';


export default function Dashboard() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [openTokenModal, setOpenTokenModal] = useState(false);
  const [token, setToken] = useState('');

  const {
    data: classData = [],
    isLoading,
    refetch: refetchCourses,
  } = trpc.course.getByUserRole.useQuery();

  const { data: userData } = trpc.auth.getSession.useQuery();
  const enrollMutation = trpc.course.enroll.useMutation({
    onSuccess: () => {
      toast.success('Berhasil masuk kelas!');
      setOpenTokenModal(false);
      setToken('');
      refetchCourses();
    },
    onError: () => {
      toast.error('Token tidak valid atau sudah terdaftar.');
    },
  });

  const user = userData;
  const username = user?.fullname;
  const router = useRouter();

  const mappedClassData = classData.map((course) => ({
    id: course.id,
    subject: course.name,
    class: `Kelas ${course.grade ?? '-'}`,
    taskDate: '09/11/23',
    taskTime: '12:00',
    hasNewMaterial: true,
    hasExam: false,
    teacher: course.teacher?.fullname ?? 'Tidak diketahui',
    imageUrl: course.imageUrl ?? '/images/default.png',
    isActive: course.isActive,
    isEditable: user?.role === 'teacher' || user?.role === 'admin',
  }));

  // const leaderboardData = [
  //   { rank: 14, name: 'Fulan 2', score: 2350 },
  //   { rank: 15, name: 'Fulan', score: 2320 },
  //   { rank: 16, name: 'Fulan 3', score: 2280 },
  // ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar />

      {/* Welcome Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16 border-2 border-gray-200">
            <AvatarFallback className="bg-gray-100 text-gray-800 text-xl">
              F
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Hai {username}!</h1>
            <p className="text-gray-600">
              Kerjakan tugas kamu tepat waktu untuk naikin skor! Jangan lupa
              Bacayu dan Hitungin untuk tambah skor kamu
            </p>
          </div>
        </div>

        {/* Features */}
        {/* <Card className="mb-8 overflow-hidden bg-[#172b4d] text-white border-0">
          <CardContent className="p-0">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
              <div className="flex flex-wrap justify-between">
                {[
                  { key: 'ujian', icon: <PenTool className="w-6 h-6 text-white" />, color: 'bg-[#f28b82]' },
                  { key: 'tugas', icon: <BookOpen className="w-6 h-6 text-white" />, color: 'bg-[#fdd663]' },
                  { key: 'bacayu', icon: <Microscope className="w-6 h-6 text-white" />, color: 'bg-[#81c995]' },
                  { key: 'hitungin', icon: <Calculator className="w-6 h-6 text-white" />, color: 'bg-[#a0c4ff]' },
                ].map(({ key, icon, color }) => (
                  <div
                    key={key}
                    className="flex flex-col items-center p-4 hover:bg-[#1e3464] rounded-lg cursor-pointer transition-colors"
                    onClick={() => setOpenModal(key)}
                  >
                    <div className={`${color} p-4 rounded-full mb-2`}>{icon}</div>
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </div>
                ))}

                <div className="flex flex-col justify-center mx-4">
                  {leaderboardData.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center mb-2 bg-[#ffe082] text-black rounded-full px-4 py-1 ${
                        user.name === username ? 'border-2 border-white' : ''
                      }`}
                    >
                      <span className="w-6 text-center font-bold">
                        {user.rank}
                      </span>
                      <span className="mx-2">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Class List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Kelas Kamu</h2>
            {user?.role === 'teacher' || user?.role === 'admin' ? (
              <Button
                onClick={() => router.push(`/course/add`)}
                className="bg-blue-600 text-white"
              >
                + Tambah Kelas
              </Button>
            ) : (
              <Button
                onClick={() => setOpenTokenModal(true)}
                className="bg-blue-600 text-white"
              >
                + Masukkan Token Kelas
              </Button>
            )}
          </div>

          {isLoading ? (
            <p>Memuat kelas...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mappedClassData.map((item) => (
                <div key={item.id}>
                  <ClassCard data={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Token Input Modal */}
      <Dialog open={openTokenModal} onOpenChange={setOpenTokenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Masukkan Token Kelas</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Contoh: ABC123XYZ"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <DialogFooter>
            <Button
              onClick={() => enrollMutation.mutate({ token })}
              disabled={!token.trim()}
            >
              Gabung
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feature Modals */}
      {['ujian', 'tugas', 'bacayu', 'hitungin'].map((mod) => (
        <FeatureModal
          key={mod}
          title={mod.charAt(0).toUpperCase() + mod.slice(1)}
          open={openModal === mod}
          onClose={() => setOpenModal(null)}
          icon={
            {
              ujian: <PenTool className="w-6 h-6 text-white" />,
              tugas: <BookOpen className="w-6 h-6 text-white" />,
              bacayu: <Microscope className="w-6 h-6 text-white" />,
              hitungin: <Calculator className="w-6 h-6 text-white" />,
            }[mod]
          }
          iconBg={
            {
              ujian: 'bg-[#f28b82]',
              tugas: 'bg-[#fdd663]',
              bacayu: 'bg-[#81c995]',
              hitungin: 'bg-[#a0c4ff]',
            }[mod]
          }
        />
      ))}
    </div>
  );
}
