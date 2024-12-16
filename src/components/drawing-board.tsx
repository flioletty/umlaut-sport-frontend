"use client"

import { getAllDrawing, getDrawingById, updateDrawing } from '@/src/services/drawing-service';
import Konva from 'konva';
import React, { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { Draw } from '../models/draw.dto';
import { Player } from './player';
import { Ball } from './ball';
import { Moving, Snapshot, Step } from '../models/moving.dto';
import { Button } from './button';
import { ButtonWithIcon } from './button-with-icon';
import Link from 'next/link';
import Image from 'next/image';
import { Opponent } from './opponent';
import { Group } from 'konva/lib/Group';
import { SlideLine } from './slide-line';
import { toAbsolute as toAbsoluteImlp } from '../utils/moving-convers';
import { toRelative as toRelativeImpl } from '../utils/moving-convers';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Joyride, { STATUS } from 'react-joyride';
import { onbordingSteps } from "../models/start-labels";
import { applyStepAnimated } from '../utils/animation';
import { TextareaAutosize } from '@mui/material';
import { useRouter } from 'next/navigation';

export function DrawingBoard({ params }: { params: { id: string } }) {  
  const [drawings, setDrawings] = React.useState<Step[]>([]);
  const [snapshots, setSnapshots] = React.useState<Snapshot[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = React.useState<Snapshot>();
  const [deletedDrawings, setDeletedDrawings] = React.useState<Step[]>([]);
  const [drawBlock, setDrawBlock] = useState<boolean>(false);
  const [commentVisible, setCommentVisible] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [lastBallCoord, setlastBallCoord] = useState({x:0, y:0} as Moving)
  const areaLink = React.useRef('/half-background-new.svg')
  const [slidesMax, setSlidesMax] = useState<number>(0);
  const [runOnboarding, setRunOnboarding] = useState<boolean>(false);
  const [slidesCount, setSlidesCount] = useState<number>(1);

  const router = useRouter();

  console.log(setCommentVisible)
  // compilation hack

  const player1 = React.useRef( null );
  const player2 = React.useRef( null );
  const player3 = React.useRef( null );
  const player4 = React.useRef( null );
  const player5 = React.useRef( null );
  const opponent1 = React.useRef( null );
  const opponent2 = React.useRef( null );
  const opponent3 = React.useRef( null );
  const opponent4 = React.useRef( null );
  const opponent5 = React.useRef( null );
  const ball = React.useRef( null );
  const layer = React.useRef<Konva.Layer>( null );
  const layer1 = React.useRef<Konva.Layer>( null );
  const stage = React.useRef<Konva.Stage>( null );
  const fieldWidth = React.useRef<number>( window.innerWidth*0.6 - 150 )
  const fieldHeight = React.useRef<number>( fieldWidth.current / 3 * 2 )
  const toAbsolute = useCallback(( movings : Moving | Moving[]) => toAbsoluteImlp(movings, fieldWidth.current, fieldHeight.current), [fieldWidth, fieldHeight]);
  const toRelative = useCallback((steps : Moving[] | Moving) => { return toRelativeImpl(steps, fieldWidth.current, fieldHeight.current); }, [fieldWidth, fieldHeight]);
  const [opponentsCoord, setOpponentsCoord] = React.useState<Moving[]>([]);

  const [draw, setDraw] = React.useState<Draw>();

  const mapObjects = new Map<string, React.RefObject<Group>>([
    ["player1", player1],
    ["player2", player2],
    ["player3", player3],
    ["player4", player4],
    ["player5", player5],
    ["opponent1", opponent1],
    ["opponent2", opponent2],
    ["opponent3", opponent3],
    ["opponent4", opponent4],
    ["opponent5", opponent5],
    ["ball", ball],
  ])

  useEffect(()=> {
    async function create() {
      const id = params.id;
      if (Number(id)) {
        const strategy = await getDrawingById(Number(id), router);
        const draws = await getAllDrawing(router);
        if(!strategy) 
          return;
        setDraw(strategy);
        setComment(strategy.comment);
        if(strategy.snapshot){
          setSnapshots([...strategy.snapshot]);
          const slidesLen = [...strategy.snapshot].length
          setSlidesMax(slidesLen)
          setSlidesCount(slidesLen);
          // snapshots are empty ¯\_(ツ)_/¯
          // drawSnapshot(1)
        }
        if(draws?.length === 1) {
          setRunOnboarding(true);
        }
        if(strategy.area === 'full') {
          areaLink.current = '/full-background-new.svg'
        }
      }
    }
    create();
  },[])

  function getPerActorStepsMatrix(snapshot : Snapshot) {

    const mapa = new Map<string, Step[]>();
    for(const step of snapshot.step) {
      const has = mapa.get(step.objectName);
      if(!step.hasBall && has) {
        mapa.set(step.objectName, has.concat(step))
      } else if(step.hasBall){
        const hb = mapa.get('hasBall');
        const res: Step[] = [];
        if(hb?.at(-1)?.objectName!==step.objectName){
          res.push({objectName: 'ball', label: '', movings: [{x: step.movings.at(0)?.x, y: step.movings.at(0)?.y} as Moving]} as Step);
        }
        setlastBallCoord(step.movings.at(-1) ?? lastBallCoord);
        res.push(step);
        mapa.set('hasBall', hb ? hb!.concat(res) : [...res]);
      } else {
        mapa.set(step.objectName, [step])
      }
    }
    return mapa.values().toArray();
  }

  function play(duration: number, maxSnap: number) {
    let i = 0;

    setlastBallCoord({x:0, y:0} as Moving)
    setTimeout(function run() {
      if(i<maxSnap) {
        if(i===0){
          setSlidesCount(1);
          for(const st of snapshots[i].step)
            applyStepAnimated(toAbsolute, layer, mapObjects, st, 0)
        }
        else {
          setSlidesCount(i+1);

          for(const obj of getPerActorStepsMatrix(snapshots[i])){
            let k = 0;
            const time = duration / obj.length;
            setTimeout(function nextStep(){
              if(k<obj.length){
                applyStepAnimated(toAbsolute, layer, mapObjects, obj.at(k)!, time)
                k++;
                setTimeout(nextStep, time);
              }
            }, 0);
          }
        }
        i++;
        setTimeout(run, duration);
      }
    }, duration);
  }

  function drawSnapshot(index : number) {
    const lastSteps = new Map<string, Step>();
    let lastHaveBall = ""
    const snaps = [...snapshots];
    for (let i = 0; i< index; i++) {
      const matrSteps = getPerActorStepsMatrix(snaps[i]).flat();
      for ( const step of matrSteps)  {
        if (step.hasBall)
          lastHaveBall = step.objectName;
        lastSteps.set(step.objectName, step)
      }
    }
    const newLastSteps = [...lastSteps.values().toArray().flat()];
    for (const step of newLastSteps) {
      if (step.hasBall && step.objectName !== lastHaveBall) 
        step.hasBall = false;
      console.log(step)
      applyStepAnimated(toAbsolute, layer, mapObjects, step, 0)
    }
  }

  function undo() {
    const deleted = drawings.pop()
    if(deleted) {
      setDrawings(drawings);
      setDeletedDrawings(deletedDrawings.concat(deleted));
      applyStepAnimated(toAbsolute, layer, mapObjects, deleted, 300, true)
    }
  }

  function redo() {
    const returned = deletedDrawings.pop()
    if(returned) {
      setDeletedDrawings(deletedDrawings);
      setDrawings(drawings.concat(returned));
      applyStepAnimated(toAbsolute, layer, mapObjects, returned, 300)
    }
  }

  function start() {
    const str = stage.current?.getStage()?.toJSON();
    const figures = JSON.parse(str ?? '').children[0].children;
    const res : Step[] = [];
    for (const fig of figures) {
      const figure = fig.children[1];
      if(figure) {
        res.push({
          label: figure.attrs.name,
          objectName: figure.attrs.id,
          movings : toRelative([
            {
              x: figure.attrs.x,
              y: figure.attrs.y
            }
          ] as Moving[]),
          hasBall: (mapObjects.get(figure.attrs.id)?.current! as Konva.Group)?.children?.at(4) instanceof Konva.Group || (mapObjects.get(figure.attrs.id)?.current! as Konva.Group).children[3] instanceof Konva.Group,
          hasBlock: (mapObjects.get(figure.attrs.id)?.current! as Konva.Group)?.children?.at(4) instanceof Konva.Image || (mapObjects.get(figure.attrs.id)?.current! as Konva.Group).children[3] instanceof Konva.Image,
        } as Step)
      }
    }
    return res;
  }

  function clearDeleted() {
    deletedDrawings.length = 0;
    setDeletedDrawings(deletedDrawings);
    setDrawBlock(false)
  }

  const showTrace = snapshots.length!==0;

  const opponents = opponentsCoord.map((coord, ind) => {
    if(opponentsCoord.length <= 5){
      const opponent = drawings.findLast((val)=>val.objectName === `opponent${ind+1}`);
      if(opponent){
        coord.x = opponent.movings.at(-1)?.x ?? opponentsCoord[ind].x;
        coord.y = opponent.movings.at(-1)?.y ?? opponentsCoord[ind].y;
      }
      return (
        <Opponent 
          layer={layer1}
          innerRef={(mapObjects.get(`opponent${ind+1}`) ?? null) as (MutableRefObject<Group> | null) } 
          id={`opponent${ind+1}`} 
          key={`opponent${ind+1}`} 
          position={{x: coord.x, y: coord.y} as Moving}
          drawings={drawings} 
          setDrawings={setDrawings} 
          additionFunc={()=>clearDeleted()}
          disabled={false}
          ballRef={ball as unknown as (React.MutableRefObject<Konva.Node> | null)}
          windowHeight={fieldHeight.current} 
          windowWidth={fieldWidth.current}
          showTrace={showTrace}/>
      )
    }
  })

  function onPlusClicked() {
    setSnapshots([...snapshots.slice(0, currentSnapshot?.snapnum)]);
    const startSteps = start();
    if(snapshots.length===0){
      setSnapshots([{snapnum: 0, step: [...startSteps]} as Snapshot]);
    } else {
      if (currentSnapshot) {
        currentSnapshot.step = [...currentSnapshot.step, ...drawings];
        setSnapshots(snapshots.concat(currentSnapshot));
      }
    }
    setDrawings([]);
    const newSnap = {snapnum: snapshots.length, step: [...startSteps]} as Snapshot
    setCurrentSnapshot(newSnap);
    setSlidesMax(slidesMax+1); 
  }

  function onMinusClicked() {
    const last = snapshots.at(-1);
    snapshots.length -= 1;
    setSlidesMax(slidesMax-1);
    setSnapshots(snapshots);
    const newCurSnap = snapshots.at(-1);
    setCurrentSnapshot(newCurSnap);
    setDrawings(newCurSnap?.step ?? []);
    if(last) {
      for(const step of last.step)
        applyStepAnimated(toAbsolute, layer, mapObjects, step, 100, true)
    }
  }

  function onCurrentSnapChange(num: number) {
    const newCurSnap = snapshots.at(num)!;
    setCurrentSnapshot(newCurSnap);
    setDrawings(newCurSnap?.step ?? []);
    drawSnapshot(num + 1)
  }

  return (
    <div className='p-8'>
      <Joyride
        run={runOnboarding}
        locale={{ back: 'Назад', close: 'Закрыть', last: 'Все понятно', next: 'Далее', nextLabelWithProgress: 'Далее (Шаг {step} из {steps})', open: 'Открыть диалоговое окно', skip: 'Пропустить' }}
        disableOverlayClose={true} 
        showSkipButton={true}
        showProgress={true}
        continuous={true} 
        callback={(data)=>{
          if(data.status===STATUS.SKIPPED || data.status===STATUS.FINISHED || data.status===STATUS.ERROR)
            setRunOnboarding(false);
        }}
        steps={onbordingSteps}
        styles={{
          options: {
            primaryColor: '#ea580c',
          },
        }}
      />
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
      <div>
        <div className='flex flex-row width-max'>
          <Link href={{pathname: '/strategies'}} >
            <ButtonWithIcon hint='Вернуться к списку стратегий' handleClick={() => {}} color='grey' iconSrc='/back.svg' alt='back' width={40} height={40} className='m-2' label='К стратегиям'/>
          </Link>
          <div className='flex justify-center items-center text-3xl grow width-max'>
            <input disabled={!draw?.role} id='first' className='bg-transparent' maxLength={20} minLength={3}
              value={draw?.name ?? ''} 
              onChange={e => setDraw(draw==undefined ? undefined : {...draw, id: draw?.id ?? 0, name: e.target.value})} 
            />
          </div>
          {!!draw?.role && <div className='flex items-center cursor-pointer' onClick={()=>{setRunOnboarding(true)}}>
            <Image className='m-1' src={'/info.svg'} alt='info' width={20} height={20}/>
            Обучение
          </div>}
        </div>
        <div className='flex justify justify-evenly'>
          <div className='bg-orange-400 p-6 m-6 mx-10 rounded-3xl flex flex-col justify-evenly items-center'>
              {!!draw?.role && <><Image id='seventh' src='/opponent.svg' alt='opponent' width={60} height={60} draggable={snapshots.length===0}/>
              <Image title='Блок' id='eighth' src='/block.svg' alt='block' width={60} height={60} draggable={false} onClick={()=>{setDrawBlock(true)}}/>
              <ButtonWithIcon hint={'Отменить действие'} id='tenth' handleClick={() => undo()} iconSrc='/undo.svg' alt='undo' width={53} height={53} disabled={drawings.length===0}/>
              <ButtonWithIcon hint={'Вернуть действие'} id='eleventh' handleClick={() => redo()} iconSrc='/undo.svg' alt='redo' width={53} height={53} className='-scale-x-100' disabled={deletedDrawings.length===0}/></>}
              <ButtonWithIcon hint={'Воспроизвести'} id='thelth' handleClick={() => play(2000, snapshots.length)} iconSrc='/play.svg' alt='play' width={40} height={40} className='m-2'/>
              {/* <ButtonWithIcon hint={'Добавить комментарий'} id='second' handleClick={() => {setCommentVisible(!commentVisible); console.log(drawings.length);}} iconSrc='/comment.svg' alt='add comment' width={53} height={53}/> */}
          </div>
          <div className='m-6 mx-10'
            onDrop={(e) => {
              e.preventDefault();
              stage.current?.setPointersPositions(e);
              const pos = {
                x: stage.current?.getPointerPosition()?.x,
                y: stage.current?.getPointerPosition()?.y,
              } as Moving;
              setOpponentsCoord(opponentsCoord.concat([toRelative({x: pos.x-50, y: pos.y-30} as Moving) as Moving]));
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Stage
              className='border-black border-2 bg-center'
              style={{ 
                backgroundImage: `url(${areaLink.current})`, 
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
              width={fieldWidth.current}
              height={fieldHeight.current}
              id="container"
              ref={stage}
            >
              <Layer ref={layer}>
                <Player layer={layer1} innerRef={player1} id={'player1'} position={{x:0.2, y:0.45} as Moving} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock} windowHeight={fieldHeight.current} windowWidth={fieldWidth.current} showTrace={showTrace}/>
                <Player layer={layer1} innerRef={player2} id={'player2'} position={{x:0.3, y:0.6} as Moving}  drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock} windowHeight={fieldHeight.current} windowWidth={fieldWidth.current} showTrace={showTrace}/>
                <Player layer={layer1} innerRef={player3} id={'player3'} position={{x:0.45, y:0.7} as Moving} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock} windowHeight={fieldHeight.current} windowWidth={fieldWidth.current} showTrace={showTrace}/>
                <Player layer={layer1} innerRef={player4} id={'player4'} position={{x:0.6, y:0.6} as Moving}  drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock} windowHeight={fieldHeight.current} windowWidth={fieldWidth.current} showTrace={showTrace}/>
                <Player layer={layer1} innerRef={player5} id={'player5'} position={{x:0.7, y:0.45} as Moving} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock} windowHeight={fieldHeight.current} windowWidth={fieldWidth.current} showTrace={showTrace}/>
                {opponents}
                <Ball src='/ball.svg' layer={layer1} innerRef={ball} id={'ball'} position={{x:0.45, y:0.5} as Moving} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={true} ballRef={null} windowHeight={fieldHeight.current} windowWidth={fieldWidth.current} showTrace={false}/>
              </Layer>
              <Layer ref={layer1}></Layer>
            </Stage>
          </div>
          {!!draw?.role && <div className='mt-6 mb-6'>
              <SlideLine onMinus={onMinusClicked} onPlus={onPlusClicked} onChangeCur={onCurrentSnapChange} slidesMax={slidesMax} slidesCount={slidesCount} setSlidesCount={setSlidesCount} />
          </div>}
          {!!draw?.role && <div className={(commentVisible ? '' : 'hidden ') + 'mt-6 bg-transparent border-orange-500'}>
            <TextareaAutosize minRows={3} placeholder='Введите свой комментарий' maxRows={20} className='bg-transparent border-orange-500' value={comment} onChange={(e)=>setComment(e.target.value)}></TextareaAutosize>
          </div>}
        </div>
        {!!draw?.role && <div className='flex items-center justify-end'>
          <Button clickHandler={()=>{updateDrawing({
              id: draw?.id ?? 0,
              name: draw?.name ?? '',
              snapshot: [...snapshots],
              area: draw?.area ?? 'half',
              folder_id: draw?.folder_id ?? 1,
              comment: comment,
              role: draw?.role ?? 0,
            }, router)}} label='Сохранить' color='orange'/>
          <Button clickHandler={()=>{}} label='Отмена'/>
        </div>}
      </div>
    </div>
  );
}
