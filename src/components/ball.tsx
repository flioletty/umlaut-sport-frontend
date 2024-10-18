import { DraggableBallProps, DraggableThingProps } from "../models/props.models"
import { DraggableBall } from "./draggable-ball";

export function Ball(props : DraggableBallProps) {
    const draggableThingProps = {
        ...props,
        color: "orange",
        radius: 15,
    } as DraggableThingProps

    return(
        <DraggableBall {...draggableThingProps}/>
    )
}