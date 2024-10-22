import { Box, Button, IconButton, TextField } from '@mui/material'
import React, { useCallback } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UnsplashPhoto, WebImageDescription } from '@kickoffbot.com/types';
import { ImageSelector } from '~/components/commons/ImageSelector';
import { useAppDialog } from '~/components/bot/bot-builder/Dialog/useAppDialog';


interface Props {
    url?: string;
    onChangeUrl: (url?: string) => void;
}

export default function BackgroundImageEditor({ url, onChangeUrl }: Props) {
    const { openDialog, closeDialog } = useAppDialog();


    const handleAddNewImage = useCallback((image?: WebImageDescription) => {
        closeDialog();

        if (image) {
            const img = typeof image === 'string' ? image : image.regularSrc;
            onChangeUrl(img);
        }
    }, [closeDialog, onChangeUrl]);


    const handleDelete = useCallback(() => {
        onChangeUrl(undefined);
    }, [onChangeUrl])

    const handleEdit = useCallback(() => {
        let selectedImageResult: string | UnsplashPhoto | undefined;

        openDialog({
            content: <ImageSelector showVariableSelector={false} onImageSelect={(image: string | UnsplashPhoto) => {
                selectedImageResult = image;
            }} onSaveAndClose={() => handleAddNewImage(selectedImageResult)} />,
            dialogMaxWidth: 'lg',
            title: 'Select image',
            buttons: [
                <Button variant='contained' key={'ok'} color='success' onClick={() => handleAddNewImage(selectedImageResult)}>Select</Button>
            ],
        });
    }, [handleAddNewImage, openDialog])


    return (
        <Box sx={{ width: '100%', display: 'flex' }}>
            <TextField sx={{ flex: 1 }} InputProps={{
                readOnly: true,
            }} label="Background Image" variant="outlined" value={url ?? ""} fullWidth />
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <IconButton onClick={handleEdit}>
                    <EditIcon />
                </IconButton>
                {url && <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                </IconButton>}
            </Box>
        </Box>
    )
}
