'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { trpc } from '~/utils/trpc';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === '/daftar' || pathname === '/masuk';
  const isActive = (path: string) => pathname === path;

  const logout = trpc.user.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success('Berhasil logout');
      router.replace('/masuk');
    } catch {
      toast.error('Gagal logout');
    }
  };

  return (
    <nav className="bg-[#2E3E83] text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {!isAuthPage && (
          <div className="flex-1 md:flex-none">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-[#253570]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </Button>
          </div>
        )}

        {!isAuthPage ? (
          <>
            {/* Desktop navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link 
                href="/tugas" 
                className={`font-medium hover:text-gray-200 ${
                  pathname === '/tugas' ? 'text-[#FAB83D]' : ''
                }`}
              >
                Tugas
              </Link>
              <Link 
                href="/course" 
                className={`font-medium hover:text-gray-200 ${
                  pathname === '/course' ? 'text-[#FAB83D]' : ''
                }`}
              >
                Kelas
              </Link>
              <Link href="#" className="font-medium hover:text-gray-200">
                Ujian
              </Link>
              <Link href="/vr" className="font-medium hover:text-yellow-300">
                VR
              </Link>
            </div>

            {/* Mobile navigation */}
            {isMenuOpen && (
              <div className="fixed inset-0 z-50 bg-[#2E3E83] flex flex-col p-6 md:hidden">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#253570]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X size={24} />
                  </Button>
                </div>
                <div className="flex flex-col items-center justify-center space-y-8 flex-1">
                  <Link
                    href="/tugas"
                    className={`font-medium text-xl hover:text-gray-200 ${
                      pathname === '/tugas' ? 'text-[#FAB83D]' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tugas
                  </Link>
                  <Link
                    href="/course"
                    className={`font-medium text-xl hover:text-gray-200 ${
                      pathname === '/course' ? 'text-[#FAB83D]' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kelas
                  </Link>
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-white bg-red-600 hover:bg-red-700 text-lg"
                  >
                    Ujian
                  </Link>
                  <Link
                    href="/vr"
                    className="font-medium text-xl hover:text-yellow-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    VR
                  </Link>
                    <LogOut className="mr-2" size={18} /> Logout
                  </Button>
                </div>
              </div>
            )}

            <div className="flex-1 flex justify-end items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="max-w-fit text-white hover:bg-red-600 hidden md:flex"
                onClick={handleLogout}
              > Keluar
                <LogOut size={20} />
              </Button>
            </div>
          </>
        ) : (
          <div className="ml-auto flex gap-4">
            <Link
              href="/daftar"
              className={`font-medium ${
                isActive('/daftar') ? 'text-[#FAB83D]' : 'hover:text-gray-200'
              }`}
            >
              Daftar
            </Link>
            <Link
              href="/masuk"
              className={`font-medium ${
                isActive('/masuk') ? 'text-[#FAB83D]' : 'hover:text-gray-200'
              }`}
            >
              Masuk
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}