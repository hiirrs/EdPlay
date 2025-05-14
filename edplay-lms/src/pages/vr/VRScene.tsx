import 'aframe';
import 'aframe-look-at-component';
import { Entity, Scene } from 'aframe-react';
import 'aframe-troika-text';
import 'aframe-environment-component';

// Shape data
const shapes = [
  {
    type: 'box',
    props: { color: '#4CC3D9', width: 2, height: 2, depth: 2 },
    formula: 'V = a³',
    position: { x: -3, y: 1, z: 0 },
  },
  {
    type: 'sphere',
    props: { color: '#EF2D5E', radius: 1 },
    formula: 'V = 4/3πr³',
    position: { x: -1, y: 1, z: 0 },
  },
  {
    type: 'cylinder',
    props: { color: '#FFC65D', radius: 1, height: 2 },
    formula: 'V = πr²h',
    position: { x: 1, y: 1, z: 0 },
  },
  {
    type: 'cone',
    props: { color: '#7BC8A4', radiusTop: 0, radiusBottom: 1, height: 2 },
    formula: 'V = 1/3πr²h',
    position: { x: 3, y: 1, z: 0 },
  },
];

// Utility to lighten color
function lightenColor(hex: string, percent: number) {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  r = Math.min(255, Math.floor(r + (255 - r) * percent));
  g = Math.min(255, Math.floor(g + (255 - g) * percent));
  b = Math.min(255, Math.floor(b + (255 - b) * percent));
  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function AframeShapes() {
  return (
    <Scene environment="preset: forest">
      {/* Camera + Cursor */}
      <Entity position="0 1 4">
        <Entity primitive="a-camera" raycaster="objects: .interact">
          <Entity
            primitive="a-cursor"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
            material="color: #EF2D5E; shader: flat"
            position="0 0 -1"
          />
        </Entity>
      </Entity>

      {/* Lighting */}
      <Entity light="type: ambient; color: #fff" />
      <Entity
        light="type: directional; color: #fff; intensity: 0.1"
        position="1 1 0.5"
      />

      {/* Sun */}
      <Entity
        primitive="a-sphere"
        color="#FFF176"
        radius="1"
        position="0 10 -10"
        material="emissive: #FFF176; emissiveIntensity: 0.6"
      />

      {/* Shapes */}
      {shapes.map(({ type, props, formula, position }, idx) => {
        const delay = Math.random() * 1000;
        const hoverColor = lightenColor(props.color, 0.4);

        return (
          <Entity key={idx}>
            {/* Floating container */}
            <Entity
              position={`${position.x} ${position.y} ${position.z}`}
              animation={`
                property: position;
                dir: alternate;
                dur: 1000;
                easing: easeInOutSine;
                loop: true;
                delay: ${delay};
                to: ${position.x} ${position.y + 0.3} ${position.z}
              `}
            >
              {/* Shape geometry */}
              <Entity
                class="interact"
                primitive={`a-${type}`}
                {...props}
                events={{
                  mouseenter: (e) =>
                    e.target.setAttribute('material', 'color', hoverColor),
                  mouseleave: (e) =>
                    e.target.setAttribute('material', 'color', props.color),
                }}
              />
            </Entity>

            {/* Floating formula text */}
            <Entity
              primitive="a-toika-text"
              value={formula}
              color="#000"
              align="center"
              width="4"
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              position={`${position.x} ${position.y + 1.3} ${position.z}`}
              look-at="[camera]"
              animation={`
                property: position;
                dir: alternate;
                dur: 1000;
                easing: easeInOutSine;
                loop: true;
                delay: ${delay};
                to: ${position.x} ${position.y + 1.7} ${position.z}
              `}
            />
          </Entity>
        );
      })}
    </Scene>
  );
}
