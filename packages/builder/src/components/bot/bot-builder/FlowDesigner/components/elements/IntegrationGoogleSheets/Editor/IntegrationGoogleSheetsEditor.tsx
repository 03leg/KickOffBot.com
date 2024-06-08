import { ConnectionType, DataSpreedSheetOperation, GoogleSheetsConnectionDescription, GoogleSheetsIntegrationUIElement, SelectedGoogleSpreadSheet, SheetDescription } from '@kickoffbot.com/types';
import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { ConnectionSelector } from '../../../ConnectionSelector';
import SyncIcon from '@mui/icons-material/Sync';
import { api } from '~/utils/api';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { isNil } from 'lodash';
import { env } from '~/env.mjs';
import { ReadRowsToArrayEditor } from './ReadRowsToArrayEditor';
import { LoadingIndicator } from '~/components/commons/LoadingIndicator';
import { InsertRowsFromVariableEditor } from './InsertRowsFromVariableEditor';
import { UpdateRowsFromVariableEditor } from './UpdateRowsFromVariableEditor';

interface Props {
    element: GoogleSheetsIntegrationUIElement;
}

export const IntegrationGoogleSheetsEditor = ({ element }: Props) => {
    const { data: sessionData } = useSession();
    const [connectionId, setConnectionId] = React.useState<string | undefined>(element.connectionId);
    const { data, refetch, isLoading: isAccountsLoading } = api.googleIntegration.getGoogleAccounts.useQuery();
    const { connections, addNewConnection } = useFlowDesignerStore((state) => ({
        connections: (state.project.connections ?? []).filter(c => c.type === ConnectionType.Google),
        addNewConnection: state.addNewConnection
    }));
    const { mutateAsync, isLoading: isAccountDeleting } = api.googleIntegration.deleteGoogleAccount.useMutation();
    const [selectedSpreadSheet, setSelectedSpreadSheet] = useState<SelectedGoogleSpreadSheet | undefined>(element.selectedSpreadSheet);
    const [selectedSheet, setSelectedSheet] = useState<SheetDescription | undefined>(element.selectedSheet);

    const { data: availableSheets, refetch: refetchSheets, isLoading: isSheetsLoading } = api.googleIntegration.getSheets.useQuery({
        connectionId: connectionId,
        spreadSheetId: selectedSpreadSheet?.id ?? undefined
    }, { enabled: connectionId !== undefined && selectedSpreadSheet !== undefined });

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    const [dataOperation, setDataOperation] = useState<DataSpreedSheetOperation | undefined>(element.dataOperation);

    const isViewLoading = isAccountsLoading || isAccountDeleting || isSheetsLoading;

    useEffect(() => {
        if (isNil(data)) {
            return;
        }

        for (const connection of data) {
            if (!connections.find(c => c.id === connection.id)) {
                const googleConnection: GoogleSheetsConnectionDescription = {
                    id: connection.id,
                    name: connection.email,
                    type: ConnectionType.Google,
                    accessToken: connection.accessToken,
                    email: connection.email
                };
                addNewConnection(googleConnection);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleConnectionIdChange = useCallback((connectionId?: string) => {
        element.connectionId = connectionId;
        setConnectionId(connectionId);

        element.selectedSheet = undefined;
        setSelectedSheet(undefined);

        element.selectedSpreadSheet = undefined;
        setSelectedSpreadSheet(undefined);
    }, [element]);

    const handleNewGoogleAccount = useCallback(() => {
        const newWindow = window.open(`/api/google-auth/login-url?userId=${sessionData?.user.id}`, 'name', 'height=600,width=800');
        newWindow?.focus();
    }, [sessionData?.user.id]);

    const handleSyncGoogleConnections = useCallback(() => {
        void refetch();
    }, [refetch]);

    const handleDeleteConnection = useCallback((connectionId: string) => {
        void mutateAsync({ connectionId });
    }, [mutateAsync]);

    const handleOpenPicker = useCallback(() => {
        const currentConnection = connections.find(c => c.id === connectionId) as GoogleSheetsConnectionDescription;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentSheetSelector = new (window as any).google.picker.PickerBuilder()
            .setOAuthToken(currentConnection.accessToken)
            .setDeveloperKey(env.NEXT_PUBLIC_GOOGLE_API_KEY)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .addView((window as any).google.picker.ViewId.SPREADSHEETS)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .setCallback((data1: { docs?: [{ id: string, name: string }] }) => {
                // console.log('callback', data1, data2);
                if (data1.docs !== undefined && data1.docs.length > 0) {
                    setSelectedSpreadSheet(data1.docs?.[0]);
                    element.selectedSpreadSheet = data1.docs?.[0];

                    element.selectedSheet = undefined;
                    setSelectedSheet(undefined);
                }

            }
            )
            .build()

        currentSheetSelector.setVisible(true);
    }, [connectionId, connections, element]);

    // const availableSheets = ["Sheet #1"];

    const handleSheetChange = useCallback((event: SelectChangeEvent<SheetDescription["id"]>) => {
        const sheet = availableSheets?.find(s => s.id === event.target.value);
        setSelectedSheet(sheet);
        element.selectedSheet = sheet;
    }, [availableSheets, element]);

    const handleDataOperationChange = useCallback((event: SelectChangeEvent<string>) => {
        setDataOperation(event.target.value as DataSpreedSheetOperation);
        element.dataOperation = event.target.value as DataSpreedSheetOperation;
    }, [element])

    if (isViewLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Box>
            <ConnectionSelector connectionType={ConnectionType.Google}
                canCreateConnection={false}
                canEditConnection={false}
                connectionId={connectionId}
                onDeleteConnection={handleDeleteConnection}
                onConnectionIdChange={handleConnectionIdChange} />

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" size='small' color="success" onClick={handleNewGoogleAccount}>Add new google account</Button>
                <Button sx={{ marginLeft: 1 }} variant='contained' startIcon={<SyncIcon />} size='small' onClick={handleSyncGoogleConnections}>Refresh list connections</Button>
            </Box>

            {connectionId && <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <TextField label='Spreadsheet Name' sx={{ flex: 1 }} value={selectedSpreadSheet?.name ?? ""} disabled={true} />
                <Button sx={{ marginLeft: 1 }} size='small' variant='contained' onClick={handleOpenPicker}>Select Spreadsheet</Button>
            </Box>}


            {selectedSpreadSheet && availableSheets && availableSheets.length > 0 && <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="sheet-selector-label">Sheet</InputLabel>
                <Select
                    labelId="sheet-selector-label"
                    value={selectedSheet?.id ?? ""}
                    label='Sheet'
                    onChange={handleSheetChange}
                >
                    {availableSheets.map(s =>
                        (<MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>)
                    )}
                </Select>
            </FormControl>
            }


            {selectedSheet && <Box sx={{ mt: 2 }}>
                <RadioGroup sx={{ flex: 1 }} value={dataOperation} onChange={handleDataOperationChange}>
                    <FormControlLabel value={DataSpreedSheetOperation.READ_ROWS_TO_ARRAY} control={<Radio />} label="Import rows to variable" />
                    <FormControlLabel value={DataSpreedSheetOperation.INSERT_ROWS_FROM_VARIABLE} control={<Radio />} label="Insert row or rows from variable" />
                    <FormControlLabel value={DataSpreedSheetOperation.UPDATE_ROWS_FROM_OBJECT_VARIABLE} control={<Radio />} label="Update row or rows" />
                </RadioGroup>
            </Box>
            }

            {dataOperation === DataSpreedSheetOperation.READ_ROWS_TO_ARRAY && selectedSheet &&
                <ReadRowsToArrayEditor googleSheetHeaders={selectedSheet.headerValues} element={element} />
            }

            {dataOperation === DataSpreedSheetOperation.INSERT_ROWS_FROM_VARIABLE && selectedSheet &&
                <InsertRowsFromVariableEditor googleSheetHeaders={selectedSheet.headerValues} element={element} />
            }

            {dataOperation === DataSpreedSheetOperation.UPDATE_ROWS_FROM_OBJECT_VARIABLE && selectedSheet &&
                <UpdateRowsFromVariableEditor googleSheetHeaders={selectedSheet.headerValues} element={element} />
            }

        </Box>
    )
}
