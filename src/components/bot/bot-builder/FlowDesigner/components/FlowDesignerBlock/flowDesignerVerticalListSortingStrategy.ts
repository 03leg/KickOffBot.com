import {
  type SortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { isNil } from "lodash";
import type { ClientRect } from "@dnd-kit/core";

export const flowDesignerVerticalListSortingStrategy = (scale: number) => {
  return ((args: {
    activeNodeRect: ClientRect | null;
    activeIndex: number;
    index: number;
    rects: ClientRect[];
    overIndex: number;
  }) => {
    const result = verticalListSortingStrategy(args);

    if (isNil(result)) {
      return result;
    }

    result.x = result.x * (1 / scale);
    result.y = result.y * (1 / scale);

    return result;
  }) as SortingStrategy;
};