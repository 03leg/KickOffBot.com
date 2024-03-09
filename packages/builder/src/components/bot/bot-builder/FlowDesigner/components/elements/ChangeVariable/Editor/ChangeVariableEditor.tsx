import { BotVariable, ChangeArrayVariableWorkflow, ChangeBooleanVariableWorkflow, ChangeNumberStringVariableWorkflow, ChangeObjectVariableWorkflow, ChangeVariableUIElement, VariableType } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react'
import { VariableSelector } from '../../../VariableSelector';
import { NumberStringTypeVariableEditor } from './NumberStringTypeVariableEditor';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { BooleanTypeVariableEditor } from './BooleanTypeVariableEditor';
import { ObjectTypeVariableEditor } from './ObjectTypeVariableEditor';
import { ArrayTypeVariableEditor } from './ArrayTypeVariableEditor';

interface Props {
    element: ChangeVariableUIElement;
}

export const ChangeVariableEditor = ({ element }: Props) => {
    const [selectedVariableId, setSelectedVariableId] = useState<BotVariable["id"]>(element?.selectedVariableId ?? '');
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));

    const variableType = useMemo(() => {
        return getVariableById(selectedVariableId)?.type ?? null;
    }, [getVariableById, selectedVariableId]);

    const handleVariableChange = useCallback((variable: BotVariable) => {
        setSelectedVariableId(variable.id);
        element.selectedVariableId = variable.id;

        switch (variable.type) {
            case VariableType.NUMBER: {
                element.workflowDescription = { expression: '0' }
                break
            }
            case VariableType.STRING: {
                element.workflowDescription = { expression: "Hi, I'm new value!" };
                break;
            }
        }
    }, [element]);

    const arrayItemType = useMemo(() => {
        return getVariableById(selectedVariableId)?.arrayItemType ?? null;
    }, [getVariableById, selectedVariableId]);

    const firstItemOfArray = useMemo(() => {
        const variable = getVariableById(selectedVariableId);
        if (variable?.type !== VariableType.ARRAY) {
            return null;
        }

        const arrayValue = JSON.parse(variable.value as string);
        if (arrayValue instanceof Array && arrayValue.length > 0) {
            return arrayValue[0] as unknown;
        }

        return null;
    }, [getVariableById, selectedVariableId]);



    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    const handleWorkflowChange = useCallback((workflow: ChangeNumberStringVariableWorkflow | ChangeBooleanVariableWorkflow | ChangeObjectVariableWorkflow | ChangeArrayVariableWorkflow) => {
        element.workflowDescription = workflow;
    }, [element]);

    return (
        <Box sx={{ padding: 1 }}>
            <VariableSelector valueId={selectedVariableId} onVariableChange={handleVariableChange} />

            {(variableType !== null && (variableType === VariableType.NUMBER || variableType === VariableType.STRING) &&
                <NumberStringTypeVariableEditor workflow={element.workflowDescription as ChangeNumberStringVariableWorkflow} onWorkflowChange={handleWorkflowChange} />
            )}
            {(variableType !== null && (variableType === VariableType.BOOLEAN) &&
                <BooleanTypeVariableEditor workflow={element.workflowDescription as ChangeBooleanVariableWorkflow} onWorkflowChange={handleWorkflowChange} />
            )}
            {(variableType !== null && (variableType === VariableType.OBJECT) &&
                <ObjectTypeVariableEditor workflow={element.workflowDescription as ChangeObjectVariableWorkflow} onWorkflowChange={handleWorkflowChange} />
            )}
            {(variableType !== null && (variableType === VariableType.ARRAY) && arrayItemType &&
                <ArrayTypeVariableEditor jsonTypeOfArrayItem={arrayItemType} firstItemOfArray={firstItemOfArray} workflow={element.workflowDescription as ChangeArrayVariableWorkflow} onWorkflowChange={handleWorkflowChange} />
            )}

        </Box>
    )
}