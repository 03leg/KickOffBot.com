import { isNil } from "lodash";
import {
  type TransformDescription,
  type PositionDescription,
  type CoordinateDescription,
} from "../../types";

enum Square {
  S1,
  S2,
  S3,
  S4,
}

function getDistance(p1: PositionDescription, p2: PositionDescription): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getPartLinePath(p1: PositionDescription, p2: PositionDescription) {
  return `M${p1.x} ${p1.y} L${p2.x} ${p2.y}`;
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

function getPath(
  square: Square,
  start: [x: number, y: number],
  end: [x: number, y: number],
  block: CoordinateDescription
) {
  let path = `M${start[0]} ${start[1]} L${end[0]} ${start[1]} M${end[0]} ${start[1]} L${end[0]} ${end[1]}`;

  if (square === Square.S1 || square === Square.S3) {
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

  let square: Square | null = null;
  if (startX <= endX) {
    if (startY >= endY) {
      square = Square.S2;
    } else if (startY < endY) {
      square = Square.S4;
    }
  } else if (startX > endX) {
    if (startY <= endY) {
      square = Square.S3;
    } else if (startY > endY) {
      square = Square.S1;
    }
  }

  if (isNil(square)) {
    throw Error("InvalidOperationError");
  }

  const resultPath = getPath(
    square,
    [startX, startY],
    [endX, endY],
    blockCoordinates
  );

  // const start = `${startX}, ${startY}`;
  // const end = `${endX}, ${endY}`;

  // const path = `M ${start} ${end}`;

  return resultPath;
}
