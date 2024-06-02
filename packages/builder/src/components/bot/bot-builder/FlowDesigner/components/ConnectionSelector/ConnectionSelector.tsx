import { ConnectionDescription, ConnectionType } from '@kickoffbot.com/types';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react'
import { useFlowDesignerStore } from '../../../store';
import { ConnectionEditor } from './Editor/ConnectionEditor';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FiberNewIcon from '@mui/icons-material/FiberNew';


interface Props {
    connectionType: ConnectionType;
    connectionId?: ConnectionDescription["id"];
    onConnectionIdChange: (connectionId?: ConnectionDescription["id"]) => void;
}

export const ConnectionSelector = ({ connectionType, connectionId, onConnectionIdChange }: Props) => {
    const [showNewConnectionEditor, setShowNewConnectionEditor] = useState(false);
    const [showEditConnectionEditor, setShowEditConnectionEditor] = useState(false);
    const { connections, removeConnectionById } = useFlowDesignerStore((state) => ({
        connections: (state.project.connections ?? []).filter(c => c.type === connectionType),
        removeConnectionById: state.removeConnectionById
    }));
    // const confirm = useConfirm();

    const handleConnectionChange = useCallback((event: SelectChangeEvent<string>) => {
        onConnectionIdChange(event.target.value);
    }, [onConnectionIdChange]);

    const handleRemoveConnection = useCallback(() => {
        // void confirm({ description: "This will permanently delete the connection.", title: 'Are you sure?' })
        //     .then(() => {
        removeConnectionById(connectionId!);
        onConnectionIdChange(undefined);
        // });
    }, [connectionId, onConnectionIdChange, removeConnectionById]);

    const handleEditConnection = useCallback(() => {
        setShowEditConnectionEditor(true);
    }, []);

    const handleNewConnection = useCallback(() => {
        setShowNewConnectionEditor(true);
    }, []);



    return (
        <Box sx={{ padding: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {connections.length === 0 &&
                    <Typography textAlign={'center'}>
                        You project doesn&lsquo;t have connections yet.<br />
                        <Button sx={{ marginTop: 1 }} size='small' variant="contained" onClick={() => { setShowNewConnectionEditor(true) }}>Create connection</Button>
                    </Typography>
                }
                {connections.length > 0 &&
                    <>
                        <FormControl sx={{ flex: 1 }}>
                            <InputLabel id="variable-selector-label">Connection</InputLabel>
                            <Select
                                labelId="variable-selector-label"
                                value={connectionId ?? ''}
                                label='Connection'
                                onChange={handleConnectionChange}
                            >
                                {connections.map(c =>
                                    (<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)
                                )}
                            </Select>
                        </FormControl>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton sx={{ ml: 1 }} size='small' aria-label="edit" disabled={!connectionId} onClick={handleEditConnection}>
                                <EditIcon />
                            </IconButton>
                            <IconButton sx={{ ml: 1 }} size='small' aria-label="new" onClick={handleNewConnection}>
                                <FiberNewIcon />
                            </IconButton>
                            <IconButton sx={{ ml: 1 }} size='small' aria-label="delete" disabled={!connectionId} onClick={handleRemoveConnection}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </>
                }

                {showNewConnectionEditor && <ConnectionEditor connectionType={connectionType} show={showNewConnectionEditor} onClose={() => { setShowNewConnectionEditor(false) }} />}
                {showEditConnectionEditor && connectionId && <ConnectionEditor connectionId={connectionId} connectionType={connectionType} show={showEditConnectionEditor} onClose={() => { setShowEditConnectionEditor(false) }} />}
            </Box>
        </Box>
    )
}
