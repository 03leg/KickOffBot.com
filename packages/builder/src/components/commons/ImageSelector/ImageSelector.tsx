import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { AppTextField } from '../AppTextField';
import { ImageUploader } from './components/ImageUploader';
import { GiphySelector } from './components/GiphySelector';
import { UnsplashSelector } from './components/UnsplashSelector';
import { UnsplashPhoto } from '@kickoffbot.com/types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface Props {
    initImgUrl?: string;
    onImageUrlChange: (url: string | UnsplashPhoto) => void;
    onSaveAndClose?: () => void; // for giphy
}

export const ImageSelector = ({ initImgUrl, onImageUrlChange, onSaveAndClose }: Props) => {
    const [value, setValue] = React.useState(0);
    const [imageUrl, setImageUrl] = React.useState(initImgUrl ?? '');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="From URL" {...a11yProps(0)} />
                    <Tab label="Upload your image" {...a11yProps(1)} />
                    <Tab label="Giphy" {...a11yProps(2)} />
                    <Tab label="Unsplash" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <AppTextField label="Image URL" value={imageUrl ?? ''} onValueChange={(newValue: string) => {
                    setImageUrl(newValue);
                    onImageUrlChange(newValue);
                }} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ImageUploader onValueChange={(newValue: string) => {
                    setImageUrl(newValue);
                    onImageUrlChange(newValue);
                }} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <GiphySelector onValueChange={(newValue: string) => {
                    setImageUrl(newValue);
                    onImageUrlChange(newValue);
                    onSaveAndClose?.();
                }} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <UnsplashSelector onValueChange={(newValue: UnsplashPhoto) => {
                    setImageUrl(newValue.regularSrc);
                    onImageUrlChange(newValue);
                    onSaveAndClose?.();
                }} />
            </CustomTabPanel>
        </Box>
    )
}
