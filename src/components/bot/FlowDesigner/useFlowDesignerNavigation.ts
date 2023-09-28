import { useGesture } from "@use-gesture/react";
import { useState } from "react";
import { zoomFlowDesigner } from "./FlowDesigner.utils";

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
      const [valuesX, valuesY] = state.values;
      const [initialX, initialY] = state.initial;
      const deltaObject = { x: valuesX - initialX, y: valuesY - initialY };

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
        x: newTransformDescription.x,
        y: newTransformDescription.y,
      });
      setScale(newTransformDescription.scale);
    },
  });

  const transforDescription = {
    x: startValue.x + distance.x,
    y: startValue.y + distance.y,
    scale,
  };

  return { bind, transforDescription };
}
