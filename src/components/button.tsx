import { ButtonColor, ButtonProps } from "../models/props.models";

export function Button({clickHandler, label, color = 'grey'}:ButtonProps) {

    const colorMap = new Map<ButtonColor, string>([
        ['white', 'bg-stone-100 hover:bg-stone-200 active:bg-stone-400'],
        ['orange', 'bg-orange-400 text-white hover:bg-orange-300 active:bg-orange-500'],
        ['grey', 'bg-stone-700 text-white hover:bg-stone-600 active:bg-stone-900']
    ])

    return (
        <button 
            onClick={clickHandler} 
            className={'min-w-32 my-1.5 m-1 p-1 rounded-md ' + (colorMap.get(color))}
            >
                {label}
        </button>
    )
}