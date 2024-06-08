import { DataSpreedSheetOperation, GoogleSheetsIntegrationUIElement } from '@kickoffbot.com/types';
import { Box, Divider, Typography } from '@mui/material';
import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { useVariableInTextStyles } from '../ChangeVariable/useContentWithVariable';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';

interface Props {
    element: GoogleSheetsIntegrationUIElement;
}

export const IntegrationGoogleSheets = ({ element }: Props) => {
    const isNotConfigured = isNil(element.connectionId) || isNil(element.selectedSpreadSheet?.id) || isNil(element.selectedSheet?.id) || isNil(element.dataOperation) || isNil(element.dataOperationDescription);
    const { classes: variableClasses } = useVariableInTextStyles();
    const { getVariableById } = useFlowDesignerStore((state) => ({
        getVariableById: state.getVariableById
    }));


    const variable = useMemo(() => {
        const variableId = element.dataOperationDescription?.variableId;
        if (!variableId) {
            return null;
        }
        return getVariableById(variableId);
    }, [element.dataOperationDescription?.variableId, getVariableById]);

    return (
        <>
            {isNotConfigured && <div>Configure &apos;Google spreadsheets&apos;...</div>}
            {!isNotConfigured &&
                <Box>
                    <Typography>
                        {element.dataOperation === DataSpreedSheetOperation.INSERT_ROWS_FROM_VARIABLE && <>Insert rows from variable <span className={variableClasses.variable}>{variable?.name}</span></>}
                        {element.dataOperation === DataSpreedSheetOperation.READ_ROWS_TO_ARRAY && <>Read rows to variable <span className={variableClasses.variable}>{variable?.name}</span></>}
                        {element.dataOperation === DataSpreedSheetOperation.UPDATE_ROWS_FROM_OBJECT_VARIABLE && <>Update row(s) from variable <span className={variableClasses.variable}>{variable?.name}</span></>}
                    </Typography>
                    <Divider sx={{ marginTop: 2, marginBottom: 1 }} />

                    <Typography variant='h6'>Spreadsheet: {element.selectedSpreadSheet?.name}</Typography>
                    <Typography variant='h6'>Sheet: {element.selectedSheet?.title}</Typography>
                </Box>
            }
        </>
    )
}
