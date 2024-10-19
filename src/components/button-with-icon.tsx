import Image from 'next/image';
import { ButtonColor, ButtonWithIconProps } from '../models/props.models';

export function ButtonWithIcon({iconSrc, handleClick, width, height, className, alt, color = 'orange', disabled = false, label}: ButtonWithIconProps) {
    const colorMap = new Map<ButtonColor, string>([
        ['white', 'hover:bg-stone-200 active:bg-stone-400'],
        ['orange', 'hover:bg-orange-300 active:bg-orange-500'],
        ['grey', 'hover:bg-stone-600 active:bg-stone-900']
    ])
    
    return (
        <button className={'rounded-lg disabled:opacity-50 ' + (disabled ? '' : colorMap.get(color))} onClick={handleClick} disabled={disabled}>
            <div className={'flex items-center text-lg ' + className}>
                <Image src={iconSrc} alt={alt} width={width} height={height}/>
                {label}
            </div>
        </button>
    )
}