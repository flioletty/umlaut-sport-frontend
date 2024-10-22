import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('../../../src/components/drawing-board').then(mod => mod.DrawingBoard), {
  ssr: false,
});

export default function Home({ params }: { params: { id: string } }) {
  return <Canvas params={params}/>;
}