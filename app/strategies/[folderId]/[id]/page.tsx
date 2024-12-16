"use client"

import { getFolderById } from '@/src/services/folder-service';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CanvasBasketball = dynamic(() => import('../../../../src/components/drawing-board').then(mod => mod.DrawingBoard), {
  ssr: false,
});

const CanvasFootball = dynamic(() => import('../../../../src/components/drawing-board-football').then(mod => mod.DrawingBoard), {
  ssr: false,
});

const CanvasHockey = dynamic(() => import('../../../../src/components/drawing-board-hockey').then(mod => mod.DrawingBoard), {
  ssr: false,
});

export default function Home({ params }: { params: { id: string, folderId: string } }) {
  const router = useRouter();
  const [type, setType] = useState<string>('');
  useEffect(()=>{
    async function getFolder() {
      const folder = await getFolderById(Number(params.folderId), router);
      setType(folder.sport_type);
    }
    getFolder();
  })
  return (
    <>
      {type === 'football' && <CanvasFootball params={params}/>}
      {type === 'hockey' && <CanvasHockey params={params}/>}
      {/* {type.current === '' && <Canvas params={params}/>}  */}
      {type === 'basketball' && <CanvasBasketball params={params}/>}
    </>
  );
}