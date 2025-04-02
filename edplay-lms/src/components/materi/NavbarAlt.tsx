'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#2E3E83] text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
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

        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            href="#"
            className="font-medium hover:text-gray-200 transition-colors"
          >
            Tugas
          </Link>
          <Link
            href="#"
            className="font-medium hover:text-gray-200 transition-colors"
          >
            Kelas
          </Link>
          <Link
            href="#"
            className="font-medium hover:text-gray-200 transition-colors"
          >
            Ujian
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
                href="#"
                className="font-medium text-xl hover:text-gray-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tugas
              </Link>
              <Link
                href="#"
                className="font-medium text-xl hover:text-gray-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kelas
              </Link>
              <Link
                href="#"
                className="font-medium text-xl hover:text-gray-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ujian
              </Link>
            </div>
          </div>
        )}

        <div className="flex-1 flex justify-end">
          <Avatar className="bg-white">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
