import { Box } from '@mui/material';
import { isNil } from 'lodash';
import React, { useMemo } from 'react'
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


export const TextContent = ({ element }: Props) => {
    const contentTextElement = element as ContentTextUIElement;
    const { classes } = useStyles();

    const textContent = useMemo(() => {
        let html = contentTextElement.htmlContent;
        if (isNil(html)) {
            return html;
        }

        const matches = html.matchAll(/&lt;%variables.(.*?)%&gt;/g);

        for (const m of matches) {
            const value = m[1];
            html = isNil(value) ? html : html.replace(m[0], `<span class="${classes.variable}">${value}</span>`);
        }

        return html;
    }, [classes.variable, contentTextElement.htmlContent]);

    return (
        <Box className={classes.root}>
            <div dangerouslySetInnerHTML={{ __html: textContent ?? 'Text...' }}></div>
        </Box>
    )
}
