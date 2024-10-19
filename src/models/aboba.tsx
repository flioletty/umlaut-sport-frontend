import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('../components/drawing-board').then(mod => mod.DrawingBoard), {
  ssr: false,
});

export default function Aboba() {
  return <Canvas />;
}