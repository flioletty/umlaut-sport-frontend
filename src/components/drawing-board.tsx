"use client"

import { getDrawingById, updateDrawing } from '@/src/services/drawing-service';
import Konva from 'konva';
import React, { MutableRefObject, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { Draw } from '../models/draw.dto';
import { Player } from './player';
import { Ball } from './ball';
import { Moving, Snapshot, Step } from '../models/moving.dto';
import { Button } from './button';
import { ButtonWithIcon } from './button-with-icon';
import Link from 'next/link';
import { prepare } from '../utils/bezier';
import Image from 'next/image';
import { Opponent } from './opponent';
import { StartLabels } from '../models/start-labels';
import TextareaAutosize from 'react-textarea-autosize';
import { Group } from 'konva/lib/Group';
import { SlideLine } from './slide-line';
import { forEach } from 'lodash';
import { resolve } from 'path';

export function DrawingBoard({ params }: { params: { id: string } }) {  
  const [drawings, setDrawings] = React.useState<Step[]>([]);
  const [snapshots, setSnapshots] = React.useState<Snapshot[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = React.useState<Snapshot>();
  const [deletedDrawings, setDeletedDrawings] = React.useState<Step[]>([]);
  const [drawBlock, setDrawBlock] = useState<boolean>(false);
  const [commentVisible, setCommentVisible] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [lastBallCoord, setlastBallCoord] = useState({x:0, y:0} as Moving)
  const areaLink = React.useRef('/half-background-rotated-cropped-rotated.svg')
  const [slidesMax, setSlidesMax] = useState<number>(0);

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
  const layer = React.useRef( null );
  const stage = React.useRef<Konva.Stage>( null );
  
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
        const strategy = await getDrawingById(Number(id));
        setDraw(strategy);
        setComment(strategy.comment)
        if(strategy.data)
          setSnapshots([...strategy.data]);
        if(strategy.area === 'full') {
          areaLink.current = '/half-background-rotated.svg'
        }
      }
    }
    create();
  },[])

  function curvedMoveAnimation(node : Konva.Node, movings : Moving[], duration : number) {
    const besier = prepare(movings.length);
    const x = movings.map(_ => _.x)
    const y = movings.map(_ => _.y)
    const timeStep = 1 / duration;
    const anim = new Konva.Animation(function (frame) {
      if (frame == undefined) return;
      const t = frame.time * timeStep;
      if (1 <= t) {
        anim.stop();
        return;
      }
      node.x(besier(x, t))
      node.y(besier(y, t))
    }, layer);
    anim.start();
    return anim;
  }

  function applyStepAnimated(step : Step, duration : number, backward : boolean = false) {
    if(step.hasBall) {
      setTimeout(()=>{
        const ball = mapObjects.get('ball')?.current!;      
        ball._setAttr('x', 0);
        ball._setAttr('y', 0);
        (mapObjects.get(step.objectName)?.current! as Konva.Group).add(ball as Konva.Group);
      }, 50)
    }else{
      if((mapObjects.get(step.objectName)?.current! as Konva.Group).children[4] instanceof Konva.Group) {
        (mapObjects.get(step.objectName)?.current! as Konva.Group).children.splice(4, 1);
      }
      else if((mapObjects.get(step.objectName)?.current! as Konva.Group).children[3] instanceof Konva.Group) {
          (mapObjects.get(step.objectName)?.current! as Konva.Group).children.splice(3, 1);
      }
    }

    if(step.hasBlock) {
      Konva.Image.fromURL('/player-block.svg', (image) => {
          (mapObjects.get(step.objectName)?.current! as Konva.Group).add(image)
      })
    }else{
      if((mapObjects.get(step.objectName)?.current! as Konva.Group).children[4] instanceof Konva.Image) {
        (mapObjects.get(step.objectName)?.current! as Konva.Group).children.splice(4, 1);
      }
      else if((mapObjects.get(step.objectName)?.current! as Konva.Group).children[3] instanceof Konva.Image) {
          (mapObjects.get(step.objectName)?.current! as Konva.Group).children.splice(3, 1);
      }
    }

    const node = mapObjects.get(step.objectName)?.current! as Konva.Node;
    const moving = backward ? step.steps[0] : step.steps.at(-1)
    if (step.steps.length <= 2) {
      node.to({x: moving?.x, y: moving?.y, duration: duration / 1000})
      return;
    }
    return curvedMoveAnimation(node, backward ? [...step.steps].reverse() : step.steps, duration);
  }

  function play(duration: number, maxSnap: number) {
    console.log(snapshots)
    let i = 0;
    let first = true;
    setlastBallCoord({x:0, y:0} as Moving)
    setTimeout(function run() {
      if(i<maxSnap) {
        if(i===0){
          for(const st of snapshots[i].steps)
            applyStepAnimated(st, 0)
        }
        else {
          const mapa = new Map<string, Step[]>();
          for(let a = 0; a<snapshots[i].steps.length; a++) {
            const step = snapshots[i].steps[a];
            const has = mapa.get(step.objectName);
            if(!step.hasBall && has) {
              mapa.set(step.objectName, has.concat(step))
            } else if(step.hasBall){
              const hb = mapa.get('hasBall');
              let res: Step[] = [];
              // if(!first && hb?.at(-1)?.objectName!==step.objectName){
              //   console.log(lastBallCoord)
              //   hb ? res.push({objectName: 'ball', label: '', steps: [{x: (step.steps.at(0)?.x ?? 0) - lastBallCoord.x, y: (step.steps.at(0)?.y ?? 0) - lastBallCoord.y} as Moving]} as Step) : res.push({objectName: 'ball', label: '', steps: [{x: step.steps.at(0)?.x ?? 0 - lastBallCoord.x, y: step.steps.at(0)?.y ?? 0 - lastBallCoord.y} as Moving]} as Step);
              //   console.log(res, lastBallCoord)
              // }
              setlastBallCoord(step.steps.at(-1) ?? lastBallCoord);
              res.push(step);
              first=false;
              console.log('1')
              mapa.set('hasBall', hb ? hb!.concat(res) : [...res]);
            } else {
              mapa.set(step.objectName, [step])
            }
          }
          console.log(mapa)
          for(const obj of mapa.values().toArray()){
            let k = 0;
            const time = duration / obj.length;
            setTimeout(function nextStep(){
              if(k<obj.length){
                applyStepAnimated(obj.at(k)!, time)
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

  function undo() {
    const deleted = drawings.pop()
    if(deleted) {
      setDrawings(drawings);
      setDeletedDrawings(deletedDrawings.concat(deleted));
      applyStepAnimated(deleted, 300, true)
    }
  }

  function redo() {
    const returned = deletedDrawings.pop()
    if(returned) {
      setDeletedDrawings(deletedDrawings);
      setDrawings(drawings.concat(returned));
      applyStepAnimated(returned, 300)
    }
  }

  function start() {
    const str = stage.current?.getStage()?.toJSON();
    const figures = JSON.parse(str ?? '').children[0].children;
    const res : Step[] = [];
    for (const figure of figures) {
      res.push({
        label: figure.attrs.name,
        objectName: figure.attrs.id,
        steps : [
          {
            x: figure.attrs.x,
            y: figure.attrs.y
          }
        ] as Moving[],
        hasBall: (mapObjects.get(figure.attrs.id)?.current! as Konva.Group).children[4] instanceof Konva.Group || (mapObjects.get(figure.attrs.id)?.current! as Konva.Group).children[3] instanceof Konva.Group,
        hasBlock: (mapObjects.get(figure.attrs.id)?.current! as Konva.Group).children[4] instanceof Konva.Image || (mapObjects.get(figure.attrs.id)?.current! as Konva.Group).children[3] instanceof Konva.Image,
      } as Step)
    }
    const snap = {snapnum: 0, steps: res} as Snapshot;
    const schema = {
      id: draw?.id ?? 0,
      name: draw?.name ?? '',
      data: [snap],
      area: draw?.area ?? '',
      folder_id: draw?.folder_id ?? 1,
      comment: comment,
    }
    updateDrawing(schema);
    setDraw(schema);
    drawings.length = 0;
    setDrawings(drawings);
    setSnapshots([snap]);
  }

  function clearDeleted() {
    deletedDrawings.length = 0;
    setDeletedDrawings(deletedDrawings);
    setDrawBlock(false)
  }

  const opponents = opponentsCoord.map((coord, ind) => {
    if(opponentsCoord.length <= 5){
      const opponent = drawings.findLast((val)=>val.objectName === `opponent${ind+1}`);
      if(opponent){
        coord.x = opponent.steps.at(-1)?.x ?? opponentsCoord[ind].x;
        coord.y = opponent.steps.at(-1)?.y ?? opponentsCoord[ind].y;
      }
      return (
        <Opponent 
          innerRef={(mapObjects.get(`opponent${ind+1}`) ?? null) as (MutableRefObject<Group> | null) } 
          id={`opponent${ind+1}`} 
          key={`opponent${ind+1}`} 
          x={coord.x} 
          y={coord.y} 
          drawings={drawings} 
          setDrawings={setDrawings} 
          additionFunc={()=>clearDeleted()}
          disabled={false}
          ballRef={ball as unknown as (React.MutableRefObject<Konva.Node> | null)}/>
      )
    }
  })

  function onPlusClicked() {
    if(snapshots.length === 0) {
      start();
    } else {
      setSnapshots(snapshots.concat({snapnum: snapshots.length, steps: [...drawings]} as Snapshot));
      setDrawings([]);
    }
    const newSnap = {snapnum: snapshots.length, steps: []} as Snapshot
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
    setDrawings(newCurSnap?.steps ?? []);
    if(last) {
      for(const step of last.steps)
        applyStepAnimated(step, 100, true)
    }
  }

  function onCurrentSnapChange(num: number) {
    const newCurSnap = snapshots.at(num);
    setCurrentSnapshot(newCurSnap);
    setDrawings(newCurSnap?.steps ?? []);
    console.log(newCurSnap)
    play(100, num+1);
  }

  console.log(drawings)

  return (
    <div className='p-8'>
      <div>
        <div>
          <Link href={{pathname: '/strategies'}}>
            <ButtonWithIcon handleClick={() => {}} color='grey' iconSrc='/back.svg' alt='back' width={40} height={40} className='m-2' label='К стратегиям'/>
          </Link>
        </div>
        <div className='flex justify-center text-3xl'>
          <input className='bg-transparent' maxLength={20} minLength={3}
            value={draw?.name ?? ''} 
            onChange={e => setDraw(draw==undefined ? undefined : {...draw, id: draw?.id ?? 0, name: e.target.value})} 
          />
        </div>
        <div className='flex justify'>
          <div className='bg-orange-400 p-6 m-6 mx-10 rounded-3xl flex flex-col justify-evenly items-center'>
              <ButtonWithIcon handleClick={() => start()} iconSrc='/start.svg' alt='start' width={60} height={60} disabled={true}/>
              <Image src='/opponent.svg' alt='opponent' width={60} height={60} draggable={true}/>
              <Image src='/block.svg' alt='block' width={60} height={60} draggable={false} onClick={()=>{setDrawBlock(true)}}/>
              <ButtonWithIcon handleClick={() => undo()} iconSrc='/undo.svg' alt='undo' width={53} height={53} disabled={drawings.length<=0}/>
              <ButtonWithIcon handleClick={() => redo()} iconSrc='/undo.svg' alt='redo' width={53} height={53} className='-scale-x-100' disabled={deletedDrawings.length===0}/>
              <ButtonWithIcon handleClick={() => play(2000, snapshots.length)} iconSrc='/play.svg' alt='play' width={40} height={40} className='m-2'/>
              <ButtonWithIcon handleClick={() => setCommentVisible(!commentVisible)} iconSrc='/comment.svg' alt='add comment' width={53} height={53}/>
          </div>
          <div className='m-6 mx-10'
            onDrop={(e) => {
              e.preventDefault();
              stage.current?.setPointersPositions(e);
              const pos = {
                x: stage.current?.getPointerPosition()?.x,
                y: stage.current?.getPointerPosition()?.y,
              } as Moving;
              setOpponentsCoord(opponentsCoord.concat([{x: pos.x-50, y: pos.y-30} as Moving]));
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Stage
              className='border-black border-2 bg-center'
              style={{  
                backgroundImage: `url(${areaLink.current})`, 
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover' 
              }}
              width={window.innerWidth*0.75 - 150}
              height={window.innerHeight*0.73 - 100}
              id="container"
              ref={stage}
            >
              <Layer ref={layer}>
                <Player innerRef={player1} id={'player1'} x={55} y={100} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock}/>
                <Player innerRef={player2} id={'player2'} x={235} y={280} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock}/>
                <Player innerRef={player3} id={'player3'} x={530} y={360} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock}/>
                <Player innerRef={player4} id={'player4'} x={835} y={280} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock}/>
                <Player innerRef={player5} id={'player5'} x={1015} y={100} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={false} ballRef={ball} block={drawBlock}/>
                {opponents}
                <Ball innerRef={ball} id={'ball'} x={140} y={100} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={true} ballRef={null}/>
              </Layer>
            </Stage>
          </div>
          {/* <div className={(commentVisible ? '' : 'hidden ') + 'mt-6 bg-transparent border-orange-500'}>
            <TextareaAutosize minRows={3} placeholder='Введите свой комментарий' maxRows={20} className='bg-transparent border-orange-500' value={comment} onChange={(e)=>setComment(e.target.value)}></TextareaAutosize>
          </div> */}
        </div>
        <div className='flex items-center justify-end'>
          <Button clickHandler={()=>{updateDrawing({
              id: draw?.id ?? 0,
              name: draw?.name ?? '',
              data: [...snapshots],
              area: draw?.area ?? '',
              folder_id: draw?.folder_id ?? 1,
              comment: comment,
            })}} label='Сохранить' color='orange'/>
          <Button clickHandler={()=>{}} label='Отмена'/>
        </div>
      </div>
      <div className=''>
        <SlideLine onMinus={onMinusClicked} onPlus={onPlusClicked} onChangeCur={onCurrentSnapChange} slidesMax={slidesMax}/>
      </div>
    </div>
  );
}
