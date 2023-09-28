import { type TransformDescription } from "./types";

function getScaleMultiplier(delta: number): number {
  const speed = 1;
  const sign = Math.sign(delta);
  const deltaAdjustedSpeed = Math.min(0.25, Math.abs((speed * delta) / 128));
  return 1 - sign * deltaAdjustedSpeed;
}

function getOffsetXY(
  e: WheelEvent,
  owner: HTMLElement
): { offsetLeft: number; offsetTop: number } {
  const ownerRect = owner.getBoundingClientRect();
  const offsetX = e.clientX - ownerRect.left;
  const offsetY = e.clientY - ownerRect.top;
  return {
    offsetLeft: offsetX,
    offsetTop: offsetY,
  };
}

function zoomByRatio(
  transform: TransformDescription,
  clientX: number,
  clientY: number,
  ratio: number
): TransformDescription {
  const minZoom = 0.2;
  const maxZoom = 4;

  const newScale = transform.scale * ratio;

  if (newScale < minZoom) {
    if (transform.scale === minZoom) {
      return transform;
    }
    ratio = minZoom / transform.scale;
  }
  if (newScale > maxZoom) {
    if (transform.scale === maxZoom) {
      return transform;
    }
    ratio = maxZoom / transform.scale;
  }
  const size = { x: clientX, y: clientY };
  transform.x = size.x - ratio * (size.x - transform.x);
  transform.y = size.y - ratio * (size.y - transform.y);

  transform.scale *= ratio;

  return transform;
}

export function zoomFlowDesigner(
  event: WheelEvent,
  container: HTMLElement,
  prevTransformDescription: TransformDescription
) {
  const ratio = getScaleMultiplier(event.deltaY);
  const offset = getOffsetXY(event, container);

  return zoomByRatio(
    prevTransformDescription,
    offset.offsetLeft,
    offset.offsetTop,
    ratio
  );
}
