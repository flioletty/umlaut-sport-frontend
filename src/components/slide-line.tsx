import Slider from "@mui/material/Slider";
import { ButtonWithIcon } from "./button-with-icon";
import { useState } from "react";

export function SlideLine() {
    const [slidesCount, setSlidesCount] = useState<number>(0);
    const [slidesMax, setSlidesMax] = useState<number>(0);

    return (
        <div className="">
            <ButtonWithIcon handleClick={() => {setSlidesMax(slidesMax-1)}} iconSrc='/minus.svg' color='grey' alt='minus' width={53} height={53} disabled={false}/>
            <Slider
                aria-label="Temperature"
                defaultValue={30}
                value={slidesCount}
                onChange={(e, newVal) => setSlidesCount(newVal as number)}
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={slidesMax}
            />
            <ButtonWithIcon handleClick={() => {setSlidesMax(slidesMax+1)}} iconSrc='/plus.svg' alt='plus' color='grey' width={53} height={53} disabled={false}/>
        </div>
    )
}