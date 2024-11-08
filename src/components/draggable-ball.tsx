/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Image, Text } from "react-konva"
import { DraggableThingProps } from "../models/props.models"
import React, { useEffect } from "react";
import { Step, Moving } from "../models/moving.dto";
import useImage from "use-image";
import { EditableText } from "./editable-text";
import { StartLabels } from "../models/start-labels";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

export function DraggableBall({drawings, setDrawings, x, y, src, id, innerRef, additionFunc = () => {}, disabled, ballRef, block=false, draggable=true} : DraggableThingProps) {
    
    const [steps, setSteps] = React.useState<Moving[]>([]);
    const [text, setText] = React.useState(StartLabels.get(id) ?? '');
    const [hasBall, setHasBall] = React.useState(false);
    
    useEffect(()=>{setText(StartLabels.get(id) ?? '')}, [StartLabels.get(id), id])
    useEffect(()=>{
        if((ballRef?.current as Konva.Group)?.children.length<3)
            setHasBall(false)
    }, [(ballRef?.current as Konva.Group)?.children])
  
    function getPositionFromStage(stage: any) {
        const circle = stage.getLayers()[0].findOne(`#${id}`)
        return {x: circle.attrs.x, y: circle.attrs.y} as Moving
    }

    function dragStart(e : KonvaEventObject<DragEvent>) {
        steps.length = 0
        setSteps(steps)
        const position = getPositionFromStage(e.target.getStage())
        setSteps(steps.concat(position))
    }

    function addBall(e : KonvaEventObject<MouseEvent>) {
        if(innerRef && ballRef) {
            setHasBall(true);
            ballRef.current?._setAttr('x', 0);
            ballRef.current?._setAttr('y', 0);
            (innerRef?.current as Konva.Group).add(ballRef?.current as Konva.Group)
            const position = getPositionFromStage(e.target.getStage())
            const step = {objectName: id, steps: [position], label: text, hasBall: true} as Step
            setDrawings(drawings.concat(step))
        }
    }

    const [image] = useImage(src);

    return(
        <Group x={x} y={y} id={id}
            name={text}
            ref={innerRef}
                draggable={draggable}
                onDragEnd={() => {
                    const step = {objectName: id, steps: [...steps].filter((el, ind)=>ind%8===0), label: text, hasBall: hasBall, hasBlock: false} as Step
                    drawings.push(step)
                    additionFunc();
                    if(block) {
                        Konva.Image.fromURL('/player-block.svg', (image) => {
                            (innerRef?.current as Konva.Group).add(image)
                        })
                        const step1 = {objectName: id, steps: [steps.at(-1)], label: text, hasBall: hasBall, hasBlock: true} as Step
                        drawings.push(step1)
                    }
                    setDrawings(drawings)
                }} 
                onDragMove={ (e) => {
                            const position = getPositionFromStage(e.target.getStage())
                            setSteps(steps.concat(position))
                    }
                } 
                onDragStart={(e) => {
                    dragStart(e);
                    if(!block) {
                        if((innerRef?.current as Konva.Group).children[4] instanceof Konva.Image) {
                            (innerRef?.current as Konva.Group).children.splice(4, 1);
                        }
                        else if((innerRef?.current as Konva.Group).children[3] instanceof Konva.Image) {
                            (innerRef?.current as Konva.Group).children.splice(3, 1);
                        }
                    }
                }}
                onDblClick={(e)=>{
                    addBall(e);
                }}
            >
            <Image alt='player' image={image}/>
            <Text fontSize={32} x={25} y={21} text={id==='ball' ? '' : id.toString().at(-1)}/>
            <EditableText x={15} y={75} text={text} onChange={(value : string) => {setText(value); StartLabels.set(id, value)}} disabled={disabled}/>
        </Group>
    )
}