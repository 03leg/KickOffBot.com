import { SendTelegramMessageIntegrationUIElement } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';

interface Props {
    element: SendTelegramMessageIntegrationUIElement;
}


const useStyles = makeStyles()(() => ({
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
    },
    template: {
        backgroundColor: '#4CAF50',
        borderRadius: '5px',
        color: 'white',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingBottom: '1px',
        paddingTop: '1px',
    }
}));


export const IntegrationSendTelegramMessage = ({ element }: Props) => {
    const { classes } = useStyles();
    const { connections } = useFlowDesignerStore((state) => ({
        connections: (state.project.connections ?? [])
    }));

    const connection = useMemo(() => {
        return connections.find((c) => c.id === element.connectionId);
    }, [connections, element.connectionId]);

    const textContent = useMemo(() => {
        let html = element.htmlContent;
        if (isNil(html)) {
            return html;
        }

        const variableMatches = html.matchAll(/&lt;%variables.(.*?)%&gt;/g);

        for (const m of variableMatches) {
            const value = m[1];
            html = isNil(value) ? html : html.replace(m[0], `<span class="${classes.variable}">${value}</span>`);
        }

        const templateMatches = html.matchAll(/&lt;%templates.(.*?)%&gt;/g);

        for (const m of templateMatches) {
            const value = m[1];
            html = isNil(value) ? html : html.replace(m[0], `<span class="${classes.template}">${value}</span>`);
        }

        return html;
    }, [classes.template, classes.variable, element.htmlContent]);

    return (
        <>
            {isNil(connection) && <div>Configure &quot;Send message to telegram channel or group&quot;...</div>}
            {!isNil(connection) && <Box>
                Send message to telegram channel or group using &quot;{connection.name}&quot; connection
                <Box className={classes.root}>
                    <Typography fontWeight={'bold'} sx={{ mt: 2 }}>Message:</Typography>
                    <div dangerouslySetInnerHTML={{ __html: textContent ?? 'Text...' }}></div>
                </Box>
            </Box>}
        </>
    )
}
