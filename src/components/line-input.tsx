import { ButtonColor, LineInputProps } from "../models/props.models"

export function LineInput({label, color='white', onChange, value}: LineInputProps) {
    const colorMap = new Map<ButtonColor, string>([
        ['white', 'text-white border-b-stone-100'],
        ['orange', 'text-orange-400 border-b-orange-400'],
        ['grey', 'text-stone-700 border-b-stone-600']
    ])
    
    return (
        <div>
            <span className={'border-none mr-3 ' + colorMap.get(color)}>{label}:</span>
            <input 
                value={value} 
                required 
                minLength={3} 
                maxLength={30} 
                onChange={(e)=>onChange(e.target.value)} 
                className={"bg-transparent border-b-2 focus:outline-none invalid:border-b-red-600 " + colorMap.get(color)}
                >
            </input>
        </div>
    )
}