import { BotVariable, OpinionScaleShowLabelsMode, VariableType, WebOpinionScaleUIElement } from '@kickoffbot.com/types';
import React, { useCallback, useMemo, useState } from 'react'
import { useWebOpinionScaleEditorStyles } from './WebOpinionScaleEditor.style';
import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { VariableSelector } from '../../../../VariableSelector';
import { throwIfNil } from '~/utils/guard';

interface Props {
    element: WebOpinionScaleUIElement;
}


export const WebOpinionScaleEditor = ({ element }: Props) => {
    const { classes } = useWebOpinionScaleEditorStyles();
    const [maxValue, setMaxValue] = useState<number>(element.max);
    const [minValue, setMinValue] = useState<number>(element.min);
    const [minLabel, setMinLabel] = useState<string | undefined>(element.minLabel);
    const [maxLabel, setMaxLabel] = useState<string | undefined>(element.maxLabel);
    const [defaultAnswer, setDefaultAnswer] = useState<number | undefined>(element.defaultAnswer);
    const [showLabels, setShowLabels] = useState<boolean>(element.showLabels);
    const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');
    const [showLabelsMode, setShowLabelsMode] = useState<OpinionScaleShowLabelsMode>(element.showLabelsMode);
    const [eachOptionLabel, setEachOptionLabel] = useState<Record<number, string> | undefined>(element.eachOptionLabel);

    const handleMaxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? 10 : Number(event.target.value);
        setMaxValue(newValue);
        element.max = newValue;
    }, [element]);

    const handleMinChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? 1 : Number(event.target.value);


        setMinValue(newValue);
        element.min = newValue;
    }, [element]);

    const handleDefaultAnswerChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? undefined : Number(event.target.value);
        setDefaultAnswer(newValue);
        element.defaultAnswer = newValue;
    }, [element]);

    const handleMinLabelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? undefined : event.target.value;
        setMinLabel(newValue);
        element.minLabel = newValue;
    }, [element]);

    const handleMaxLabelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? undefined : event.target.value;
        setMaxLabel(newValue);
        element.maxLabel = newValue;
    }, [element]);

    const handleShowLabelsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setShowLabels(newValue);
        element.showLabels = newValue;
    }, [element]);

    const handleVariableChange = useCallback((newVariable?: BotVariable) => {
        throwIfNil(newVariable);
        setSelectedVariableId(newVariable.id);
        element.variableId = newVariable.id;
    }, [element]);

    const handleShowLabelsModeChange = useCallback((event: SelectChangeEvent) => {
        const newValue = event.target.value as OpinionScaleShowLabelsMode;
        setShowLabelsMode(newValue);
        element.showLabelsMode = newValue;
    }, [element]);

    const handleOptionLabelChange = useCallback((index: number, value: string) => {
        if (!eachOptionLabel) {
            return;
        }
        eachOptionLabel[index] = value;
        const newValue = { ...eachOptionLabel };
        setEachOptionLabel(newValue);
        element.eachOptionLabel = newValue;
    }, [eachOptionLabel, element]);

    const eachOptionLabels = useMemo(() => {
        const result: React.ReactNode[] = [];
        if (showLabelsMode !== OpinionScaleShowLabelsMode.EachOption) {
            return result;
        }

        for (let i = minValue; i <= maxValue; i++) {
            const optionLabel = eachOptionLabel?.[i] ?? '';
            result.push(<>
                <Typography>Label for {i}:</Typography>
                <TextField className={classes.editor} placeholder={`e.g. ${i}`} fullWidth value={optionLabel} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleOptionLabelChange(i, event.target.value)} />
            </>)
        }

        return result;

    }, [classes.editor, eachOptionLabel, handleOptionLabelChange, maxValue, minValue, showLabelsMode]);

    return (
        <Box className={classes.root}>
            <Typography>Min value:</Typography>
            <TextField className={classes.editor} placeholder='e.g. 1' fullWidth type="number" value={minValue} onChange={handleMinChange} />
            <Typography>Max value:</Typography>
            <TextField className={classes.editor} placeholder='e.g. 5' fullWidth type="number" value={maxValue} onChange={handleMaxChange} />
            <Typography>Default answer:</Typography>
            <TextField className={classes.editor} fullWidth type="number" placeholder='e.g. 3' value={defaultAnswer} onChange={handleDefaultAnswerChange} />

            <FormControlLabel control={<Checkbox checked={showLabels} onChange={handleShowLabelsChange} />} label="Show labels" />

            {showLabels && <>
                <FormControl fullWidth className={classes.labelsMode} >
                    <InputLabel>Labels mode</InputLabel>
                    <Select
                        value={showLabelsMode}
                        label='Labels mode'
                        onChange={handleShowLabelsModeChange}
                    >
                        (<MenuItem key={OpinionScaleShowLabelsMode.MaxAndMin} value={OpinionScaleShowLabelsMode.MaxAndMin}>Labels only for max and min</MenuItem>)
                        (<MenuItem key={OpinionScaleShowLabelsMode.EachOption} value={OpinionScaleShowLabelsMode.EachOption}>Labels for each option</MenuItem>)
                    </Select>
                </FormControl>

                {showLabelsMode === OpinionScaleShowLabelsMode.MaxAndMin && <>
                    <Typography>Min label:</Typography>
                    <TextField className={classes.editor} placeholder='e.g. not at all' fullWidth value={minLabel} onChange={handleMinLabelChange} />
                    <Typography>Max label:</Typography>
                    <TextField className={classes.editor} placeholder='e.g. very much' fullWidth value={maxLabel} onChange={handleMaxLabelChange} />
                </>}

                {showLabelsMode === OpinionScaleShowLabelsMode.EachOption &&
                    <>
                        <Box className={classes.eachOptionLabels}>
                            {eachOptionLabels}
                        </Box>
                    </>}
            </>}

            <Typography>Select variable to save user input:</Typography>
            <Box sx={{ marginTop: 1 }}>
                <VariableSelector valueId={selectedVariableId} variableTypes={[VariableType.NUMBER, VariableType.STRING]} onVariableChange={handleVariableChange} />
            </Box>
        </Box>
    )
}
