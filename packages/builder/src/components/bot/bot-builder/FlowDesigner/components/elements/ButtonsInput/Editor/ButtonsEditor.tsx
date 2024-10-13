
import { ButtonElement, ButtonsSourceStrategy, InputButtonsUIElement, MessageButtonsDescription, VariableButtonsSourceStrategyDescription } from '@kickoffbot.com/types';
import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useCallback } from 'react'
import { ManualStrategyButtonsEditor } from './ManualStrategyButtonsEditor';
import { FromVariableStrategyButtonsEditor } from './FromVariableStrategyButtonsEditor';

interface Props {
    element: InputButtonsUIElement | MessageButtonsDescription;
}

export const ButtonsEditor = ({ element }: Props) => {
    const [buttonsSourceStrategy, setButtonsSourceStrategy] = React.useState<ButtonsSourceStrategy>(element.strategy);
    const [staticButtons, setStaticButtons] = React.useState<ButtonElement[]>(element.buttons ?? []);

    const handleStrategyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setButtonsSourceStrategy(event.target.value as ButtonsSourceStrategy);
        element.strategy = event.target.value as ButtonsSourceStrategy;
    };

    const handleValueChange = useCallback((newValue: VariableButtonsSourceStrategyDescription) => {
        element.variableButtonsSource = newValue;
    }, [element]);

    const handleButtonsChange = useCallback((buttons: ButtonElement[]) => {
        element.buttons = buttons;
        setStaticButtons(buttons);
    }, [element]);

    return (<Box>
        <RadioGroup sx={{ flex: 1 }} value={buttonsSourceStrategy} onChange={handleStrategyChange}>
            <FormControlLabel value={ButtonsSourceStrategy.Manual} control={<Radio />} label="Static buttons" />
            <FormControlLabel value={ButtonsSourceStrategy.FromVariable} control={<Radio />} label="Dynamic buttons" />
        </RadioGroup>
        {buttonsSourceStrategy === ButtonsSourceStrategy.Manual && <ManualStrategyButtonsEditor buttons={staticButtons} onButtonsChange={handleButtonsChange} />}
        {buttonsSourceStrategy === ButtonsSourceStrategy.FromVariable && <FromVariableStrategyButtonsEditor value={element.variableButtonsSource} onValueChange={handleValueChange} />}
    </Box>)
}
