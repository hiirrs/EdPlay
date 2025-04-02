'use client';

import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
    const router = useRouter();
    const currPath = router.pathname;
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="space-x-4">
        <Link href="/daftar" passHref>
          <Button
            variant="ghost"
            className={currPath === '/daftar' ? "text-orange-500" : "text-neutral-300 hover:text-neutral-400"}
          >
            Daftar
          </Button>
        </Link>
        <Link href="/masuk" passHref>
          <Button
            variant="ghost"
            className={currPath === '/masuk' ? "text-orange-500" : "text-neutral-300 hover:text-neutral-400"}
          >
            Masuk
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
