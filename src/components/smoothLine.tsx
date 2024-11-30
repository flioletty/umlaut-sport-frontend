import Konva from 'konva';
import { SmoothLineProps } from '../models/props.models';

export const SmoothLine = ({points, radius} : SmoothLineProps) : Konva.Line => {

  return new Konva.Line({
      points: [...points.flatMap(p => [p.x+radius, p.y+radius])],
      stroke: "black",
      strokeWidth:2,
      tension:0.5,
      lineCap:"round",
      lineJoin:"round",
      bezier: true
});
};

