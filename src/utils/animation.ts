import Konva from "konva";
import { Moving, Step } from "../models/moving.dto";
import { prepare } from "./bezier";
import { Group } from "konva/lib/Group";
import { Layer } from "konva/lib/Layer";


export function curvedMoveAnimation(node: Konva.Node, movings: Moving[], duration: number, layer: React.RefObject<Layer>) {
    if (duration === 0) {
        node.x(movings.at(-1)?.x!)
        node.y(movings.at(-1)?.y!)
        return;
    }
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

export function applyStepAnimated(toAbsolute: (m: Moving | Moving[]) => Moving | Moving[], layer: React.RefObject<Layer>, mapObjects: Map<string, React.RefObject<Group>>, step: Step, duration: number, backward: boolean = false,) {
    const movings = toAbsolute(step.movings) as Moving[]

    if (step.objectName === 'ball') {
        const parent = (mapObjects.get(step.objectName)?.current! as Konva.Node).getParent() as Konva.Group;
        const node = (mapObjects.get(step.objectName)?.current! as Konva.Group);
        if (parent.children[4] instanceof Konva.Group) {
            parent.children.splice(4, 1);
        }
        else if (parent.children[3] instanceof Konva.Group) {
            parent.children.splice(3, 1);
        }
        node._setAttr('x', node.getAbsolutePosition().x)
        node._setAttr('y', node.getAbsolutePosition().y)
        parent.getLayer()?.add(node)
        parent.getLayer()?.draw();
        if (duration < 50) {
            node.to({ x: movings.at(0)?.x ?? 0, y: movings.at(0)?.y ?? 0, duration: 0 })
        } else {
            setTimeout(() => node.to({ x: movings.at(0)?.x ?? 0, y: movings.at(0)?.y ?? 0, duration: (duration - 50) / 1000 }), 50)
        }
        return;
    } else {
        if (step.hasBall) {
            setTimeout(() => {
                const ball = mapObjects.get('ball')?.current!;
                ball._setAttr('x', 0);
                ball._setAttr('y', 0);
                (mapObjects.get(step.objectName)?.current! as Konva.Group).add(ball as Konva.Group);
            }, 50)
        } else {
            if ((mapObjects.get(step.objectName)?.current! as Konva.Group).children[4] instanceof Konva.Group) {
                (mapObjects.get(step.objectName)?.current! as Konva.Group).children.splice(4, 1);
            }
            else if ((mapObjects.get(step.objectName)?.current! as Konva.Group).children[3] instanceof Konva.Group) {
                (mapObjects.get(step.objectName)?.current! as Konva.Group).children.splice(3, 1);
            }
        }
    }

    if (step.hasBlock) {
        Konva.Image.fromURL('/player-block.svg', (image) => {
            (mapObjects.get(step.objectName)?.current! as Konva.Group).add(image)
        })
    } else {
        if ((mapObjects.get(step.objectName)?.current! as Konva.Group).children[4] instanceof Konva.Image) {
            (mapObjects.get(step.objectName)?.current! as Konva.Group).children.splice(4, 1);
        }
        else if ((mapObjects.get(step.objectName)?.current! as Konva.Group).children[3] instanceof Konva.Image) {
            (mapObjects.get(step.objectName)?.current! as Konva.Group).children.splice(3, 1);
        }
    }

    const node = mapObjects.get(step.objectName)?.current! as Konva.Node;
    const moving = backward ? movings[0] : movings.at(-1)
    if (movings.length <= 2) {
        node.to({ x: moving?.x, y: moving?.y, duration: duration / 1000 })
        return;
    }
    return curvedMoveAnimation(node, backward ? [...movings].reverse() : movings, duration, layer);
}
