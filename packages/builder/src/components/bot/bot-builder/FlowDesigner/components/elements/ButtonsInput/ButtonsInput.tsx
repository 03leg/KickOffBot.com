import { Box, Button } from '@mui/material';
import React from 'react'
import { type InputButtonsUIElement, type UIElement } from '@kickoffbot.com/types';
import { OutputPort } from '../../OutputPort';

interface Props {
    element: UIElement;
}

import { makeStyles } from "tss-react/mui";
import { isNil } from 'lodash';

export const useStyles = makeStyles()(() => ({
    port: {
        position: 'absolute',
        top: 8,
        right: -26
    },
    button: {
        position: 'relative'
    },
    variable: {
        backgroundColor: '#FF5722',
        borderRadius: '5px',
        color: 'white',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingBottom: '1px',
        paddingTop: '1px',
    }
}));


export const ButtonsInput = ({ element }: Props) => {
    const uiElement = element as InputButtonsUIElement;
    const { classes } = useStyles();

    return (
        <div>
            {uiElement.buttons.map(b => {
                const matches = b.content.matchAll(/<%variables.(.*?)%>/g);
                let buttonContent = b.content;

                for (const m of matches) {
                    const value = m[1];
                    buttonContent = isNil(value) ? buttonContent : buttonContent.replace(m[0], `<span class="${classes.variable}">${value}</span>`);
                }

                return (
                    <Box key={b.id} className={classes.button}>
                        <OutputPort className={classes.port} elementId={uiElement.id} buttonId={b.id} />
                        <Button sx={{ marginBottom: 1 }} variant="contained" size='small' fullWidth disabled>
                            <div dangerouslySetInnerHTML={{ __html: buttonContent }}></div>
                        </Button>
                    </Box>
                )
            })}
            <Box className={classes.button}>
                <OutputPort className={classes.port} elementId={uiElement.id} buttonId={`default-button-${uiElement.id}`} />
                <Button variant="contained" size='small' fullWidth disabled>Default</Button>
            </Box>
        </div>
    )
}
