"use client"

import { getFolderById } from '@/src/services/folder-service';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const CanvasBasketball = dynamic(() => import('../../../../src/components/drawing-board').then(mod => mod.DrawingBoard), {
  ssr: false,
});

const CanvasFootball = dynamic(() => import('../../../../src/components/drawing-board-football').then(mod => mod.DrawingBoard), {
  ssr: false,
});

export default function Home({ params }: { params: { id: string, folderId: string } }) {
  const router = useRouter();
  const type = useRef<string>('basketball');
  useEffect(()=>{
    async function getFolder() {
      const folder = await getFolderById(Number(params.folderId), router);
      type.current = folder.sport_type;
    }
  })
  return (
    <>
      {type.current === 'football' && <CanvasFootball params={params}/>}
      {/* {type.current === '' && <Canvas params={params}/>}
      {type.current === '' && <Canvas params={params}/>} */}
      {type.current === 'basketball' && <CanvasBasketball params={params}/>}
    </>
  );
}