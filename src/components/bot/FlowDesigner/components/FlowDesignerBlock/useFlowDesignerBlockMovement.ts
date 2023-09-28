import { useGesture } from "@use-gesture/react";
import { useState } from "react";
import { round } from "lodash";
import { type TransformDescription } from "../../types";

export function useFlowDesignerBlockNavigation(
  initPosition: Omit<TransformDescription, "scale">,
  rootScale: number
) {
  const [startValue, setStartValue] = useState<{ x: number; y: number }>({
    x: initPosition.x,
    y: initPosition.y,
  });
  const [distance, setDistance] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const bind = useGesture({
    onDrag: (state) => {
      const [valuesX, valuesY] = state.values;
      const [initialX, initialY] = state.initial;
      const deltaObject = {
        x: round((valuesX - initialX) * (1 / rootScale)),
        y: round((valuesY - initialY) * (1 / rootScale)),
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
  });

  const transformDescription = {
    x: startValue.x + distance.x,
    y: startValue.y + distance.y,
  };

  return { bind, transformDescription };
}
