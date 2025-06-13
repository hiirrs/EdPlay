// app/modules/page.tsx
'use client';

import Link from 'next/link';
import React from 'react';

const modules = [
  {
    title: 'Solar System VR',
    description: 'Explore planets and the sun in 3D space.',
    href: '/vr/solar-system',
    thumbnail: '/thumbnails/solar-system.jpg',
  },
  {
    title: 'Geometry VR',
    description: 'Journey through the human anatomy.',
    href: '/vr/geometry',
    thumbnail: '/thumbnails/human-body.jpg',
  },
  {
    title: 'Physics Playground VR',
    description: 'Interact with gravity, levers, and more.',
    href: '/physics-playground',
    thumbnail: '/thumbnails/physics.jpg',
  },
];

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white">
      <h1 className="text-4xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
        Explore VR Modules
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((module, index) => (
          <Link href={module.href} key={index} className="group">
            <div className="rounded-2xl shadow-xl hover:shadow-blue-500/50 transition-all duration-300 p-6 cursor-pointer bg-slate-800 border border-slate-700 hover:border-blue-500 flex flex-col h-full">
              <img
                src={module.thumbnail}
                alt={module.title}
                className="w-full h-52 object-cover rounded-xl mb-5 transform group-hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-2xl font-semibold text-sky-300 group-hover:text-sky-200 transition-colors duration-300">
                {module.title}
              </h2>
              <p className="text-slate-400 text-sm mt-3 flex-grow group-hover:text-slate-300 transition-colors duration-300">
                {module.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
