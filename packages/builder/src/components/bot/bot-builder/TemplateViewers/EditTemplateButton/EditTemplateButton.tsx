import React, { useCallback, useState } from 'react'
import SmhDialog from '~/components/commons/Dialog/SmhDialog'
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton } from '@mui/material';
import { BotTemplate } from '@kickoffbot.com/types';
import { isNil } from 'lodash';
import EditIcon from '@mui/icons-material/Edit';
import { useFlowDesignerStore } from '../../store';
import { v4 } from 'uuid';
import { TemplateEditor } from '../TemplateEditor';


interface Props {
    template?: BotTemplate;
}


export const EditTemplateButton = ({ template }: Props) => {
    const [open, setOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<BotTemplate>();
    const [disabledConfirmationButton, setDisabledConfirmationButton] = useState(false);
    const { addTemplate, templates, updateTemplate } = useFlowDesignerStore((state) => ({
        templates: state.project.templates ?? [],
        addTemplate: state.addTemplate,
        updateTemplate: state.updateTemplate
    }));

    const getNewTemplateName = useCallback(() => {
        let name = '';
        let index = 1;
        do {
            name = `template${index}`;
            index++;

        } while (templates.some(v => v.name === name));

        return name;
    }, [templates]);

    const handleAddTemplate = useCallback((event: React.MouseEvent<HTMLElement>) => {


        const newTemplate: BotTemplate = { id: v4(), name: getNewTemplateName(),  }
        setCurrentTemplate(newTemplate);
        setOpen(true);

        event.stopPropagation();
    }, [getNewTemplateName]);

    const handleEditTemplate = useCallback(() => {
        const copyTemplate = { ...template } as BotTemplate;
        setCurrentTemplate(copyTemplate);
        setOpen(true);
    }, [template]);

    const handleClose = useCallback((_?: unknown, reason?: string) => {
        if (reason && reason === "backdropClick")
            return;

        setOpen(false);
    }, []);

    const handleSave = useCallback(() => {

        if (isNil(currentTemplate)) {
            throw new Error('InvalidOperationError');
        }

        if (isNil(template)) {
            addTemplate(currentTemplate);
        } else {
            updateTemplate(currentTemplate);
        }


        handleClose();
    }, [addTemplate, currentTemplate, handleClose, template, updateTemplate]);

    const handleTemplateChange = useCallback((template: BotTemplate) => {
        let disabled = false;

        if (template.name.includes(' ')) {
            disabled = true;
        }

        if (templates.some(v => v.name === template.name && v.id !== template.id)) {
            disabled = true;
        }

        setDisabledConfirmationButton(disabled);
    }, [templates])


    return (
        <>
            {isNil(template) ? (
                <Button sx={{ margin: 1 }} variant="contained" size='small' aria-label="add" onClick={handleAddTemplate} endIcon={<AddIcon />}>
                    Add new
                </Button>
            ) :
                (
                    <IconButton edge="end" aria-label="edit" onClick={handleEditTemplate}>
                        <EditIcon />
                    </IconButton>
                )
            }
            <SmhDialog
                onClose={handleClose}
                maxWidth={'sm'}
                buttons={[
                    <Button key={'save'} onClick={handleSave} variant='contained' color='success' disabled={disabledConfirmationButton}>Save</Button>,
                    <Button key={'close'} onClick={handleClose}>Close</Button>
                ]}
                open={open} title={isNil(template) ? 'Add new template' : 'Edit template'}>
                <TemplateEditor
                    template={currentTemplate!}
                    onTemplateChange={handleTemplateChange}
                />
            </SmhDialog >
        </>
    )
}
