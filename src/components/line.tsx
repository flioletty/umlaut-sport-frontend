import { LineProps, ButtonColor } from "../models/props.models"

export function Line({color = 'white', block = true}: LineProps) {
    const colorMap = new Map<ButtonColor, string>([
        ['white', 'border-t-stone-100'],
        ['orange', 'border-t-orange-400'],
        ['grey', 'border-t-stone-600']
    ]) 

    return (
        <hr className={"h-px colorMap border-t-2 mt-1 w-full " + colorMap.get(color) + (block ? ' block' : '')}/>
    )
}