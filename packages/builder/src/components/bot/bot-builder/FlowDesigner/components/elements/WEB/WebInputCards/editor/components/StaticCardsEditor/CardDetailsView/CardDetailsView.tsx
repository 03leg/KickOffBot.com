/* eslint-disable @next/next/no-img-element */
import { LogicalOperator, UnsplashPhoto, WebCardDescriptionClassic } from '@kickoffbot.com/types';
import React, { useCallback, useEffect } from 'react';
import { useCardDetailsViewStyles } from './CardDetailsView.style';
import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useAppDialog } from '~/components/bot/bot-builder/Dialog/useAppDialog';
import { ImageSelector } from '~/components/commons/ImageSelector';
import { throwIfNil } from '~/utils/guard';
import { WebTextEditor } from '~/components/commons/WebTextEditor';
import { AppTextField } from '~/components/commons/AppTextField';
import { ConditionEditor } from '../../../../../../Condition/Editor';
import { getImageSrc } from '../../../getImageSrc';

interface Props {
    item?: WebCardDescriptionClassic;
    onChange: () => void;
}



export const CardDetailsView = ({ item, onChange }: Props) => {
    const { classes } = useCardDetailsViewStyles();
    const { openDialog, closeDialog } = useAppDialog();
    const [imageUrl, setImageUrl] = React.useState<string | undefined>(getImageSrc(item?.image));
    const [title, setTitle] = React.useState<string>(item?.title ?? '');
    const [useVisibilityConditions, setUseVisibilityConditions] = React.useState<boolean>(item?.useVisibilityConditions ?? false);

    useEffect(() => {
        setImageUrl(getImageSrc(item?.image));
    }, [item?.image]);

    useEffect(() => {
        setTitle(item?.title ?? '');
    }, [item?.title]);

    useEffect(() => {
        setUseVisibilityConditions(item?.useVisibilityConditions ?? false);
    }, [item?.useVisibilityConditions]);


    const handleUpdateImageUrl = useCallback((image?: string | UnsplashPhoto) => {
        throwIfNil(item);

        closeDialog();

        if (image) {
            const imageSrc = typeof image === 'string' ? image : image.regularSrc;

            setImageUrl(imageSrc);
            item.image = image;
            onChange();
        }


    }, [closeDialog, item, onChange]);

    const handleSelectImage = useCallback(() => {
        let selectedImageResult: string | UnsplashPhoto | undefined;

        openDialog({
            content: <ImageSelector initImgUrl={imageUrl} onImageSelect={(image: string | UnsplashPhoto) => {
                selectedImageResult = image;
            }} onSaveAndClose={() => handleUpdateImageUrl(selectedImageResult)} />,
            dialogMaxWidth: 'lg',
            title: 'Select image',
            buttons: [
                <Button variant='contained' key={'ok'} color='success' onClick={() => handleUpdateImageUrl(selectedImageResult)}>Select</Button>
            ],
        });

    }, [handleUpdateImageUrl, imageUrl, openDialog]);

    const handleDescriptionChange = useCallback((jsonState: string, htmlContent: string) => {
        throwIfNil(item);

        item.htmlDescription = htmlContent;
        item.jsonDescription = jsonState;

        onChange();
    }, [item, onChange]);

    const handleUseVisibilityConditionsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        throwIfNil(item);

        setUseVisibilityConditions(event.target.checked);
        item.useVisibilityConditions = event.target.checked;
        if (event.target.checked) {
            item.visibilityConditionsDescription = {
                items: [],
                logicalOperator: LogicalOperator.AND
            };
        }
        onChange();
    }, [item, onChange])

    if (!item) {
        return null
    }

    return (
        <Box className={classes.root}>

            <Box>
                <Box className={classes.titleContainer}>
                    <AppTextField label='Card value' value={title} onValueChange={(newValue: string) => {
                        item.title = newValue;
                        setTitle(newValue);
                        onChange();
                    }}></AppTextField>
                </Box>
                <Box className={classes.content}>
                    <Box className={classes.imagePreview}>
                        <Button variant='contained' color='success' onClick={handleSelectImage}>Select image</Button>
                        {imageUrl && <img className={classes.img} src={imageUrl} alt='image' />}
                        {!imageUrl && <Typography sx={{ textAlign: 'center', marginTop: 2 }}>No image</Typography>}
                    </Box>
                    <Box className={classes.cardSettingsContainer}>
                        <Box className={classes.textEditor}>
                            <WebTextEditor key={item.id} jsonState={item?.jsonDescription} onContentChange={handleDescriptionChange} />
                        </Box>
                        <Box className={classes.visibilityContainer} >
                            <FormControlLabel control={<Checkbox checked={useVisibilityConditions} onChange={handleUseVisibilityConditionsChange} />} label="Set Conditions for Visibility" />
                            {useVisibilityConditions && item.visibilityConditionsDescription && <ConditionEditor element={item.visibilityConditionsDescription} />}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
