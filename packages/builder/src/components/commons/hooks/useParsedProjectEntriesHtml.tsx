/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNil } from "lodash";
import { useMemo } from "react";
import { useEntriesHtmlStyles } from "../styles/useEntriesHtml";
import { useFlowDesignerStore } from "~/components/bot/bot-builder/store";
import { BotTemplate, BotVariable } from "@kickoffbot.com/types";

const parseVariables = (html: string, regex: RegExp, getVariableByName: (variableName: BotVariable["name"]) => BotVariable | null, classes: any) => {
  const variableMatches = html.matchAll(regex);

  for (const m of variableMatches) {
    const value = m[1];

    const parsedArray = value?.split('|') as [string, string];
    const variablePathArray = parsedArray[0].split('.') as [string, string];
    const variableName = variablePathArray[0];

    if (!isNil(variableName) && isNil(getVariableByName(variableName))) {
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

  return html;
}

const parseTemplates = (html: string, regex: RegExp, getTemplateByName: (templateName: BotTemplate["name"]) => BotTemplate | null, classes: any) => {
  const templateMatches = html.matchAll(regex);

  for (const m of templateMatches) {
    const value = m[1];

    if (!isNil(value) && isNil(getTemplateByName(value))) {
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
}

const parseObjectProperty = (html: string, regex: RegExp, classes: any) => {
  const objectPropMatches = html.matchAll(regex);

  for (const m of objectPropMatches) {
    const value = m[1];

    if (value?.includes('.')) {
      continue;
    }

    html = isNil(value)
      ? html
      : html.replace(
        m[0],
        `<span class="${classes.objectProperty}">${value}</span>`
      );
  }

  return html;
}

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

    html = parseVariables(html, /&lt;%variables.(.*?)%&gt;/g, getVariableByName, classes);
    html = parseVariables(html, /<%variables.(.*?)%>/g, getVariableByName, classes);

    html = parseTemplates(html, /&lt;%templates.(.*?)%&gt;/g, getTemplateByName, classes);
    html = parseTemplates(html, /<%templates.(.*?)%>/g, getTemplateByName, classes);

    html = parseObjectProperty(html, /<%(.*?)%>/g, classes);

    return html;
  }, [classes, getTemplateByName, getVariableByName, htmlContent]);


  return textContent;
};
