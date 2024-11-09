import { Moving } from "../models/moving.dto";

export function toRelative(movings : Moving | Moving[], width: number, height : number) : Moving | Moving[]{
  if (!Array.isArray(movings)) {
    return { x : movings.x / width, y : movings.y / height} as Moving;
  }
  return movings.map((moving : Moving) => {return toRelative(moving, width, height) as Moving});
}

export function toAbsolute(movings : Moving | Moving[], width: number, height : number) : Moving | Moving[]{
  if (!Array.isArray(movings)) {
    return { x : movings.x * width, y : movings.y * height} as Moving;
  }
  return movings.map((moving : Moving) => {return toAbsolute(moving, width, height) as Moving});
}
