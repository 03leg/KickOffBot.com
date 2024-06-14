import { HTTPRequestIntegrationUIElement } from '@kickoffbot.com/types';
import { Box, Divider } from '@mui/material';
import React, { useMemo } from 'react';
import { useVariableInTextStyles } from '../ChangeVariable/useContentWithVariable';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';

interface Props {
    element: HTTPRequestIntegrationUIElement;
}

export const IntegrationHttpRequest = ({ element }: Props) => {
    const { classes } = useVariableInTextStyles();

    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));


    const variable = useMemo(() => {
        if (!element.responseDataVariableId) {
            return null;
        }
        return getVariableById(element.responseDataVariableId);
    }, [element.responseDataVariableId, getVariableById]);


    return (
        <>
            {!element.url && <div>Configure &quot;Send&Receive HTTP request&quot;...</div>}
            {element.url && <div>
                Send <strong>{element.httpMethod}</strong> request to:
                <Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{element.url}</Box>

                {element.customHeaders.length > 0 && <div>with custom headers</div>}
                {element.useRequestBody && <div>with request body</div>}
                {element.saveResponseData && <>
                    <Divider sx={{ marginTop: 2, marginBottom: 1 }} />
                    <div>and save response data to <span className={classes.variable}>{variable?.name}</span></div></>}
            </div>}
        </>
    )
}
