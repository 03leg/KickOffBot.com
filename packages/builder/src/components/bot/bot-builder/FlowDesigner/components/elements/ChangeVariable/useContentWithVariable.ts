import { isNil } from "lodash";
import { useMemo } from "react";
import { makeStyles } from "tss-react/mui";

export const useVariableInTextStyles = makeStyles()(() => ({
  variable: {
    backgroundColor: "#FF5722",
    borderRadius: "5px",
    color: "white",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingBottom: "1px",
    paddingTop: "1px",
  },
  propertyName: {
    backgroundColor: "#ff9800",
    borderRadius: "5px",
    color: "white",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingBottom: "1px",
    paddingTop: "1px",
  },
}));

export function useContentWithVariable(text: string) {
  const { classes } = useVariableInTextStyles();
  const result = useMemo(() => {
    const matches = text.matchAll(/<%variables.(.*?)%>/g);
    let content = text;

    for (const m of matches) {
      const value = m[1];
      content = isNil(value)
        ? content
        : content.replace(
            m[0],
            `<span class="${classes.variable}">${value}</span>`
          );
    }

    return content;
  }, [classes.variable, text]);

  return result;
}
