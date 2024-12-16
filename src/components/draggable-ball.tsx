/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Image, Text } from "react-konva"
import { DraggableThingProps } from "../models/props.models"
import React, { useCallback, useEffect, useRef } from "react";
import { Step, Moving } from "../models/moving.dto";
import useImage from "use-image";
import { EditableText } from "./editable-text";
import { StartLabels } from "../models/start-labels";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { toRelative as toRelativeImpl, toAbsolute as toAbsoluteImpl } from "../utils/moving-convers";
import { SmoothLine } from "./smoothLine";
import { attractAttention } from "../utils/highlight";

export function DraggableBall({ drawings, setDrawings, position, src, id, innerRef, additionFunc = () => { }, disabled, ballRef, block = false, draggable = true, windowHeight, windowWidth, showTrace = true }: DraggableThingProps) {

    const [steps, setSteps] = React.useState<Moving[]>([]);
    const [text, setText] = React.useState(StartLabels.get(id) ?? '');
    const [hasBall, setHasBall] = React.useState(false);
    const trace = React.useRef<Konva.Line>(null)

    const toRelative = useCallback((steps: Moving[] | Moving) => { return toRelativeImpl(steps, windowWidth, windowHeight); }, [windowWidth, windowHeight]);
    const toAbsolute = useCallback((steps: Moving[] | Moving) => { return toAbsoluteImpl(steps, windowWidth, windowHeight); }, [windowWidth, windowHeight]);
    const playerRadius = useRef(windowWidth * 0.07)

    useEffect(() => { setText(StartLabels.get(id) ?? '') }, [StartLabels.get(id), id])
    useEffect(() => {
        if ((innerRef?.current as Konva.Group)?.children.length < 4)
            setHasBall(false)
    }, [(innerRef?.current as Konva.Group)?.children])

    useEffect(()=>{
        if(drawings.filter((draw)=>draw.objectName===id).length===0) {
            steps.length = 0
            setSteps(steps);
            trace.current?.points([]);
        }
    }, [drawings.filter((draw)=>draw.objectName===id).length])

    function getPositionFromStage(stage: any) {
        const circle = stage.getLayers()[0].findOne(`#${id}`)
        return ({ x: circle.attrs.x, y: circle.attrs.y } as Moving)
    }

    function dragStart(e: KonvaEventObject<DragEvent>) {
        steps.length = 0
        setSteps(steps)
        const position = getPositionFromStage(e.target.getStage())
        setSteps(steps.concat(position))
    }

    function addBall(e: KonvaEventObject<Event>) {
        if (innerRef && ballRef) {
            setHasBall(true);
            ballRef.current?._setAttr('x', 0);
            ballRef.current?._setAttr('y', 0);
            (innerRef?.current as Konva.Group).add(ballRef?.current as Konva.Group)
            const position = getPositionFromStage(e.target.getStage())
            const step = { objectName: id, movings: [toRelative(position)], label: text, hasBall: true } as Step
            setDrawings([...drawings.concat(step)])
        }
    }

    const [image] = useImage(src);

    function reduceSteps(movings: Moving[], every: number): Moving[] {
        if (movings.length === 0) return movings;
        const newArr = movings.filter((el, ind) => ind % every === 0);
        if (movings.length % every !== 1) {
            newArr.push(movings.at(-1)!);
        }
        return newArr;
    }

    return (
        <Group>
            <SmoothLine points={reduceSteps(steps, 10)} offset={playerRadius.current / 2} innerRef={trace} visible={showTrace}/>
            <Group x={(toAbsolute(position) as Moving).x} y={(toAbsolute(position) as Moving).y} id={id}
                name={text}
                ref={innerRef}
                onMouseMove={()=>{
                    if(showTrace && drawings.filter((draw)=>draw.objectName===id).length!==0)
                        attractAttention(document.getElementById("forth"));
                }}
                draggable={draggable && (!showTrace || (drawings.filter((draw)=>draw.objectName===id).length===0))}
                onDragEnd={() => {
                    const step = { objectName: id, movings: toRelative(reduceSteps(steps, 10)), label: text, hasBall: hasBall, hasBlock: false } as Step
                    if ((innerRef?.current as Konva.Group)?.children.length < 4)
                        step.hasBall = false;

                    drawings.push(step)
                    additionFunc();
                    if (block) {
                        Konva.Image.fromURL('/player-block.svg', (image) => {
                            image.height(playerRadius.current);
                            image.width(playerRadius.current);
                            (innerRef?.current as Konva.Group).add(image);
                        })
                        const step1 = { objectName: id, movings: [steps.at(-1)], label: text, hasBall: hasBall, hasBlock: true } as Step
                        drawings.push(step1)
                    }
                    setDrawings([...drawings])
                }}
                onDragMove={(e) => {
                    const position = getPositionFromStage(e.target.getStage());
                    setSteps(steps.concat(position));
                }}
                onDragStart={(e) => {
                    dragStart(e);
                    if (!block) {
                        if ((innerRef?.current as Konva.Group).children[4] instanceof Konva.Image) {
                            (innerRef?.current as Konva.Group).children.splice(4, 1);
                        }
                        else if ((innerRef?.current as Konva.Group).children[3] instanceof Konva.Image) {
                            (innerRef?.current as Konva.Group).children.splice(3, 1);
                        }
                    }
                }}
                onDblTap={(e) => {
                    addBall(e);
                }}
                onDblClick={(e) => {
                    addBall(e);
                }}
            >
                <Image width={id==="ball" ? playerRadius.current-10 : playerRadius.current} height={id==="ball" ? playerRadius.current-10 : playerRadius.current} alt='player' image={image} />
                <Text fontSize={playerRadius.current * 0.6} x={playerRadius.current * 0.34} y={playerRadius.current * 0.25} text={id === 'ball' ? '' : (id.match(/\d+/) ? parseInt(id.match(/\d+/)).toString() : '')} />
                <EditableText x={playerRadius.current * (0.5 - text.length * 0.04)} y={playerRadius.current} text={text} onChange={(value: string) => { setText(value); StartLabels.set(id, value) }} disabled={disabled} />
            </Group>
        </Group>
    )
}