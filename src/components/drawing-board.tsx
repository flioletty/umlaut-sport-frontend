"use client"

import { getDrawingById, updateDrawing } from '@/src/services/drawing-service';
import Konva from 'konva';
import React, { useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { Draw } from '../models/draw.dto';
import { Player } from './player';
import { Ball } from './ball';
import { Moving, Step } from '../models/moving.dto';
import { Button } from './button';
import { ButtonWithIcon } from './button-with-icon';
import Link from 'next/link';
import { prepare } from '../utils/bezier';
import Image from 'next/image';
import { Opponent } from './opponent';
import { StartLabels } from '../models/start-labels';

export function DrawingBoard({ params }: { params: { id: string } }) {  
  const [drawings, setDrawings] = React.useState<Step[]>([]);
  const [deletedDrawings, setDeletedDrawings] = React.useState<Step[]>([]);

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

  const mapObjects = new Map<string, React.MutableRefObject<null>>([
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
        if(strategy.data)
          setDrawings([...strategy.data]);
        if(strategy.start) {
          strategy.start.forEach((val)=>{
            if(val.objectName.startsWith('opponent')) {
              opponentsCoord[Number(val.objectName.at(-1))-1] = {x: val.steps.at(-1)?.x, y: val.steps.at(-1)?.y} as Moving;
              setOpponentsCoord(opponentsCoord);
            }
            StartLabels.set(val.objectName, val.label);
          });
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
      const t = frame?.time * timeStep;
      if (1 <= t) {
        anim.stop();
        return;
      }
      node.x(besier(x, t))
      node.y(besier(y, t))
    }, layer);
    anim.start();
  }

  function applyStepAnimated(step : Step, duration : number, backward : boolean = false) {
    const node = mapObjects.get(step.objectName)?.current! as Konva.Node;
    const moving = backward ? step.steps[0] : step.steps.at(-1)
    if (step.steps.length <= 2) {
      console.log(node, step.objectName)
      node.to({x: moving.x, y: moving.y, duration: duration / 1000})
      return;
    }
    curvedMoveAnimation(node, backward ? [...step.steps].reverse() : step.steps, duration)
  }

  function play() {
    if(draw?.start){
      for(let j = 0; j<draw.start.length; j++) {
        applyStepAnimated(draw.start[j], 0)
      }
    }
    let i = 0;
    setTimeout(function run() {
      if(i<drawings.length) {
        applyStepAnimated(drawings[i], 1000)
        i++;
      }
      setTimeout(run, 1000);
    }, 1000);      
  }

  function undo() {
    const deleted = drawings.pop()
    if(deleted) {
      setDrawings(drawings);
      setDeletedDrawings(deletedDrawings.concat(deleted));
      applyStepAnimated(deleted, 300, true)
    }
    console.log(draw)
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
        ] as Moving[]
      } as Step)
    }
    const schema = {
      id: draw?.id ?? 0,
      name: draw?.name ?? '',
      start: res, 
      data: []
    }
    updateDrawing(schema);
    setDraw(schema);
    drawings.length = 0;
    setDrawings(drawings);
  }

  function clearDeleted() {
    deletedDrawings.length = 0;
    setDeletedDrawings(deletedDrawings);
  }

  const opponents = opponentsCoord.map((coord, ind) => {
      if(opponentsCoord.length <= 5){
        console.log('1', opponent1, mapObjects.get(`opponent${ind+1}`), ind)
        const opponent = drawings.findLast((val)=>val.objectName === `opponent${ind+1}`);
        if(opponent){
          coord.x = opponent.steps.at(-1)?.x ?? opponentsCoord[ind].x;
          coord.y = opponent.steps.at(-1)?.y ?? opponentsCoord[ind].y;
        }
        return (
          <Opponent 
            innerRef={mapObjects.get(`opponent${ind+1}`) ?? null} 
            id={`opponent${ind+1}`} 
            key={`opponent${ind+1}`} 
            x={coord.x} 
            y={coord.y} 
            drawings={drawings} 
            setDrawings={setDrawings} 
            additionFunc={()=>clearDeleted()}
            disabled={draw?.start!==null}/>
        )
      }
    })

  return (
    <div className='p-8'>
      <div>
        <Link href={{pathname: '/strategies'}}>
          <ButtonWithIcon handleClick={() => {}} color='grey' iconSrc='/back.svg' alt='back' width={40} height={40} className='m-2' label='К стратегиям'/>
        </Link>
      </div>
      <div className='flex justify-center text-3xl'>
        <input className='bg-black' maxLength={20} minLength={3}
          value={draw?.name ?? ''} 
          onChange={e => setDraw({...draw, id: draw?.id ?? 0, name: e.target.value})} 
        />
      </div>
      <div className='flex justify-between'>
        <div className='bg-orange-400 p-6 m-6 mx-10 rounded-3xl flex flex-col justify-evenly items-center'>
            <ButtonWithIcon handleClick={() => start()} iconSrc='/start.svg' alt='start' width={60} height={60} disabled={draw?.start!==null}/>
            <Image src='/opponent.svg' alt='opponent' width={60} height={60} draggable={true}/>
            <ButtonWithIcon handleClick={() => undo()} iconSrc='/undo.svg' alt='undo' width={53} height={53} disabled={drawings.length<=0}/>
            <ButtonWithIcon handleClick={() => redo()} iconSrc='/undo.svg' alt='redo' width={53} height={53} className='-scale-x-100' disabled={deletedDrawings.length===0}/>
            <ButtonWithIcon handleClick={() => play()} iconSrc='/play.svg' alt='play' width={40} height={40} className='m-2'/>
            <ButtonWithIcon handleClick={() => {}} iconSrc='/comment.svg' alt='add comment' width={53} height={53}/>
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
            className='border-black border-2 '
            style={{ backgroundImage: `url(/background.jpg)`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}
            width={window.innerWidth*0.75 - 50}
            height={window.innerHeight*0.73 - 100}
            id="container"
            ref={stage}
          >
            <Layer ref={layer}>
              <Player innerRef={player1} id={'player1'} x={140} y={100} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={draw?.start!==null}/>
              <Player innerRef={player2} id={'player2'} x={320} y={280} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={draw?.start!==null}/>
              <Player innerRef={player3} id={'player3'} x={615} y={360} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={draw?.start!==null}/>
              <Player innerRef={player4} id={'player4'} x={920} y={280} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={draw?.start!==null}/>
              <Player innerRef={player5} id={'player5'} x={1100} y={100} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={draw?.start!==null}/>
              {opponents}
              <Ball innerRef={ball} id={'ball'} x={140} y={100} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()} disabled={true}/>
            </Layer>
          </Stage>
        </div>
      </div>
      <div className='flex items-center justify-end'>
        <Button clickHandler={()=>{updateDrawing({
            id: draw?.id ?? 0,
            name: draw?.name ?? '',
            start: draw?.start, 
            data: [...drawings]
          })}} label='Сохранить' color='orange'/>
        <Button clickHandler={()=>{}} label='Отмена'/>
      </div>
    </div>
  );
}
