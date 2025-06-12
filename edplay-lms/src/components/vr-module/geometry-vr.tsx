// app/solar-system/page.tsx (Next.js 13+ with App Router)
'use client';

import 'aframe';
import 'aframe-look-at-component';
import { Entity, Scene } from 'aframe-react';
import 'aframe-troika-text';
import 'aframe-environment-component';

const planets = [
  { id: 'sun', name: 'Sun', position: [0, 1.6, -5], scale: 1.2, dur: 15000 },
  { id: 'mercury', name: 'Mercury', orbitRadius: 2.5, scale: 0.3, dur: 4000 },
  { id: 'venus', name: 'Venus', orbitRadius: 4, scale: 0.4, dur: 6000 },
  { id: 'earth', name: 'Earth', orbitRadius: 6, scale: 0.5, dur: 10000 },
  {
    id: 'moon',
    name: 'Moon',
    orbitRadius: 1,
    parent: 'earth',
    scale: 0.15,
    dur: 3000,
  },
  { id: 'mars', name: 'Mars', orbitRadius: 8, scale: 0.4, dur: 12000 },
  { id: 'jupiter', name: 'Jupiter', orbitRadius: 11, scale: 0.9, dur: 20000 },
  { id: 'saturn', name: 'Saturn', orbitRadius: 14, scale: 0.8, dur: 25000 },
  {
    id: 'saturn-ring',
    name: 'Saturn Ring',
    orbitRadius: 0,
    parent: 'saturn',
    scale: 0.9,
    dur: 0,
    isRing: true,
  },
  { id: 'uranus', name: 'Uranus', orbitRadius: 17, scale: 0.7, dur: 30000 },
  { id: 'neptune', name: 'Neptune', orbitRadius: 20, scale: 0.7, dur: 35000 },
];

export default function SolarSystemPage() {
  return (
    <Scene environment="preset: starry">
      {/* Camera + Cursor */}
      <Entity position="0 1.6 10">
        <Entity camera look-controls wasd-controls-enabled="true">
          <Entity
            cursor="fuse: false; rayOrigin: mouse"
            position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.02"
            material="color: white; shader: flat"
          />
        </Entity>
      </Entity>

      {/* Lighting */}
      <Entity light="type: ambient; color: #999" />
      <Entity light="type: directional; intensity: 0.5" position="1 1 0" />

      {/* Assets */}
      <a-assets>
        {planets.map(({ id }) => (
          <a-asset-item key={id} id={id} src={`/models/${id}.glb`} />
        ))}
      </a-assets>

      {/* Sun */}
      <Entity>
        <Entity
          gltf-model="#sun"
          position="0 1.6 -5"
          scale="1.2 1.2 1.2"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 15000"
          material="emissive: yellow; emissiveIntensity: 1.5"
        />
        <Entity
          primitive="a-troika-text"
          value="Sun"
          align="center"
          color="white"
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
          position="0 2.8 -5"
          look-at="[camera]"
        />
      </Entity>

      {/* Planets and their moons or rings */}
      {planets
        .filter(
          ({ id }) => id !== 'sun' && !['moon', 'saturn-ring'].includes(id),
        )
        .map(({ id, name, orbitRadius, scale, dur }, idx) => (
          <Entity
            key={idx}
            id={`${id}-pivot`}
            position="0 1.6 -5"
            animation={
              dur
                ? `property: rotation; to: 0 360 0; loop: true; dur: ${dur}`
                : undefined
            }
          >
            {/* Orbit Trail */}
            <Entity
              geometry={`primitive: torus; radius: ${orbitRadius}; radiusTubular: 0.005; segmentsRadial: 36; segmentsTubular: 100`}
              material="color: white; opacity: 0.2; transparent: true"
              rotation="90 0 0"
            />

            {/* Planet */}
            <Entity
              gltf-model={`#${id}`}
              position={`${orbitRadius} 0 0`}
              scale={`${scale} ${scale} ${scale}`}
              animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
            />
            <Entity
              primitive="a-troika-text"
              value={name}
              align="center"
              color="white"
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              position={`${orbitRadius} 1.2 0`}
              look-at="[camera]"
            />

            {/* Child entities like moon or ring */}
            {planets
              .filter((p) => p.parent === id)
              .map(
                (
                  {
                    id: childId,
                    name: childName,
                    orbitRadius: childOrbit,
                    scale: childScale,
                    dur: childDur,
                    isRing,
                  },
                  cidx,
                ) => (
                  <Entity
                    key={cidx}
                    id={`${childId}-pivot`}
                    position={`${orbitRadius} 0 0`}
                    animation={
                      childDur
                        ? `property: rotation; to: 0 360 0; loop: true; dur: ${childDur}`
                        : undefined
                    }
                  >
                    {!isRing && (
                      <Entity
                        geometry={`primitive: torus; radius: ${childOrbit}; radiusTubular: 0.003; segmentsRadial: 36; segmentsTubular: 100`}
                        material="color: white; opacity: 0.2; transparent: true"
                        rotation="90 0 0"
                      />
                    )}
                    <Entity
                      gltf-model={`#${childId}`}
                      position={`${childOrbit} 0 0`}
                      scale={`${childScale} ${childScale} ${childScale}`}
                    />
                    {!isRing && (
                      <Entity
                        primitive="a-troika-text"
                        value={childName}
                        align="center"
                        color="white"
                        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
                        position={`${childOrbit} 1.2 0`}
                        look-at="[camera]"
                      />
                    )}
                  </Entity>
                ),
              )}
          </Entity>
        ))}

      {/* Skybox */}
      <Entity
        geometry="primitive: sphere; radius: 1000"
        material="shader: flat; color: #000"
        scale="-1 1 1"
      />
    </Scene>
  );
}
