import { useGesture } from "@use-gesture/react";
import { useState } from "react";
import { zoomFlowDesigner } from "./FlowDesigner.utils";
import { round } from "lodash";
import { type TransformDescription } from "./types";

export function useFlowDesignerNavigation() {
  const [startValue, setStartValue] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [distance, setDistance] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState<number>(1);

  const bind = useGesture({
    onDrag: (state) => {
      if (state.target !== state.currentTarget) {
        return;
      }
      
      const [valuesX, valuesY] = state.values;
      const [initialX, initialY] = state.initial;
      const deltaObject = {
        x: round(valuesX - initialX),
        y: round(valuesY - initialY),
      };

      if (state.down) {
        setDistance(deltaObject);
      }

      if (!state.down) {
        setStartValue({
          x: startValue.x + distance.x,
          y: startValue.y + distance.y,
        });
        setDistance({ x: 0, y: 0 });
      }
    },
    onWheel: (state) => {
      const newTransformDescription = zoomFlowDesigner(
        state.event,
        state.currentTarget as HTMLElement,
        { x: startValue.x, y: startValue.y, scale }
      );

      setStartValue({
        x: round(newTransformDescription.x),
        y: round(newTransformDescription.y),
      });
      setScale(round(newTransformDescription.scale, 2));
    },
  });

  const transformDescription = {
    x: startValue.x + distance.x,
    y: startValue.y + distance.y,
    scale,
  } as TransformDescription;

  return { bind,  transformDescription };
}
