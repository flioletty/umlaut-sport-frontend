"use client"

import { Strategy } from "@/src/components/strategy";
import { Draw } from "@/src/models/draw.dto";
import { createDrawing, getAllDrawing } from "@/src/services/drawing-service";
import Link from "next/link"
import { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import { Button } from "@/src/components/button";
import { Line } from "@/src/components/line";
import { LineInput } from "@/src/components/line-input";
import { LineSelect } from "@/src/components/line-select";
import { useRouter } from "next/navigation";
import { createFolder, getAllFolders } from "@/src/services/folder-service";
import { Folder } from "@/src/models/folder.dto";
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function About() {
  const [drawings, setDrawings] = useState<Draw[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {isOpen: isNewFolderOpen, onOpen: onNewFolderOpen, onOpenChange: onNewFolderOpenChange} = useDisclosure();
  const [name, setName] = useState<string>('Новая стратегия');
  const [area, setArea] = useState<string | number>('full');
  const [type, setType] = useState<number | string>(1);
  const [folderName, setFolderName] = useState<string>('Новая папка');

  const router = useRouter()

  useEffect(()=>{
    async function get() {
      const res = await getAllDrawing();
      if(!res)
        return;
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
      const strategy = await createDrawing(name, type, area);
      router.push(`/strategies/${strategy?.id}`)
    }
  }

  async function saveFolder() {
    if (folderName.length < 3) {
      return;
    }
    const strategy = await createFolder(folderName);
    return strategy;
  }

    return (
      <div className="p-5">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <div className="text-3xl">Мои стратегии</div>
          {folders.map((folder) => 
            <div className="flex flex-col mt-5" key={folder.id}>
              <div className="flex items-center whitespace-nowrap">
                <div className="mr-5 text-2xl overflow-hidden">{folder.name}</div>
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
                <div onClick={()=>{setType(folder.id);onOpen();}} className="cursor-pointer w-40 h-52 text-orange-500 text-5xl bg-stone-800 flex flex-col justify-center items-center rounded m-6">
                  <div className="w-4/5 h-3/4 flex flex-col justify-center items-center">+</div>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center whitespace-nowrap	">
            <div className="mr-5 text-2xl cursor-pointer" onClick={onNewFolderOpen}>+ Новая папка</div>
            <Line></Line>
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
                  <LineSelect label="Папка" color="grey" options={folders.map((folder)=> {return {name: folder.name, id: folder.id}})} onChange={setType} value={type}/>
                  <LineSelect label="Зал" color="grey" options={[{id: 'full', name:'Полный'}, {id: 'half', name:'Половина'}]} onChange={setArea} value={area}/>
                </ModalBody>
                <ModalFooter className="flex justify-end">
                  <Button label="Отмена" color="grey" clickHandler={onClose}/>
                  <Button label="Сохранить" color="orange" clickHandler={()=>{onSave()}} disabled={!(name.length > 2)}/>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal isOpen={isNewFolderOpen} onOpenChange={onNewFolderOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-black">
                  Создание новой папки
                  <Line color={'grey'}></Line>
                </ModalHeader>
                <ModalBody>
                  <LineInput label="Название" color="grey" onChange={setFolderName} value={folderName}/>
                </ModalBody>
                <ModalFooter className="flex justify-end">
                  <Button label="Отмена" color="grey" clickHandler={onClose}/>
                  <Button label="Сохранить" color="orange" clickHandler={async ()=>{const newFolder = await saveFolder(); onClose(); folders.push(newFolder!)}} disabled={!(folderName.length > 2)}/>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
  )
  }