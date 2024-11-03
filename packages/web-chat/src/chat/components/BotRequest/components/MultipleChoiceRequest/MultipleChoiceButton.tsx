import { Button } from '@mui/material'
import React from 'react';
import { useMultipleChoiceButtonStyles } from './MultipleChoiceButton.style';
import { CheckBox } from '@mui/icons-material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface Props {
    value: string;
    isChecked: boolean;
    onChange: (value: boolean) => void;
}

export const MultipleChoiceButton = ({ value, isChecked, onChange }: Props) => {
    const { classes } = useMultipleChoiceButtonStyles();
    return (
        <Button className={classes.root} variant='outlined' onClick={() => onChange(!isChecked)}>
            {isChecked && <CheckBox />}
            {!isChecked && <CheckBoxOutlineBlankIcon />}
            {value}
        </Button>
    )
}
