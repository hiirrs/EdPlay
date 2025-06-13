'use client';

import React from 'react';
import 'aframe';
import 'aframe-look-at-component';
import { Entity, Scene } from 'aframe-react';
import 'aframe-troika-text';
import 'aframe-environment-component';

const solarSystemData = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    absolutePos: [0, 3, -5], // Raised from 1.6 to 3
    scale: 1,
    selfRotDur: 25000,
    emissive: true,
    textYOffset: 1.8,
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    orbits: 'sun',
    orbitRadius: 6,
    orbitAnimDur: 8000,
    scale: 0.3,
    selfRotDur: 10000,
    textYOffset: 0.5,
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    orbits: 'sun',
    orbitRadius: 7,
    orbitAnimDur: 15000,
    scale: 0.4,
    selfRotDur: 12000,
    textYOffset: 0.6,
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    orbits: 'sun',
    orbitRadius: 10,
    orbitAnimDur: 20000,
    scale: 0.5,
    selfRotDur: 10000,
    textYOffset: 0.7,
  },
  {
    id: 'moon',
    name: 'Moon',
    type: 'moon',
    orbits: 'earth',
    orbitRadius: 1.2,
    orbitAnimDur: 5000,
    scale: 0.15,
    selfRotDur: 7000,
    textYOffset: 0.3,
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    orbits: 'sun',
    orbitRadius: 14,
    orbitAnimDur: 25000,
    scale: 0.4,
    selfRotDur: 11000,
    textYOffset: 0.6,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    orbits: 'sun',
    orbitRadius: 20,
    orbitAnimDur: 35000,
    scale: 0.9,
    selfRotDur: 9000,
    textYOffset: 1.2,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    orbits: 'sun',
    orbitRadius: 26,
    orbitAnimDur: 45000,
    scale: 0.8,
    selfRotDur: 10000,
    textYOffset: 1.0,
  },
  {
    id: 'saturn-ring',
    name: '',
    type: 'ring',
    orbits: 'saturn',
    scale: 1.0,
    modelRotation: [90, 0, 0],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    orbits: 'sun',
    orbitRadius: 32,
    orbitAnimDur: 55000,
    scale: 0.7,
    selfRotDur: 12000,
    textYOffset: 0.9,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    orbits: 'sun',
    orbitRadius: 38,
    orbitAnimDur: 65000,
    scale: 0.7,
    selfRotDur: 13000,
    textYOffset: 0.9,
  },
];

export default function SolarSystemVR() {
  const sunData = solarSystemData.find((b) => b.id === 'sun');
  const planetsOrbitingSun = solarSystemData.filter(
    (b) => b.type === 'planet' && b.orbits === 'sun',
  );
  const moonsData = solarSystemData.filter((b) => b.type === 'moon');
  const ringsData = solarSystemData.filter((b) => b.type === 'ring');

  return (
    <Scene environment="preset: starry; ground: none; lightPosition: 0 -1000 0">
      {/* Camera + Cursor */}
      <Entity position="0 0 20">
        <Entity
          primitive="a-camera"
          raycaster="objects: .interact"
          look-controls
          wasd-controls-enabled="true"
        >
          <Entity
            primitive="a-cursor"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
            material="color: #EF2D5E; shader: flat"
            position="0 0 -1"
          />
        </Entity>
      </Entity>

      {/* Lighting */}
      <Entity light="type: ambient; color: #FFF; intensity: 2" />
      <Entity light="type: hemisphere; color: #ccc; groundColor: #222; intensity: 1.2" />

      {/* Assets */}
      <Entity primitive="a-assets">
        <img
          id="skyGradient"
          src="https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg"
          crossOrigin="anonymous"
        />
        {solarSystemData.map(({ id }) => (
          <Entity
            primitive="a-asset-item"
            key={id}
            id={id}
            src={`/models/${id}.glb`}
          />
        ))}
      </Entity>

      {/* Sky background */}
      <Entity primitive="a-sky" src="#skyGradient" rotation="0 -130 0" />

      {/* Reflective black floor */}
      <Entity
        geometry="primitive: plane; width: 500; height: 500"
        rotation="-90 0 0"
        position="0 -10 0"
        material="color: black; metalness: 1; roughness: 0; opacity: 0.98; side: double"
      />

      {/* Inverted sky for reflection effect */}
      <Entity
        primitive="a-sky"
        src="#skyGradient"
        rotation="0 -130 0"
        position="0 -0.01 0"
        scale="1 -1 1"
      />
      <Entity position="0 -5 0">
        {/* Sun */}
        {sunData && (
          <Entity position={sunData?.absolutePos?.join(' ') ?? '0 0 0'}>
            <Entity
              gltf-model={`#${sunData.id}`}
              scale={`${sunData.scale} ${sunData.scale} ${sunData.scale}`}
              animation={`property: rotation; to: 0 360 0; loop: true; dur: ${sunData.selfRotDur}; easing: linear`}
              material="emissive: yellow; emissiveIntensity: 2.5"
            />
            <Entity
              primitive="a-troika-text"
              value={sunData.name}
              align="center"
              color="white"
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              position={`0 ${sunData.textYOffset} 0`}
              look-at="[camera]"
            />
          </Entity>
        )}

        {/* Planets + Moons + Rings */}
        {planetsOrbitingSun.map((planet) => {
          const moon = moonsData.find((m) => m.orbits === planet.id);
          const ring = ringsData.find((r) => r.orbits === planet.id);
          return (
            <>
              {/* Static Orbit Label — stays in world space */}
              <Entity
                key={planet.id + '-orbit-label'}
                position={
                  sunData?.absolutePos
                    ? `${sunData.absolutePos[0]} 0.5 ${sunData.absolutePos[2] - planet.orbitRadius}`
                    : `0 0.5 ${-(planet.orbitRadius ?? 0)}`
                }
              >
                <Entity
                  primitive="a-troika-text"
                  value={planet.name}
                  align="center"
                  color="white"
                  font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
                  scale="2 2 2"
                  look-at="[camera]"
                />
              </Entity>

              {/* Planet + Orbit Ring + Moon + Ring */}
              <Entity
                key={planet.id + '-orbit'}
                position={sunData?.absolutePos?.join(' ') ?? '0 0 0'}
                animation={`property: rotation; to: 0 360 0; loop: true; dur: ${planet.orbitAnimDur}; easing: linear`}
              >
                {/* Orbit Ring */}
                <Entity
                  geometry={`primitive: torus; radius: ${planet.orbitRadius}; radiusTubular: 0.01; segmentsTubular: 100`}
                  rotation="-90 0 0"
                  material="color: #888; opacity: 0.3; transparent: true"
                />

                {/* Planet + Moon + Ring */}
                <Entity
                  position={`${planet.orbitRadius} 0 0`}
                  animation={`property: rotation; to: 0 360 0; loop: true; dur: ${planet.selfRotDur}; easing: linear`}
                >
                  <Entity
                    gltf-model={`#${planet.id}`}
                    scale={`${planet.scale} ${planet.scale} ${planet.scale}`}
                    material="emissive: white; emissiveIntensity: 0.6"
                  />

                  {moon && (
                    <Entity
                      animation={`property: rotation; to: 0 360 0; loop: true; dur: ${moon.orbitAnimDur}; easing: linear`}
                    >
                      <Entity
                        position={`${moon.orbitRadius} 0 0`}
                        animation={`property: rotation; to: 0 360 0; loop: true; dur: ${moon.selfRotDur}; easing: linear`}
                      >
                        <Entity
                          gltf-model={`#${moon.id}`}
                          scale={`${moon.scale} ${moon.scale} ${moon.scale}`}
                          material="emissive: white; emissiveIntensity: 0.6"
                        />
                        {moon.name && (
                          <Entity
                            primitive="a-troika-text"
                            value={moon.name}
                            align="center"
                            color="white"
                            font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
                            position={`0 ${moon.textYOffset} 0`}
                            look-at="[camera]"
                          />
                        )}
                      </Entity>
                    </Entity>
                  )}

                  {ring && (
                    <Entity
                      gltf-model={`#${ring.id}`}
                      scale={`${ring.scale} ${ring.scale} ${ring.scale}`}
                      rotation={ring.modelRotation?.join(' ') ?? '0 0 0'}
                      material="emissive: white; emissiveIntensity: 0.4"
                    />
                  )}
                </Entity>
              </Entity>
            </>
          );
        })}
      </Entity>
    </Scene>
  );
}
