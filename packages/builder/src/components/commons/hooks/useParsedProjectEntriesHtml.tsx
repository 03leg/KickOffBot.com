import { isNil } from "lodash";
import { useMemo } from "react";
import { useEntriesHtmlStyles } from "../styles/useEntriesHtml";

export const useParsedProjectEntriesHtml = (htmlContent?: string) => {
  const { classes } = useEntriesHtmlStyles();

  const textContent = useMemo(() => {
    let html = htmlContent;
    if (isNil(html)) {
      return html;
    }

    const variableMatches = html.matchAll(/&lt;%variables.(.*?)%&gt;/g);

    for (const m of variableMatches) {
      const value = m[1];
      html = isNil(value)
        ? html
        : html.replace(
          m[0],
          `<span class="${classes.variable}">${value}</span>`
        );
    }

    const templateMatches = html.matchAll(/&lt;%templates.(.*?)%&gt;/g);

    for (const m of templateMatches) {
      const value = m[1];
      html = isNil(value)
        ? html
        : html.replace(
          m[0],
          `<span class="${classes.template}">${value}</span>`
        );
    }

    return html;
  }, [classes.template, classes.variable, htmlContent]);


  return textContent;
};
