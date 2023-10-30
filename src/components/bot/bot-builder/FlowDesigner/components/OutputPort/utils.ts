import { isNil, round } from "lodash";
import {
  type TransformDescription,
  type PositionDescription,
  type CoordinateDescription,
} from "../../types";

export enum Sector {
  S1,
  S2,
  S3,
  S4,
}

export function getDistance(
  p1: PositionDescription,
  p2: PositionDescription
): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function getPartLinePath(p1: PositionDescription): string;
export function getPartLinePath(
  p1: PositionDescription,
  p2: PositionDescription
): string;
export function getPartLinePath(
  p1: PositionDescription,
  p2?: PositionDescription
): string {
  if (isNil(p2)) {
    return `L${round(p1.x)} ${round(p1.y)}`;
  }
  return `M${round(p1.x)} ${round(p1.y)} L${round(p2.x)} ${round(p2.y)}`;
}

const step = 50 as const;

function get1Path(
  start: [x: number, y: number],
  end: [x: number, y: number],
  block: CoordinateDescription
) {
  const p1: PositionDescription = { x: start[0], y: start[1] };
  const p2: PositionDescription = { x: start[0] + step, y: start[1] };

  const p3: PositionDescription = { x: start[0] + step, y: start[1] };
  const p4: PositionDescription = { x: start[0] + step, y: block.top - step };

  const p5: PositionDescription = { x: start[0] + step, y: block.top - step };
  const p6: PositionDescription = { x: end[0], y: block.top - step };

  const p7: PositionDescription = { x: end[0], y: block.top - step };
  const p8: PositionDescription = { x: end[0], y: end[1] };

  const path =
    getPartLinePath(p1, p2) +
    getPartLinePath(p3, p4) +
    getPartLinePath(p5, p6) +
    getPartLinePath(p7, p8);
  const distance =
    getDistance(p1, p2) +
    getDistance(p3, p4) +
    getDistance(p5, p6) +
    getDistance(p7, p8);

  return { path, distance };
}

function get2Path(
  start: [x: number, y: number],
  end: [x: number, y: number],
  block: CoordinateDescription
) {
  const p1 = { x: start[0], y: start[1] };
  const p2 = { x: start[0] + step, y: start[1] };

  const p3 = { x: start[0] + step, y: start[1] };
  const p4 = { x: start[0] + step, y: block.top + block.height + step };

  const p5 = { x: start[0] + step, y: block.top + block.height + step };
  const p6 = { x: end[0], y: block.top + block.height + step };

  const p7 = { x: end[0], y: block.top + block.height + step };
  const p8 = { x: end[0], y: end[1] };

  const path =
    getPartLinePath(p1, p2) +
    getPartLinePath(p3, p4) +
    getPartLinePath(p5, p6) +
    getPartLinePath(p7, p8);
  const distance =
    getDistance(p1, p2) +
    getDistance(p3, p4) +
    getDistance(p5, p6) +
    getDistance(p7, p8);

  return { path, distance };
}

export function getSector(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Sector {
  let sector: Sector | null = null;
  if (startX <= endX) {
    if (startY >= endY) {
      sector = Sector.S2;
    } else if (startY < endY) {
      sector = Sector.S4;
    }
  } else if (startX > endX) {
    if (startY <= endY) {
      sector = Sector.S3;
    } else if (startY > endY) {
      sector = Sector.S1;
    }
  }

  if (isNil(sector)) {
    throw Error("InvalidOperationError");
  }

  return sector;
}

function getPath(
  square: Sector,
  start: [x: number, y: number],
  end: [x: number, y: number],
  block: CoordinateDescription
) {
  let path = `M${start[0]} ${start[1]} L${end[0]} ${start[1]} M${end[0]} ${start[1]} L${end[0]} ${end[1]}`;

  if (square === Sector.S1 || square === Sector.S3) {
    const p1 = get1Path(start, end, block);
    const p2 = get2Path(start, end, block);

    path = p1.distance > p2.distance ? p2.path : p1.path;
  }

  return path;
}

export function getBlockBoundingClientRect(
  blockElement: HTMLElement,
  viewPortOffset: PositionDescription,
  transformDescription: TransformDescription
): CoordinateDescription {
  const blockElementClientRect = blockElement.getBoundingClientRect();

  const top =
    (blockElementClientRect.top - viewPortOffset.y - transformDescription.y) *
    (1 / transformDescription.scale);
  const left =
    (blockElementClientRect.left - viewPortOffset.x - transformDescription.x) *
    (1 / transformDescription.scale);

  const height =
    blockElementClientRect.height * (1 / transformDescription.scale);
  const width = blockElementClientRect.width * (1 / transformDescription.scale);

  return { top, left, height, width };
}

export function getSvgPathForTempLine(
  transformDescription: TransformDescription,
  initial: [number, number],
  values: [number, number],
  viewPortOffset: PositionDescription,
  blockCoordinates: CoordinateDescription
) {
  const scale = transformDescription.scale;
  const [initialX, initialY] = initial;
  const [valuesX, valuesY] = values;

  const startX =
    (initialX - viewPortOffset.x - transformDescription.x) * (1 / scale);
  const startY =
    (initialY - viewPortOffset.y - transformDescription.y) * (1 / scale);

  const endX =
    (valuesX - viewPortOffset.x - transformDescription.x) * (1 / scale);
  const endY =
    (valuesY - viewPortOffset.y - transformDescription.y) * (1 / scale);

  const sector = getSector(startX, startY, endX, endY);
  const resultPath = getPath(
    sector,
    [startX, startY],
    [endX, endY],
    blockCoordinates
  );

  // const start = `${startX}, ${startY}`;
  // const end = `${endX}, ${endY}`;

  // const path = `M ${start} ${end}`;

  return resultPath;
}
