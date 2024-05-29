import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFlowDesignerStore } from '../store';
import { useConfirm } from 'material-ui-confirm';
import { BotTemplate } from '@kickoffbot.com/types';
import { EditTemplateButton } from './EditTemplateButton';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const TemplateViewers = () => {
    const { templates, removeTemplate } = useFlowDesignerStore((state) => ({
        templates: state.project.templates ?? [],
        removeTemplate: state.removeTemplate
    }));
    const confirm = useConfirm();

    const handleRemoveTemplate = useCallback((variable: BotTemplate) => {
        void confirm({ description: "This will permanently delete the template.", title: 'Are you sure?' })
            .then(() => {
                removeTemplate(variable);
            }).catch();
    }, [confirm, removeTemplate]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',

        }}>
            {templates.length === 0 && <Typography textAlign='center' sx={{ padding: 1 }}>Bot does not have templates.</Typography>}



            {templates.length > 0 &&
                <List dense={true} sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {templates.map(t =>
                    (
                        <ListItem key={t.id}>
                            <ListItemIcon>
                                <AssignmentIcon />
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
                                primary={t.name}
                            />
                            <Box sx={{ display: 'flex' }}>
                                <EditTemplateButton template={t} />

                                <IconButton sx={{ marginLeft: 2 }} edge="end" aria-label="delete" onClick={() => handleRemoveTemplate(t)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </ListItem>
                    ))}

                </List>
            }

            <EditTemplateButton />

        </Box>
    )
}
