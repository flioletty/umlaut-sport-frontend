import { ButtonColor, LineSelectProps } from "../models/props.models"

export function LineSelect({label, color='white', options, onChange, value}: LineSelectProps) {
    const colorMap = new Map<ButtonColor, string>([
        ['white', 'text-white border-b-stone-100'],
        ['orange', 'text-orange-400 border-b-orange-400'],
        ['grey', 'text-stone-700 border-b-stone-600']
    ])
    
    return (
        <div>
            <span className={'border-none mr-3 ' + colorMap.get(color)}>{label}:</span>
            <select value={value} onChange={(e)=>onChange(e.target.value)} className={"bg-transparent border-b-2 focus:outline-none " + colorMap.get(color)}>
                {options.map((val)=>(<option value={val.id} key={val.id}>{val.name}</option>))}
            </select>
        </div>
    )
}