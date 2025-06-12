'use client';

import React from 'react';
// A-Frame and related imports
import 'aframe';
import 'aframe-look-at-component';
import { Entity, Scene } from 'aframe-react';
import 'aframe-troika-text';
import 'aframe-environment-component';

// Move solarSystemData here or pass it as a prop if it's dynamic from the page
const solarSystemData = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    absolutePos: [0, 1.6, -5],
    scale: 1.2,
    selfRotDur: 25000,
    emissive: true,
    textYOffset: 1.8,
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    orbits: 'sun',
    orbitRadius: 4,
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
  // Logic to derive data for rendering
  const sunData = solarSystemData.find((b) => b.id === 'sun');
  const planetsOrbitingSun = solarSystemData.filter(
    (b) => b.type === 'planet' && b.orbits === 'sun',
  );
  const moonsData = solarSystemData.filter((b) => b.type === 'moon');
  const ringsData = solarSystemData.filter((b) => b.type === 'ring');

  return (
    <Scene environment="preset: starry; lightPosition: 0 -1000 0">
      {/* Camera + Cursor */}
      <Entity position="0 1.6 15">
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
      <Entity light="type: ambient; color: #FFF; intensity: 1.0" />{' '}
      {/* Restored to your boosted lighting for testing */}
      {/* <Entity light="type: directional; intensity: 0.5; color: #FFF" position="1 1 0" /> */}
      {/* <Entity light="type: hemisphere; color: #DDD; groundColor: #333; intensity: 1.0" /> */}
      {/* Assets */}
      <Entity primitive="a-assets">
        {solarSystemData.map(({ id }) => (
          <Entity
            primitive="a-asset-item"
            key={id}
            id={id}
            src={`/models/${id}.glb`}
          />
        ))}
      </Entity>
      {/* Sun */}
      {sunData && (
        <Entity position={sunData?.absolutePos?.join(' ') ?? '0 0 0'}>
          <Entity
            gltf-model={`#${sunData.id}`}
            scale={`${sunData.scale} ${sunData.scale} ${sunData.scale}`}
            animation={`property: rotation; to: 0 360 0; loop: true; dur: ${sunData.selfRotDur}; easing: linear;`}
            material={
              sunData.emissive
                ? 'emissive: yellow; emissiveIntensity: 2.5'
                : 'shader: standard; color: #555'
            }
          />
          {sunData.name && (
            <Entity
              primitive="a-troika-text"
              value={sunData.name}
              align="center"
              color="white"
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              position={`0 ${sunData.textYOffset} 0`}
              look-at="[camera]"
            />
          )}
        </Entity>
      )}
      {/* Planets orbiting Sun */}
      {planetsOrbitingSun.map((planet) => {
        const moonForThisPlanet = moonsData.find((m) => m.orbits === planet.id);
        const ringForThisPlanet = ringsData.find((r) => r.orbits === planet.id);

        return (
          <Entity
            key={planet.id + '-orbit'}
            position={sunData?.absolutePos?.join(' ') ?? '0 1.6 -5'}
            animation={`property: rotation; to: 0 360 0; loop: true; dur: ${planet.orbitAnimDur}; easing: linear;`}
          >
            <Entity
              position={`${planet.orbitRadius} 0 0`}
              animation={`property: rotation; to: 0 360 0; loop: true; dur: ${planet.selfRotDur}; easing: linear;`}
            >
              <Entity
                gltf-model={`#${planet.id}`}
                scale={`${planet.scale} ${planet.scale} ${planet.scale}`}
              />
              {planet.name && (
                <Entity
                  primitive="a-troika-text"
                  value={planet.name}
                  align="center"
                  color="white"
                  font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
                  position={`0 ${planet.textYOffset} 0`}
                  look-at="[camera]"
                />
              )}
              {moonForThisPlanet && (
                <Entity
                  key={moonForThisPlanet.id + '-orbit'}
                  animation={`property: rotation; to: 0 360 0; loop: true; dur: ${moonForThisPlanet.orbitAnimDur}; easing: linear;`}
                >
                  <Entity
                    position={`${moonForThisPlanet.orbitRadius} 0 0`}
                    animation={`property: rotation; to: 0 360 0; loop: true; dur: ${moonForThisPlanet.selfRotDur}; easing: linear;`}
                  >
                    <Entity
                      gltf-model={`#${moonForThisPlanet.id}`}
                      scale={`${moonForThisPlanet.scale} ${moonForThisPlanet.scale} ${moonForThisPlanet.scale}`}
                    />
                    {moonForThisPlanet.name && (
                      <Entity
                        primitive="a-troika-text"
                        value={moonForThisPlanet.name}
                        align="center"
                        color="white"
                        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
                        position={`0 ${moonForThisPlanet.textYOffset} 0`}
                        look-at="[camera]"
                      />
                    )}
                  </Entity>
                </Entity>
              )}
              {ringForThisPlanet && (
                <Entity
                  gltf-model={`#${ringForThisPlanet.id}`}
                  scale={`${ringForThisPlanet.scale} ${ringForThisPlanet.scale} ${ringForThisPlanet.scale}`}
                  rotation={
                    ringForThisPlanet.modelRotation
                      ? ringForThisPlanet.modelRotation.join(' ')
                      : '0 0 0'
                  }
                />
              )}
            </Entity>
          </Entity>
        );
      })}
    </Scene>
  );
}
