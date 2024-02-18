import { ConditionUIElement, PortType, UIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react'
import { ConditionViewItem } from './ConditionViewItem';
import { isNil } from 'lodash';
import { OutputPort } from '../../OutputPort';
import { makeStyles } from 'tss-react/mui';
interface Props {
    element: UIElement;
}

export const useStyles = makeStyles()(() => ({
    root: {
        position: 'relative'
    },
    port: {
        position: 'absolute',
        top: -15,
        right: -26
    },
}));

export const Condition = ({ element }: Props) => {
    const uiElement = element as ConditionUIElement;
    const { classes } = useStyles();

    return (
        <Box className={classes.root}>
            {!isNil(uiElement.items) && uiElement.items.map((ci, index) => <ConditionViewItem key={ci.id} item={ci}
                nextItemLogicalOperator={uiElement.logicalOperator}
                showLogicalOperatorSelector={index !== uiElement.items.length - 1} />)}
            {(isNil(uiElement.items) || uiElement.items.length === 0) && <Box>Configure...</Box>}

            {(!isNil(uiElement.items) && uiElement.items.length > 0) && <OutputPort className={classes.port} elementId={uiElement.id} buttonId={`${uiElement.id}`} outPortType={PortType.BUTTONS_ELEMENT} />}
        </Box>
    )
}
