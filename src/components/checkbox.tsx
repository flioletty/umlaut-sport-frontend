import { Checkbox } from "@nextui-org/react"
import { ButtonColor, CheckboxProps } from "../models/props.models"

export function CheckboxInput({label, color='white', onChange, value}: CheckboxProps) {
    const colorMap = new Map<ButtonColor, string>([
        ['white', 'text-white border-b-stone-100'],
        ['orange', 'text-orange-400 border-b-orange-400'],
        ['grey', 'text-stone-700 border-b-stone-600']
    ])
    
    return (
        <div>
            <span className={'border-none mr-3 ' + colorMap.get(color)}>{label}:</span>
            <Checkbox
                onValueChange={(e)=>onChange(e)}
                defaultSelected={value}
                >
            </Checkbox>
        </div>
    )
}