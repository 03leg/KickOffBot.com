import { Box } from '@mui/material';
import React from 'react'
import { makeStyles } from 'tss-react/mui';
import { type ContentTextUIElement, type UIElement } from '~/components/bot/bot-builder/types';

interface Props {
    element: UIElement;
}

export const useStyles = makeStyles()(() => ({
    root: {
        '& p': {
            margin: 0
        }
    },
}));


export const TextContent = ({ element }: Props) => {
    const contentTextElement = element as ContentTextUIElement;
    const { classes } = useStyles();

    return (
        <Box className={classes.root}>
            <div dangerouslySetInnerHTML={{ __html: contentTextElement.htmlContent ?? 'Text...' }}></div>
        </Box>
    )
}
