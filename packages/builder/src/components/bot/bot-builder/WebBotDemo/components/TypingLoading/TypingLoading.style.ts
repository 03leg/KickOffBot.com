import { makeStyles } from "tss-react/mui";

import { keyframes } from "tss-react";

const typingAnimation = keyframes({
  "0%": {
    opacity: "0.2",
  },
  "20%": {
    opacity: "1",
  },
  "100%": {
    opacity: "0.2",
  },
});

export const useTypingLoadingStyles = makeStyles()(() => ({
  typing: {
    position: "relative",
    width: 40,
    marginTop: -10,
  },
  dot: {
    content: "''",
    animation: `${typingAnimation} 1.3s infinite`,
    animationFillMode: "both",
    height: "10px",
    width: "10px",
    background: "white",
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: "50%",
  },
  dotSecond: {
    animationDelay: "0.2s !important",
    marginLeft: "15px",
  },
  dotThird: {
    animationDelay: "0.4s !important",
    marginLeft: "30px",
  },
}));
