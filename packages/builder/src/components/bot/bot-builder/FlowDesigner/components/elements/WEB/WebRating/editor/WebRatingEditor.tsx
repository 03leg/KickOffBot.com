import { BotVariable, VariableType, WebRatingUIElement, WebRatingView } from '@kickoffbot.com/types';
import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useWebRatingEditorStyles } from './WebRatingEditor.style';
import { VariableSelector } from '../../../../VariableSelector';
import { throwIfNil } from '~/utils/guard';

interface Props {
    element: WebRatingUIElement
}

export const WebRatingEditor = ({ element }: Props) => {
    const { classes } = useWebRatingEditorStyles();
    const [elementCountValue, setElementCountValue] = useState<number>(element.elementCount);

    const [precision, setPrecision] = useState<number>(element.precision);
    const [defaultAnswer, setDefaultAnswer] = useState<number | undefined>(element.defaultAnswer);
    const [showLabels, setShowLabels] = useState<boolean>(element.showLabels);
    const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');
    const [eachOptionLabel, setEachOptionLabel] = useState<Record<number, string> | undefined>(element.eachOptionLabel);
    const [view, setView] = useState<WebRatingView>(element.view);


    const handleElementCountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value === '' ? 5 : Number(event.target.value);

        if (newValue > 10) {
            newValue = 10
        }
        setElementCountValue(newValue);
        element.elementCount = newValue;
    }, [element]);



    const handlePrecisionChange = useCallback((event: SelectChangeEvent) => {
        const newValue = Number(event.target.value);
        setPrecision(newValue);
        element.precision = newValue;
    }, [element]);

    const handleViewChange = useCallback((event: SelectChangeEvent) => {
        const newValue = event.target.value as WebRatingView;
        setView(newValue);
        element.view = newValue;
    }, [element]);

    const handleDefaultAnswerChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? undefined : Number(event.target.value);
        setDefaultAnswer(newValue);
        element.defaultAnswer = newValue;
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
        if (!showLabels) {
            return result;
        }

        const step = precision;

        for (let i = step; i <= elementCountValue; i = i + step) {
            const optionLabel = eachOptionLabel?.[i] ?? '';
            result.push(<>
                <Typography>Label for {i}:</Typography>
                <TextField className={classes.editor} placeholder={`e.g. ${i}`} fullWidth value={optionLabel} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleOptionLabelChange(i, event.target.value)} />
            </>)
        }

        return result;
    }, [classes.editor, eachOptionLabel, elementCountValue, handleOptionLabelChange, precision, showLabels]);


    return (
        <Box className={classes.root}>
            <Typography>Count of options:</Typography>
            <TextField className={classes.editor} placeholder='e.g. 5' fullWidth type="number" value={elementCountValue} onChange={handleElementCountChange} />
            <Typography>Default answer:</Typography>
            <TextField className={classes.editor} fullWidth type="number" placeholder='e.g. 3' value={defaultAnswer} onChange={handleDefaultAnswerChange} />
            <FormControlLabel control={<Checkbox checked={showLabels} onChange={handleShowLabelsChange} />} label="Show labels for each option" />

            <FormControl fullWidth className={classes.selector} >
                <InputLabel>Precision</InputLabel>
                <Select
                    value={precision.toString()}
                    label='Precision'
                    onChange={handlePrecisionChange}
                >
                    (<MenuItem key={0.5} value={0.5}>0.5</MenuItem>)
                    (<MenuItem key={1} value={1}>1</MenuItem>)
                </Select>
            </FormControl>

            <FormControl fullWidth className={classes.selector} >
                <InputLabel>View</InputLabel>
                <Select
                    value={view}
                    label='View'
                    onChange={handleViewChange}
                >
                    (<MenuItem key={WebRatingView.Star} value={WebRatingView.Star}>Star</MenuItem>)
                    (<MenuItem key={WebRatingView.Heart} value={WebRatingView.Heart}>Heart</MenuItem>)
                    (<MenuItem key={WebRatingView.Smile} value={WebRatingView.Smile}>Smile</MenuItem>)
                </Select>
            </FormControl>

            <Box className={classes.eachOptionLabels}>
                {eachOptionLabels}
            </Box>



            <Typography sx={{ marginTop: 1 }}>Select variable to save user input:</Typography>
            <Box sx={{ marginTop: 1 }}>
                <VariableSelector valueId={selectedVariableId} variableTypes={[VariableType.NUMBER, VariableType.STRING]} onVariableChange={handleVariableChange} />
            </Box>
        </Box>
    )
}
