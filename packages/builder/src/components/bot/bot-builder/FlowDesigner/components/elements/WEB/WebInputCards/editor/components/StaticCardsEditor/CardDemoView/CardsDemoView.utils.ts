import { isPlainObject } from "lodash";

export function getTextForContextObject(
    contextObject: unknown,
    template: string,
    index: number,
  ): string {
    const getParsedTemplate = (
      textArgument: string,
      matches1: IterableIterator<RegExpExecArray | RegExpMatchArray>,
    ) => {
      for (const m of matches1) {
        const property = m[1]!;
        let content = '';

        if (property === 'index') {
          content = (index + 1).toString();
        } else if (isPlainObject(contextObject)) {
          content = (contextObject as Record<string, string>)[property] ?? '';
        } else if (
          (m[0] === '<%value%>' || m[0] === '&lt;%value%&gt;') &&
          ['string', 'number', 'boolean'].includes(typeof contextObject)
        ) {
          content = contextObject as string;
        }

        textArgument = textArgument.replace(m[0], content);
      }

      return textArgument;
    };

    let result = getParsedTemplate(template, template.matchAll(/<%(.*?)%>/g));
    result = getParsedTemplate(result, result.matchAll(/&lt;%(.*?)%&gt;/g));

    return result;
  }