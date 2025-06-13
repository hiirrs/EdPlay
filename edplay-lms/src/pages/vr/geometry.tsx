'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const GeometryVRScene = dynamic(
  () => import('../../components/vr-module/geometry-vr'), // Adjusted path to match project structure
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#222', // Dark background for loading
          color: 'white',
          fontSize: '1.5em',
          fontFamily: 'sans-serif',
        }}
      >
        Loading Geometry VR Experience...
      </div>
    ),
  },
);

export default function GeometryPage() {
  return <GeometryVRScene />;
}
