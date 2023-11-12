import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useFlowDesignerStore } from '../store';
import { Colors } from '~/themes/Colors';
import AbcIcon from '@mui/icons-material/Abc';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditVariableButton } from './EditVariableButton';
import { type BotVariable } from '../types';
import { useConfirm } from 'material-ui-confirm';
import { v4 } from 'uuid';



export const VariableViewers = () => {
    const { showVariablesViewer, variables, removeVariable } = useFlowDesignerStore((state) => ({
        showVariablesViewer: state.showVariablesViewer,
        variables: state.project.variables,
        removeVariable: state.removeVariable
    }));
    const confirm = useConfirm();


    const handleRemoveVariable = useCallback((variable: BotVariable) => {
        void confirm({ description: "This will permanently delete the variable.", title: 'Are you sure?' })
            .then(() => {
                removeVariable(variable);
            }).catch();
    }, [confirm, removeVariable]);

    if (!showVariablesViewer) {
        return null;
    }



    return (
        <Box sx={{
            width: '300px', height: 'fit-content', minWidth: 300,
            backgroundColor: Colors.WHITE,
            boxShadow: '0px 1px 6px hsla(245, 50%, 17%, 0.1)',
            marginLeft: ({ spacing }) => spacing(2),
            display: 'flex',
            flexDirection: 'column',

        }}>
            <Typography variant="h6" component="div" sx={{ margin: 1 }}>
                Variables
                <EditVariableButton />
            </Typography>

            <List dense={true} sx={{ maxHeight: '400px', overflow: 'auto' }}>
                {variables.map(v =>
                (
                    <ListItem key={v.id}>
                        <ListItemIcon>
                            <AbcIcon />
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{
                                variant: 'subtitle2',
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }}
                            primary={v.name}
                        />
                        <Box sx={{ display: 'flex' }}>
                            <EditVariableButton variable={v} />

                            <IconButton sx={{ marginLeft: 2 }} edge="end" aria-label="delete" onClick={() => handleRemoveVariable(v)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </ListItem>
                ))}

            </List>

        </Box>
    )
}
