import React from "react";
import { DraggableBallProps, DraggableThingProps } from "../models/props.models"
import { DraggableBall } from "./draggable-ball";

export function Opponent(props : DraggableBallProps) {
    const draggableThingProps = {
        ...props,
        src: '/opponent-circle.svg',
    } as DraggableThingProps

    return(
        <DraggableBall {...draggableThingProps}/>
    )
}