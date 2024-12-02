import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import FlakyIcon from '@mui/icons-material/Flaky';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DataArrayIcon from '@mui/icons-material/DataArray';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BotVariable, VariableType } from '@kickoffbot.com/types';
import AbcIcon from '@mui/icons-material/Abc';
import React from 'react'

export const getVariableIcon = (variable: BotVariable) => {
    let iconTitle = '';
    let icon = <AbcIcon />

    switch (variable.type) {
        case VariableType.STRING: {
            icon = <TextFieldsIcon />;
            iconTitle = 'string';
            break;
        }
        case VariableType.NUMBER: {
            icon = <NumbersIcon />;
            iconTitle = 'number';
            break;
        }
        case VariableType.BOOLEAN: {
            icon = <FlakyIcon />;
            iconTitle = 'boolean';
            break;
        }
        case VariableType.OBJECT: {
            icon = <DataObjectIcon />;
            iconTitle = 'object';
            break;
        }
        case VariableType.ARRAY: {
            icon = <DataArrayIcon />;

            iconTitle = 'array of ' + (variable.arrayItemType?.replace('_', '+') ?? '???');
            break;
        }
        case VariableType.DATE_TIME: {
            icon = <AccessTimeIcon />;
            iconTitle = 'date+time';
            break;
        }
    }

    return { icon, iconTitle }
}