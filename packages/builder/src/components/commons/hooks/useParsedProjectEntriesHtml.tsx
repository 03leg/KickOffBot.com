import { isNil } from "lodash";
import { useMemo } from "react";
import { useEntriesHtmlStyles } from "../styles/useEntriesHtml";
import { useFlowDesignerStore } from "~/components/bot/bot-builder/store";

export const useParsedProjectEntriesHtml = (htmlContent?: string) => {
  const { classes } = useEntriesHtmlStyles();
  const { getVariableByName, getTemplateByName } = useFlowDesignerStore((state) => ({
    getVariableByName: state.getVariableByName,
    getTemplateByName: state.getTemplateByName,
  }));

  const textContent = useMemo(() => {
    let html = htmlContent;
    if (isNil(html)) {
      return html;
    }

    const variableMatches = html.matchAll(/&lt;%variables.(.*?)%&gt;/g);

    for (const m of variableMatches) {
      const value = m[1];

      const variableRefItems = value?.split('.');
      const variableName = variableRefItems?.[0];

      if (isNil(getVariableByName(variableName))) {
        html = isNil(value)
          ? html
          : html.replace(
            m[0],
            `<span class="${classes.notFoundEntry}">Not found: ${variableName}</span>`
          );

        continue;
      }

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

      if (isNil(getTemplateByName(value))) {
        html = isNil(value)
          ? html
          : html.replace(
            m[0],
            `<span class="${classes.notFoundEntry}">Not found: ${value}</span>`
          );

        continue;
      }


      html = isNil(value)
        ? html
        : html.replace(
          m[0],
          `<span class="${classes.template}">${value}</span>`
        );
    }

    return html;
  }, [classes.notFoundEntry, classes.template, classes.variable, getTemplateByName, getVariableByName, htmlContent]);


  return textContent;
};
