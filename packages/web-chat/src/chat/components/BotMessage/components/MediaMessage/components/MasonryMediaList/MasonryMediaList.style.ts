import { WebImageMediaDescription } from "@kickoffbot.com/types";
import { makeStyles } from "tss-react/mui";

export const useMasonryMediaListStyles = makeStyles<
  | {
      image: WebImageMediaDescription;
    }
  | undefined
>()(({ spacing, shape }, options) => ({}));
