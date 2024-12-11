import { Line } from 'react-konva';
import { SmoothLineProps } from '../models/props.models';
import { FC } from 'react';


export const SmoothLine : FC<SmoothLineProps> = ({ points, offset, innerRef, visible = true }) => {
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
      visible = {visible}
    />
  );
};

