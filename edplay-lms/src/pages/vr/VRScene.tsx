import 'aframe';
import { Entity, Scene } from 'aframe-react';
import { useEffect } from 'react';

export default function AframeShapes() {
  useEffect(() => {
    const scene = document.querySelector('a-scene');
    if (!scene) return;

    const addShape = (
      tag: string,
      attributes: { [key: string]: any },
      formula: string,
      pos: { x: number; y: number; z: number },
    ) => {
      const shape = document.createElement(tag);
      shape.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
      Object.entries(attributes).forEach(([key, value]) =>
        shape.setAttribute(key, value),
      );

      const text = document.createElement('a-text');
      text.setAttribute('value', formula);
      text.setAttribute('align', 'center');
      text.setAttribute('color', '#000');
      text.setAttribute('width', '4');
      text.setAttribute('position', `${pos.x} ${pos.y + 1} ${pos.z}`);

      scene.appendChild(shape);
      scene.appendChild(text);
    };

    addShape(
      'a-box',
      { color: '#4CC3D9', depth: 1, height: 1, width: 1 },
      'V = a³',
      {
        x: -3,
        y: 0.5,
        z: 0,
      },
    );
    addShape('a-sphere', { color: '#EF2D5E', radius: 0.5 }, 'V = 4/3πr³', {
      x: -1,
      y: 0.5,
      z: 0,
    });
    addShape(
      'a-cylinder',
      { color: '#FFC65D', radius: 0.5, height: 1 },
      'V = πr²h',
      {
        x: 1,
        y: 0.5,
        z: 0,
      },
    );
    addShape(
      'a-cone',
      { color: '#7BC8A4', radiusBottom: 0.5, radiusTop: 0.0, height: 1 },
      'V = 1/3πr²h',
      { x: 3, y: 0.5, z: 0 },
    );
  }, []);

  return (
    <Scene>
      <Entity position="0 1.6 4">
        <Entity primitive="a-camera" />
      </Entity>
      <Entity light="type: ambient; color: #fff" />
      <Entity
        light="type: directional; color: #fff; intensity: 0.6"
        position="1 1 0.5"
      />
    </Scene>
  );
}
