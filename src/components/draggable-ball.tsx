/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Image } from "react-konva"
import { DraggableThingProps } from "../models/props.models"
import React, { useEffect } from "react";
import { Step, Moving } from "../models/moving.dto";
import useImage from "use-image";
import { EditableText } from "./editable-text";
import { StartLabels } from "../models/start-labels";
import Konva from "konva";

export function DraggableBall({drawings, setDrawings, x, y, src, id, innerRef, additionFunc = () => {}, disabled, ballRef} : DraggableThingProps) {
    
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

    function dragStart(e) {
        steps.length = 0
        setSteps(steps)
        const position = getPositionFromStage(e.target.getStage())
        setSteps(steps.concat(position))
    }

    const [image] = useImage(src);

    return(
        <Group x={x} y={y} id={id}
            name={text}
            ref={innerRef}
                draggable
                onDragEnd={() => {
                    const step = {objectName: id, steps: [...steps].filter((el, ind)=>ind%8===0), label: text, hasBall: hasBall} as Step
                    setDrawings(drawings.concat(step))
                    additionFunc();
                }} 
                onDragMove={ (e) => {
                            const position = getPositionFromStage(e.target.getStage())
                            setSteps(steps.concat(position))
                    }
                } 
                onDragStart={(e) => {
                    dragStart(e);
                }}
                onDblClick={(e)=>{
                    if(innerRef && ballRef) {
                        setHasBall(true);
                        ballRef.current._setAttr('x', 0);
                        ballRef.current._setAttr('y', 0);
                        (innerRef?.current as Konva.Group).add(ballRef?.current as Konva.Node)
                        const position = getPositionFromStage(e.target.getStage())
                        const step = {objectName: id, steps: [position], label: text, hasBall: true} as Step
                        setDrawings(drawings.concat(step))
                        console.log(innerRef)
                    }
                }}
            >
            <Image  alt='player' image={image}/>
            <EditableText x={15} y={75} text={text} onChange={(value) => {setText(value); StartLabels.set(id, value)}} disabled={disabled}/>
        </Group>
    )
}