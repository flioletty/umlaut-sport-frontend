import { StrategyProps } from "../models/props.models";

export function Strategy({name, id}: StrategyProps) {
    return (
        <div className="w-40 h-52 text-white bg-stone-800 flex flex-col justify-center items-center rounded m-6" id={id.toString()}>
            <div className="w-4/5 h-3/4 bg-white mb-1"></div>
            <div className="">
                {name}
            </div>
        </div>
    )
}