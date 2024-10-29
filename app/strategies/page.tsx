"use client"

import { Strategy } from "@/src/components/strategy";
import { Draw } from "@/src/models/draw.dto";
import { createDrawing, getAllDrawing } from "@/src/services/drawing-service";
import Link from "next/link"
import { useEffect, useRef, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import { Button } from "@/src/components/button";
import { Line } from "@/src/components/line";
import { LineInput } from "@/src/components/line-input";
import { LineSelect } from "@/src/components/line-select";
import { useRouter } from "next/navigation";


export default function About() {
  const [drawings, setDrawings] = useState<Draw[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [name, setName] = useState<string>('Новая стратегия');
  const [area, setArea] = useState<string>('');
  const [type, setType] = useState<string>('');

  const router = useRouter()

  useEffect(()=>{
    async function get() {
      const res = await getAllDrawing();
      setDrawings([...res]);
    }
    get();
  }, []);

  async function onSave() {
    if (name.length > 2 && type.length > 2) {
      const strategy = await createDrawing(name);
      router.push(`/strategies/${strategy.id}`)
    }
  }

    return (
      <div className="p-5">
        <div className="text-2xl">Мои стратегии</div>
        <div className="flex flex-wrap">
          {drawings.map((object) => 
            <Link href={{pathname: `/strategies/${object.id}`}} key={object.id}>
              <Strategy name={object.name} id={object.id} />
            </Link>)
          }
          <div onClick={onOpen} className="cursor-pointer w-40 h-52 text-orange-500 text-5xl bg-stone-800 flex flex-col justify-center items-center rounded m-6">
            <div className="w-4/5 h-3/4 flex flex-col justify-center items-center">+</div>
          </div>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-black">
                  Создание стратегии
                  <Line color={'grey'}></Line>
                </ModalHeader>
                <ModalBody>
                  <LineInput label="Название" color="grey" onChange={setName} value={name}/>
                  <LineInput label="Тип" color="grey" onChange={setType} value={type}/>
                  <LineSelect label="Зал" color="grey" options={['Полный', 'Половина']} onChange={setArea} value={area}/>
                </ModalBody>
                <ModalFooter className="flex justify-end">
                  <Button label="Отмена" color="grey" clickHandler={onClose}/>
                  <Button label="Сохранить" color="orange" clickHandler={()=>{onSave()}} disabled={!(name.length > 2 && type.length > 2)}/>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
  )
  }