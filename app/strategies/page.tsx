"use client"

import { Strategy } from "@/src/components/strategy";
import { Draw } from "@/src/models/draw.dto";
import { getAllDrawing } from "@/src/services/drawing-service";
import Link from "next/link"
import { useEffect, useRef, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import { Button } from "@/src/components/button";
import { Line } from "@/src/components/line";
import { LineInput } from "@/src/components/line-input";
import { LineSelect } from "@/src/components/line-select";


export default function About() {
  const [drawings, setDrawings] = useState<Draw[]>([])
  const strategies = useRef<React.JSX.Element[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [name, setName] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(()=>{
    async function get() {
      const res = await getAllDrawing();
      setDrawings([...res]);
    }
    get();
  }, []);

    return (
      <div className="p-5">
        <div className="text-2xl">Мои стратегии</div>
        <div className="flex flex-wrap">
          {drawings.map((object) => 
            <Link href={{pathname: `/strategies/${object.id}`}} key={object.id}>
              <Strategy name={object.name} id={object.id} />
            </Link>)
          }
          <Link href={{pathname: `/strategies/new`}}>
            
          </Link>
          <div onClick={onOpen} className="w-40 h-52 text-orange-500 text-5xl bg-stone-800 flex flex-col justify-center items-center rounded m-6">
            <div className="w-4/5 h-3/4 bg-white flex flex-col justify-center items-center">+</div>
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
                  <LineInput label="Описание" color="grey" onChange={setDescription} value={description}/>
                </ModalBody>
                <ModalFooter className="flex justify-end">
                  <Button label="Отмена" color="grey" clickHandler={onClose}/>
                  <Button label="Сохранить" color="orange" clickHandler={()=>{console.log(name, description, type, area)}}/>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
  )
  }