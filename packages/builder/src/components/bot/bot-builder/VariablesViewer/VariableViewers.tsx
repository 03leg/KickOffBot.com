import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useFlowDesignerStore } from '../store';
import AbcIcon from '@mui/icons-material/Abc';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditVariableButton } from './EditVariableButton';
import { VariableType, type BotVariable } from '@kickoffbot.com/types';
import { useConfirm } from 'material-ui-confirm';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import FlakyIcon from '@mui/icons-material/Flaky';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DataArrayIcon from '@mui/icons-material/DataArray';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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

    const getVariableIcon = useCallback((variable: BotVariable) => {
        let iconTitle = '';
        let icon = <AbcIcon />

        switch (variable.type) {
            case VariableType.STRING: {
                icon = <TextFieldsIcon />;
                iconTitle = 'string';
                break;
            }
            case VariableType.NUMBER: {
                icon = <NumbersIcon />;
                iconTitle = 'number';
                break;
            }
            case VariableType.BOOLEAN: {
                icon = <FlakyIcon />;
                iconTitle = 'boolean';
                break;
            }
            case VariableType.OBJECT: {
                icon = <DataObjectIcon />;
                iconTitle = 'object';
                break;
            }
            case VariableType.ARRAY: {
                icon = <DataArrayIcon />;

                iconTitle = 'array of ' + (variable.arrayItemType?.replace('_', '+') ?? '???');
                break;
            }
            case VariableType.DATE_TIME: {
                icon = <AccessTimeIcon />;
                iconTitle = 'date+time';
                break;
            }
        }

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
                            {getVariableIcon(v)}
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

                                {!v.isPlatformVariable && <IconButton title='Delete' sx={{ marginLeft: 2, padding: 0.5 }} edge="end" aria-label="delete" onClick={() => handleRemoveVariable(v)}>
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
