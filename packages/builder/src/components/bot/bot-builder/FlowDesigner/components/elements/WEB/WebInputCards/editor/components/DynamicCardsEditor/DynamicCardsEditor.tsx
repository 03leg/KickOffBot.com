import { BotVariable, DynamicSourceDescription, VariableType, WebInputCardsUIElement } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import { isNil } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { VariableSelector } from '~/components/bot/bot-builder/FlowDesigner/components/VariableSelector';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { AppTextField } from '~/components/commons/AppTextField';
import { WebTextEditor } from '~/components/commons/WebTextEditor';
import { throwIfNil } from '~/utils/guard';

interface Props {
    element: WebInputCardsUIElement;
}

export const DynamicCardsEditor = ({ element }: Props) => {
    const dynamicDataSourceDescription = (element.sourceDescription as DynamicSourceDescription);
    const [dataSourceVariableId, setDataSourceVariableId] = React.useState<string>(dynamicDataSourceDescription.cardsVariableId ?? '');
    const [cardValue, setCardValue] = React.useState<string>(dynamicDataSourceDescription.cardDescription?.value ?? '');
    const [cardImageUrl, setCardImageUrl] = React.useState<string>(dynamicDataSourceDescription.cardDescription?.imgUrl ?? '');

    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const handleDataSourceVariableChange = useCallback((newVariable?: BotVariable) => {
        throwIfNil(newVariable);
        setDataSourceVariableId(newVariable.id);
        dynamicDataSourceDescription.cardsVariableId = newVariable.id;
    }, [dynamicDataSourceDescription]);

    const handleCardValueChange = useCallback((newValue: string) => {
        throwIfNil(dynamicDataSourceDescription.cardDescription);

        setCardValue(newValue);
        dynamicDataSourceDescription.cardDescription.value = newValue;
    }, [dynamicDataSourceDescription]);

    const handleCardImgChange = useCallback((newValue: string) => {
        throwIfNil(dynamicDataSourceDescription.cardDescription);

        setCardImageUrl(newValue);
        dynamicDataSourceDescription.cardDescription.imgUrl = newValue;
    }, [dynamicDataSourceDescription]);

    const variable = useMemo(() => {
        if (!dataSourceVariableId) {
            return null;
        }
        return getVariableById(dataSourceVariableId);
    }, [dataSourceVariableId, getVariableById]);

    const handleDescriptionChange = useCallback((jsonState: string, htmlContent: string) => {
        throwIfNil(dynamicDataSourceDescription.cardDescription);

        dynamicDataSourceDescription.cardDescription.htmlDescription = htmlContent;
        dynamicDataSourceDescription.cardDescription.jsonDescription = jsonState;

    }, [dynamicDataSourceDescription.cardDescription]);

    const contextObjectProperties = useMemo(() => {
        if (isNil(dataSourceVariableId)) {
            return undefined;
        }
        const variable = getVariableById(dataSourceVariableId);

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

    }, [dataSourceVariableId, getVariableById]);

    return (
        <Box>
            <Typography sx={{ marginBottom: 1 }}>
                Select data source of cards:
            </Typography>
            <VariableSelector valueId={dataSourceVariableId} variableTypes={[VariableType.ARRAY]} onVariableChange={handleDataSourceVariableChange} />

            {variable !== null &&
                <Box sx={{ marginTop: 2 }}>
                    <AppTextField label="Card value" value={cardValue} onValueChange={handleCardValueChange} contextObjectProperties={contextObjectProperties} />
                    <Box sx={{ marginTop: 2 }}>
                        <AppTextField label="Image URL" value={cardImageUrl} onValueChange={handleCardImgChange} contextObjectProperties={contextObjectProperties} />
                    </Box>
                    <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
                        Card description:
                    </Typography>
                    <WebTextEditor
                        contextObjectProperties={contextObjectProperties}
                        jsonState={dynamicDataSourceDescription.cardDescription?.jsonDescription}
                        onContentChange={handleDescriptionChange} />
                </Box>
            }
        </Box>
    )
}
