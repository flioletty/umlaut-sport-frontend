import { DraggableBallProps, DraggableThingProps } from "../models/props.models"
import { DraggableBall } from "./draggable-ball";

export function Ball(props : DraggableBallProps) {
    const draggableThingProps = {
        ...props,
        src: '/ball.svg',
        draggable: false,
    } as DraggableThingProps

    return(
        <DraggableBall {...draggableThingProps}/>
    )
}