import { WebVideoMediaDescription } from "@kickoffbot.com/types";
import { makeStyles } from "tss-react/mui";
import { getCssSize } from "../ImageMediaItem/ImageMediaItem.style";

export const useVideoMediaItemStyles = makeStyles<
  | {
      video: WebVideoMediaDescription;
      isLast: boolean;
    }
  | undefined
>()(({ spacing, shape }, options) => ({
  video: {
    height: getCssSize(options?.video.videoHeight),
    width: getCssSize(options?.video.videoWidth),
    objectFit: "cover",
    borderRadius: shape.borderRadius,
    maxWidth: "100%",
    marginBottom: options?.isLast ? 0 : spacing(1),
  },
}));
