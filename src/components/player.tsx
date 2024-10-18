import React from "react";
import { DraggableBallProps, DraggableThingProps } from "../models/props.models"
import { DraggableBall } from "./draggable-ball";

export function Player(props : DraggableBallProps) {
    const draggableThingProps = {
        ...props,
        color: "green",
        radius: 25,
    } as DraggableThingProps

    return(
        <DraggableBall {...draggableThingProps}/>
    )
}