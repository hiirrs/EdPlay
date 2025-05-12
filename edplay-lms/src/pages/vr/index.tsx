import dynamic from 'next/dynamic';

const VRScene = dynamic(() => import('./VRScene'), { ssr: false });

export default function VRPage() {
  return <VRScene />;
}
