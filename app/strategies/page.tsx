"use client"

import { Strategy } from "@/src/components/strategy";
import { Draw } from "@/src/models/draw.dto";
import { getAllDrawing } from "@/src/services/drawing-service";
import Link from "next/link"
import { useEffect, useRef, useState } from "react";

export default function About() {
  const [drawings, setDrawings] = useState<Draw[]>([])
  const strategies = useRef<React.JSX.Element[]>([]);

  useEffect(()=>{
    async function get() {
      const res = await getAllDrawing();
      setDrawings([...res]);
      console.log(drawings)
    }
    get();
  }, []);

    return (
      <div className="p-5">
        <div className="text-2xl">Мои стратегии</div>
        <div className="flex">
          {drawings.map((object) => 
            <Link href={{pathname: `/strategies/${object.id}`}} key={object.id}>
              <Strategy name={object.name} id={object.id} />
            </Link>)
          }
          <Link href={{pathname: `/strategies/new`}}>
            <div className="w-40 h-52 text-orange-500 text-5xl bg-stone-800 flex flex-col justify-center items-center rounded m-6">
              <div className="w-4/5 h-3/4 bg-white flex flex-col justify-center items-center">+</div>
            </div>
          </Link>
        </div>
      </div>
  )
  }