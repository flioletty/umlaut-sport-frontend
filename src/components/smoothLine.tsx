import { Line } from 'react-konva';
import { SmoothLineProps } from '../models/props.models';


export const SmoothLine = ({points, offset, innerRef} : SmoothLineProps) =>  {
  console.log(points)
  return (
    <Line
      points = {[...points.flatMap(p => [p.x+offset, p.y+offset])]}
      ref = {innerRef}
      stroke = {"black"}
      strokeWidth = {2}
      tension = {0.5}
      lineCap = {"round"}
      lineJoin = {"round"}
      bezier = {true}
    />
  );
};

