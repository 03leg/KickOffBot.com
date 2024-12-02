import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useFlowDesignerStore } from '../store';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditVariableButton } from './EditVariableButton';
import { type BotVariable } from '@kickoffbot.com/types';
import { useConfirm } from 'material-ui-confirm';
import { getVariableIcon } from '~/utils/getVariableIcon';


export const VariableViewers = () => {
    const { variables, removeVariable } = useFlowDesignerStore((state) => ({
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

    const getVariableListItemIcon = useCallback((variable: BotVariable) => {
        const { icon, iconTitle } = getVariableIcon(variable);

        return <ListItemIcon title={iconTitle} sx={{ minWidth: '36px' }}>
            {icon}
        </ListItemIcon>;
    }, []);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',

        }}>
            {variables.length === 0 && <Typography textAlign='center' sx={{ padding: 1 }}>Bot does not have variables.</Typography>}



            {variables.length > 0 &&
                <List dense={true} sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {variables.map(v =>
                    (
                        <ListItem key={v.id}>
                            {getVariableListItemIcon(v)}
                            <ListItemText
                                primaryTypographyProps={{
                                    variant: 'subtitle2',
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }}
                                title={v.name}
                                primary={v.name}
                            />
                            <Box sx={{ display: 'flex' }}>
                                <EditVariableButton variable={v} />

                                {!v.isPlatformVariable && <IconButton title='Delete' sx={{ padding: 0.5 }} edge="end" onClick={() => handleRemoveVariable(v)}>
                                    <DeleteIcon />
                                </IconButton>}
                            </Box>
                        </ListItem>
                    ))}

                </List>
            }

            <EditVariableButton />

        </Box>
    )
}
