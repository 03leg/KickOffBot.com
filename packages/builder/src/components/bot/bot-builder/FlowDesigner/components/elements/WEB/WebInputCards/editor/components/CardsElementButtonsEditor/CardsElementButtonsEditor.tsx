import { ButtonElement, DynamicSourceDescription, VariableType, WebCardsSourceStrategy, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material'
import React, { useCallback, useMemo } from 'react';
import { ManualStrategyButtonsEditor } from '../../../../../ButtonsInput/Editor/ManualStrategyButtonsEditor';
import { isNil } from 'lodash';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';

interface Props {
    element: WebInputCardsUIElement;
    property: "cardButtons" | "generalButtons";
}

export const CardsElementButtonsEditor = ({ element, property }: Props) => {
    const [buttons, setButtons] = React.useState(element[property] ?? []);
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));


    const handleButtonsChange = useCallback((buttons: ButtonElement[]) => {
        element[property] = buttons;
        setButtons(buttons);
    }, [element, property]);

    const contextObjectProperties = useMemo(() => {
        if (isNil(element.sourceDescription) || element.strategy === WebCardsSourceStrategy.Static) {
            return undefined;
        }

        const dynamicDataSourceDescription = (element.sourceDescription as DynamicSourceDescription);

        if (isNil(dynamicDataSourceDescription.cardsVariableId)) {
            return;
        }

        const variable = getVariableById(dynamicDataSourceDescription.cardsVariableId);

        if (isNil(variable) || variable.type !== VariableType.ARRAY) {
            return undefined;
        }

        const result = ["index"];

        if (variable.arrayItemType === VariableType.OBJECT) {
            const values = JSON.parse(variable.value as string);
            const firstValue = values[0];

            result.push(...Object.keys(firstValue));
        } else {
            result.push("value");
        }

        return result;

    }, [element.sourceDescription, element.strategy, getVariableById]);

    return (
        <Box data-testid="CardsElementButtonsEditor">
            <ManualStrategyButtonsEditor buttons={buttons} onButtonsChange={handleButtonsChange} contextObjectProperties={contextObjectProperties}/>
        </Box>
    )
}
