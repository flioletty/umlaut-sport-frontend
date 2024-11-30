import Slider from "@mui/material/Slider";
import { ButtonWithIcon } from "./button-with-icon";
import { SlideLineProps } from "../models/props.models";

export function SlideLine({onPlus, onMinus, onChangeCur, slidesMax, slidesCount, setSlidesCount}: SlideLineProps) {
    console.log('count',slidesCount)
    return (
        <div className="flex flex-col h-5/6 justify-items-center gap-4 w-4/5 items-center">
            <ButtonWithIcon hint="Добавить слайд" id='forth' handleClick={() => {onPlus(); setSlidesCount(slidesCount+1)}} iconSrc='/plus.svg' alt='plus' color='grey' width={53} height={53} disabled={false}/>
            <Slider id='sixth'
                style={{color:'rgb(251 146 60)'}}
                aria-label="Temperature"
                value={slidesCount}
                onChange={(e, newVal) => {onChangeCur((newVal as number)-1); setSlidesCount((newVal as number)); }}
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={slidesMax}
                orientation="vertical"
                className="secondary"
                marks
                sx={{
                    '& input[type="range"]': {
                      WebkitAppearance: 'slider-vertical',
                    },
                  }}                
            />
            <ButtonWithIcon hint="Удалить слайд" id='fith' handleClick={() => {onMinus()}} iconSrc='/minus.svg' color='grey' alt='minus' width={53} height={53} disabled={false}/>
        </div>
    )
}