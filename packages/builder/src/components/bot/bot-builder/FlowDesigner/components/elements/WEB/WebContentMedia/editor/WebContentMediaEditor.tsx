import { MediaViewMode, UnsplashPhoto, WebContentMediaUIElement, WebImageDescription, WebImageMediaDescription, WebMediaDescription, WebMediaType } from '@kickoffbot.com/types';
import { Box, Button } from '@mui/material';
import React, { useCallback } from 'react';
import { useWebContentMediaEditorStyles } from './WebContentMediaEditor.style';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import { ImageSelector } from '~/components/commons/ImageSelector';
import { useAppDialog } from '~/components/bot/bot-builder/Dialog/useAppDialog';
import { v4 } from 'uuid';
import { MediasViewer } from './components/MediasViewer';
import { SelectedMediaProps } from './components/SelectedMediaProps';
import { MediaViewModeSelector } from './components/MediaViewModeSelector';


interface Props {
    element: WebContentMediaUIElement;
    mediaType: WebMediaType;
}

export const WebContentMediaEditor = ({ element, mediaType }: Props) => {
    const { classes } = useWebContentMediaEditorStyles();
    const { openDialog, closeDialog } = useAppDialog();
    const [medias, setMedias] = React.useState<WebMediaDescription[]>(element.medias ?? []);
    const [selectedElement, setSelectedElement] = React.useState<WebMediaDescription | null>(null);
    const [viewMode, setViewMode] = React.useState<MediaViewMode>(element.viewMode ?? MediaViewMode.HorizontalMediaList);

    const handleAddNewImage = useCallback((image?: WebImageDescription) => {
        closeDialog();

        if (image) {
            const newImage: WebImageMediaDescription = { image, type: WebMediaType.IMAGE, id: v4() };
            setMedias([...medias, newImage]);
            element.medias = [...medias, newImage];
            setSelectedElement(newImage);
        }
    }, [closeDialog, element, medias]);

    const handleAddNewImageButtonClick = useCallback(() => {
        let selectedImageResult: string | UnsplashPhoto | undefined;

        openDialog({
            content: <ImageSelector onImageSelect={(image: string | UnsplashPhoto) => {
                selectedImageResult = image;
            }} onSaveAndClose={() => handleAddNewImage(selectedImageResult)} />,
            dialogMaxWidth: 'lg',
            title: 'Select image',
            buttons: [
                <Button variant='contained' key={'ok'} color='success' onClick={() => handleAddNewImage(selectedImageResult)}>Select</Button>
            ],
        });

    }, [handleAddNewImage, openDialog]);

    const handleDeleteMedia = useCallback((media: WebMediaDescription) => {
        if (media.id === selectedElement?.id) {
            setSelectedElement(null);
        }
        setMedias(medias.filter(m => m.id !== media.id));
        element.medias = medias.filter(m => m.id !== media.id);
    }, [element, medias, selectedElement?.id]);


    const handleViewModeChange = useCallback((mode: MediaViewMode) => {
        setViewMode(mode);
        element.viewMode = mode;
    }, [element]);

    return (
        <Box className={classes.root}>
            {medias.length > 1 && <MediaViewModeSelector viewMode={viewMode} onViewModeChange={handleViewModeChange} />}
            <Box className={classes.toolbar}>
                {mediaType === WebMediaType.IMAGE && <Button variant="outlined" className={classes.toolbarButton} color="success" startIcon={<InsertPhotoIcon />} onClick={handleAddNewImageButtonClick}>Add image</Button>}
                {mediaType === WebMediaType.VIDEO && <Button variant="outlined" disabled className={classes.toolbarButton} color="success" startIcon={<MusicVideoIcon />}>Add video</Button>}
            </Box>
            <Box className={classes.mediasViewer}>
                <MediasViewer medias={medias} onDelete={handleDeleteMedia} selectedItem={selectedElement} onSelectItem={setSelectedElement} />
            </Box>
            {selectedElement && <Box className={classes.selectedMediaProps}>
                <SelectedMediaProps key={selectedElement.id} media={selectedElement} />
            </Box>
            }
        </Box>
    )
}
