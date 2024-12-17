"use client"

import { Strategy } from "@/src/components/strategy";
import { Draw } from "@/src/models/draw.dto";
import { createDrawing, getAllDrawing } from "@/src/services/drawing-service";
import Link from "next/link"
import { SetStateAction, useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import { Button } from "@/src/components/button";
import { Line } from "@/src/components/line";
import { LineInput } from "@/src/components/line-input";
import { LineSelect } from "@/src/components/line-select";
import { useRouter } from "next/navigation";
import { createFolder, getAllFolders, shareFolder } from "@/src/services/folder-service";
import { Folder } from "@/src/models/folder.dto";
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { logout } from "@/src/services/auth-service";
import { AreaInput } from "@/src/components/text-area";
import { CheckboxInput } from "@/src/components/checkbox";


export default function About() {
  const [drawings, setDrawings] = useState<Draw[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {isOpen: isNewFolderOpen, onOpen: onNewFolderOpen, onOpenChange: onNewFolderOpenChange} = useDisclosure();
  const {isOpen: isSharingOpen, onOpen: onSharingOpen, onOpenChange: onSharingOpenChange} = useDisclosure();
  const {isOpen: isAiAssistOpen, onOpen: onAiAssistOpen, onOpenChange: onAiAssistOpenChange} = useDisclosure();
  const [sharedName, setSharedName] = useState<string>('');
  const [name, setName] = useState<string>('Новая стратегия');
  const [area, setArea] = useState<string | number>('full');
  const [type, setType] = useState<number | string>(1);
  const [sportType, setSportType] = useState<number | string>('basketball');
  const [folderName, setFolderName] = useState<string>('Новая папка');
  const [sharedFolder, setSharedFolder] = useState<number>(0);
  const [aiPromt, setAiPromt] = useState<string>("Атакующая стратегия чтобы победить всех")

  const router = useRouter()

  useEffect(()=>{
    async function get() {
      const res = await getAllDrawing(router);
      if(!res)
        return;
      const folders = await getAllFolders(router);
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
      const strategy = await createDrawing(name, type, area, router);
      router.push(`/strategies/${type}/${strategy?.id}`)
    }
  }

  function share() {
    shareFolder(sharedName, sharedFolder, router);
  }

  async function onAiCreate(){
    if (name.length > 2 || aiPromt.length > 15) {
      const strategy = await createDrawing(name, type, "full", router);
      // ??
    }
  }

  async function saveFolder() {
    if (folderName.length < 3) {
      return;
    }
    const strategy = await createFolder(folderName, sportType, router);
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
        <div className="flex justify-between">
          <div className="text-3xl">Мои стратегии</div>
          <div className="cursor-pointer" onClick={()=>{logout(router)}}>
            <Image src={"/logout.svg"} alt={"logout"} width={30} height={30}/>
          </div>
        </div>
          {folders.map((folder) => 
            <div className="flex flex-col mt-5" key={folder.id}>
              <div className="flex items-center whitespace-nowrap">
                <div className="mr-8 flex">
                  <div className="flex flex-col">
                    {folder.role===0 && <div className="mr-5 text-m">Стратегии, которыми с вами поделились</div>}
                    <div className="pr-4 text-2xl overflow-hidden">{folder.name}</div>
                  </div>
                  {folder.sport_type === 'football' && <Image src={"/football-icon.svg"} alt={"football"} width={30} height={30}/>}
                  {folder.sport_type === 'basketball' && <Image src={"/basketball-icon.svg"} alt={"basketball"} width={30} height={30}/>}
                  {folder.sport_type === 'hockey' && <Image src={"/hockey-icon.svg"} alt={"hockey"} width={30} height={30}/>}
                </div>
                <Line></Line>
                {folder.role===1 && <div className="cursor-pointer flex justify-end items-end ml-2">
                  <Image src='/share.svg' alt='share' width={30} height={30} onClick={()=>{setSharedFolder(folder.id);onSharingOpen();}}/>
                </div>}
              </div>
              <div className="flex flex-wrap">
                {drawings.map((draw) => {
                  if(draw.folder_id === folder.id) {
                    return (
                      <Link href={{pathname: `/strategies/${folder.id}/${draw.id}`}} key={draw.id}>
                        <Strategy name={draw.name} id={draw.id} />
                      </Link>
                    )
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
                  <CheckboxInput label={"Создать с помошью ИИ"} color="grey" value={false} onChange={()=> {onClose(); onAiAssistOpen();}}/>
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
                  <LineSelect label="Вид спорта" color="grey" options={[
                    {id: "basketball", name: "Баскетбол"},
                    {id: "football", name: "Футбол"},
                    {id: "hockey", name: "Хоккей"}
                    ]} onChange={setSportType} value={sportType}/>
                </ModalBody>
                <ModalFooter className="flex justify-end">
                  <Button label="Отмена" color="grey" clickHandler={onClose}/>
                  <Button label="Создать" color="orange" clickHandler={async ()=>{const newFolder = await saveFolder(); onClose(); folders.push(newFolder!)}} disabled={!(folderName.length > 2)}/>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal isOpen={isSharingOpen} onOpenChange={onSharingOpenChange}>
          <ModalContent>
                {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-black">
                        Поделиться папкой
                        <Line color={'grey'}></Line>
                    </ModalHeader>
                    <ModalBody>
                        <LineInput label="Почта получателя" color="grey" onChange={setSharedName} value={sharedName}/>
                    </ModalBody>
                    <ModalFooter className="flex justify-end">
                        <Button label="Отмена" color="grey" clickHandler={onClose}/>
                        <Button label="Поделиться" color="orange" clickHandler={()=>{share(); onClose();}} disabled={!(sharedName.length > 2)}/>
                    </ModalFooter>
                </>
                )}
          </ModalContent>
        </Modal>

        <Modal isOpen={isAiAssistOpen} onOpenChange={onAiAssistOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-black">
                  Создание стратегии
                  <Line color={'grey'}></Line>
                </ModalHeader>
                <ModalBody>
                <CheckboxInput label={"Создать с помошью ИИ"} color="grey" value={true} onChange={()=> {onClose(); onOpen();}}/>
                  <LineInput label="Название" color="grey" onChange={setName} value={name}/>
                  <LineSelect label="Папка" color="grey" options={folders.map((folder)=> {return {name: folder.name, id: folder.id}})} onChange={setType} value={type}/>
                  <AreaInput label="Описание требуемой стратегии" color="grey" onChange={setAiPromt} value={aiPromt} />
                </ModalBody>
                <ModalFooter className="flex justify-end">
                  <Button label="Отмена" color="grey" clickHandler={onClose}/>
                  <Button label="Cоздать" color="orange" clickHandler={()=>{onAiCreate()}} disabled={!(name.length > 2 && aiPromt.length > 15)}/>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
  )
  }