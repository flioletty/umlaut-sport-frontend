import Slider from "@mui/material/Slider";
import { ButtonWithIcon } from "./button-with-icon";
import { useState } from "react";
import { SlideLineProps } from "../models/props.models";

export function SlideLine({onPlus, onMinus, onChangeCur, slidesMax}: SlideLineProps) {
    const [slidesCount, setSlidesCount] = useState<number>(1);

    console.log(slidesCount, slidesMax)

    return (
        <div className="">
            <ButtonWithIcon handleClick={() => {onMinus()}} iconSrc='/minus.svg' color='grey' alt='minus' width={53} height={53} disabled={false}/>
            <Slider
                aria-label="Temperature"
                value={slidesCount}
                onChange={(e, newVal) => {onChangeCur((newVal as number)-1); setSlidesCount((newVal as number));}}
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={slidesMax}
            />
            <ButtonWithIcon handleClick={() => {onPlus(); setSlidesCount(slidesCount+1)}} iconSrc='/plus.svg' alt='plus' color='grey' width={53} height={53} disabled={false}/>
        </div>
    )
}