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
import { getAllFolders } from "@/src/services/folder-service";
import { Folder } from "@/src/models/folder.dto";
import { OptionModel } from "@/src/models/props.models";


export default function About() {
  const [drawings, setDrawings] = useState<Draw[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [name, setName] = useState<string>('Новая стратегия');
  const [area, setArea] = useState<number>(1);
  const [type, setType] = useState<number>(1);

  const router = useRouter()

  useEffect(()=>{
    async function get() {
      const res = await getAllDrawing();
      const folders = await getAllFolders();
      if(res.length)
        setDrawings([...res]);
      if(folders.length){
        setFolders([...folders])
      }
    }
    get();
  }, []);

  async function onSave() {
    if (name.length > 2) {
      const strategy = await createDrawing(name, type);
      router.push(`/strategies/${strategy.id}`)
    }
  }

    return (
      <div className="p-5">
        <div className="text-3xl">Мои стратегии</div>
          {folders.map((folder) => 
            <div className="flex flex-col mt-5" key={folder.id}>
              <div className="flex items-center">
                <div className="mr-5 text-2xl">{folder.name}</div>
                <Line></Line>
              </div>
              <div className="flex flex-wrap">
                {drawings.map((draw) => {
                  if(draw.folder_id === folder.id) {
                    return (<Link href={{pathname: `/strategies/${draw.id}`}} key={draw.id}>
                      <Strategy name={draw.name} id={draw.id} />
                    </Link>)
                  }})
                }
                <div onClick={onOpen} className="cursor-pointer w-40 h-52 text-orange-500 text-5xl bg-stone-800 flex flex-col justify-center items-center rounded m-6">
                  <div className="w-4/5 h-3/4 flex flex-col justify-center items-center">+</div>
                </div>
              </div>
            </div>
          )}
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
                  <LineSelect label="Папка" color="grey" options={folders.map((folder)=> {return {name: folder.name, id: folder.id}})} onChange={setType} value={type}/>
                  <LineSelect label="Зал" color="grey" options={[{id: 1, name:'Полный'}, {id: 2, name:'Половина'}]} onChange={setArea} value={area}/>
                </ModalBody>
                <ModalFooter className="flex justify-end">
                  <Button label="Отмена" color="grey" clickHandler={onClose}/>
                  <Button label="Сохранить" color="orange" clickHandler={()=>{onSave()}} disabled={!(name.length > 2)}/>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
  )
  }