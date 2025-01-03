import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { AppTextField } from '../AppTextField';
import { MediaUploader } from './components/MediaUploader';
import { GiphySelector } from './components/GiphySelector';
import { UnsplashSelector } from './components/UnsplashSelector';
import { UnsplashPhoto, VariableType } from '@kickoffbot.com/types';

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
    onImageSelect: (url: string | UnsplashPhoto) => void;
    onSaveAndClose?: () => void; // for giphy
    showVariableSelector?: boolean;
}

export const ImageSelector = ({ initImgUrl, onImageSelect, onSaveAndClose, showVariableSelector = true }: Props) => {
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
                <AppTextField showVariableSelector={showVariableSelector} label="Image URL" value={imageUrl ?? ''} onValueChange={(newValue: string) => {
                    setImageUrl(newValue);
                    onImageSelect(newValue);
                }}
                    newVariableTemplate={{ type: VariableType.STRING, value: 'https://media0.giphy.com/media/Z5xk7fGO5FjjTElnpT/giphy-downsized.gif?cid=42e3a184tmodxh861fhnlpd1azzp7yebg8g264vnhk38l7l5&ep=v1_gifs_trending&rid=giphy-downsized.gif&ct=g' }}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <MediaUploader accept='image/*' onValueChange={(newValue: string) => {
                    setImageUrl(newValue);
                    onImageSelect(newValue);
                }} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <GiphySelector onValueChange={(newValue: string) => {
                    setImageUrl(newValue);
                    onImageSelect(newValue);
                    onSaveAndClose?.();
                }} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <UnsplashSelector onValueChange={(newValue: UnsplashPhoto) => {
                    setImageUrl(newValue.regularSrc);
                    onImageSelect(newValue);
                    onSaveAndClose?.();
                }} />
            </CustomTabPanel>
        </Box>
    )
}
