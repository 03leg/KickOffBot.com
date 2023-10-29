import { Box, Button } from '@mui/material';
import React from 'react'
import { type InputButtonsUIElement, type UIElement } from '~/components/bot/bot-builder/types';
import { OutputPort } from '../../OutputPort';

interface Props {
    element: UIElement;
}

import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(() => ({
    port: {
        position: 'absolute',
        top: 8,
        right: -26
    },
    button: {
        position: 'relative'
    }
}));


export const ButtonsInput = ({ element }: Props) => {
    const uiElement = element as InputButtonsUIElement;
    const { classes } = useStyles();

    return (
        <div>
            {uiElement.buttons.map(b => (
                <Box key={b.id} className={classes.button}>
                    <OutputPort className={classes.port} elementId={uiElement.id} buttonId={b.id} />
                    <Button sx={{ marginBottom: 1 }} variant="contained" size='small' fullWidth disabled>{b.content}</Button>
                </Box>
            ))}
            <Box className={classes.button}>
                <OutputPort className={classes.port} elementId={uiElement.id} buttonId={'default-button'} />
                <Button variant="contained" size='small' fullWidth disabled>Default</Button>
            </Box>
        </div>
    )
}
