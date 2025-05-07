// import { Canvas } from '@react-three/fiber';
// import { VRCanvas, DefaultXRControllers, Hands } from '@react-three/xr';
// import { Box, OrbitControls } from '@react-three/drei';
// import { useRef } from 'react';
// import { Mesh } from 'three';

// function SpinningCube() {
//   const ref = useRef<Mesh>(null!);

//   return (
//     <mesh ref={ref} rotation={[0.4, 0.2, 0]}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color="orange" />
//     </mesh>
//   );
// }

// export default function VRPage() {
//   return (
//     <main className="h-screen bg-black">
//       <VRCanvas>
//         <ambientLight />
//         <pointLight position={[10, 10, 10]} />
//         <SpinningCube />
//         <DefaultXRControllers />
//         <Hands />
//       </VRCanvas>
//     </main>
//   );
// }
