import Image from 'next/image';
import { ButtonColor, ButtonWithIconProps } from '../models/props.models';

export function ButtonWithIcon({ id, iconSrc, handleClick, width, height, className, alt, color = 'orange', disabled = false, label, hint = ''}: ButtonWithIconProps) {
    const colorMap = new Map<ButtonColor, string>([
        ['white', 'hover:bg-stone-200 active:bg-stone-400 focus:shadow-2xl focus:shadow-stone-200'],
        ['orange', 'hover:bg-orange-300 active:bg-orange-500 focus:shadow-2xl focus:shadow-orange-300'],
        ['grey', 'hover:bg-stone-600 active:bg-stone-900 focus:shadow-lg focus:shadow-orange-300 focus:bg-transparent']
    ])

    return (
        <button id={id} className={'rounded-lg disabled:opacity-50 outline-none ' + (disabled ? '' : colorMap.get(color))} onClick={handleClick} disabled={disabled} title={hint}>
            <div className={'flex items-center text-lg ' + className}>
                <Image src={iconSrc} alt={alt} width={width} height={height} draggable={false} />
                {label}
            </div>
        </button>
    )
}