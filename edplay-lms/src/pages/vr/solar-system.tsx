'use client'; // This page itself is a client component wrapper

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the SolarSystemVR component with SSR turned off
const SolarSystemVRScene = dynamic(
  () => import('../../components/vr-module/solar-system-vr'), // Adjust path if your components folder is elsewhere
  {
    ssr: false, // This is crucial
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111',
          color: 'white',
          fontSize: '1.5em',
        }}
      >
        Loading VR Experience...
      </div>
    ),
  },
);

export default function SolarSystemPage() {
  // The useState/useEffect for isClient is no longer needed here
  // as `dynamic` with `ssr: false` handles the client-only rendering.
  return <SolarSystemVRScene />;
}
