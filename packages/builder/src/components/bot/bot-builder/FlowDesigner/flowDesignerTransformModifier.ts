import { type Modifier } from "@dnd-kit/core";
import { type Transform } from "@dnd-kit/utilities";
import type { Active, ClientRect, Over } from "@dnd-kit/core";
import { isNil, transform } from "lodash";
import { TransformDescription } from "@kickoffbot.com/types";

export const flowDesignerTransformModifier = (
  transformDescription: TransformDescription | null,
  viewPort: React.MutableRefObject<HTMLElement | null>
) => {
  return ((args: {
    activatorEvent: Event | null;
    active: Active;
    activeNodeRect: ClientRect | null;
    draggingNodeRect: ClientRect | null;
    containerNodeRect: ClientRect | null;
    over: Over | null;
    overlayNodeRect: ClientRect | null;
    scrollableAncestors: Element[];
    scrollableAncestorRects: ClientRect[];
    transform: Transform;
    windowRect: ClientRect | null;
  }) => {
    if (isNil(transformDescription)) {
      return transform;
    }

    const viewportPosition = viewPort?.current?.getBoundingClientRect();

    if (args.activeNodeRect) {
      if (args.activatorEvent) {
        args.activeNodeRect.top =
          ((args.activatorEvent as PointerEvent).y -
            (viewportPosition?.y ?? 0) -
            transformDescription.y) *
          (1 / transformDescription.scale);

        args.activeNodeRect.left =
          ((args.activatorEvent as PointerEvent).x -
            (viewportPosition?.x ?? 0) -
            transformDescription.x) *
          (1 / transformDescription.scale);
      }
      args.activeNodeRect.width = args.active?.data.current?.elementWidth ?? 0;
    }

    args.transform.x =
      args.transform.x * (1 / transformDescription?.scale ?? 1);
    args.transform.y =
      args.transform.y * (1 / transformDescription?.scale ?? 1);

    return args.transform;
  }) as Modifier;
};
