import { VariableType, VideoSource, WebVideoDescription } from '@kickoffbot.com/types';
import { Box, Tabs, Tab } from '@mui/material';
import React from 'react';
import { AppTextField } from '../AppTextField';
import { MediaUploader } from '../ImageSelector/components/MediaUploader';

interface Props {
    onVideoSelect: (video: WebVideoDescription) => void;
    onSaveAndClose: () => void;
}

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

export const VideoSelector = ({ onVideoSelect, onSaveAndClose }: Props) => {
    const [value, setValue] = React.useState(0);
    const [youtubeVideoUrl, setYoutubeVideoUrl] = React.useState('');
    const [directVideoUrl, setDirectVideoUrl] = React.useState('');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Direct video link" {...a11yProps(0)} />
                    <Tab label="Upload your video" {...a11yProps(1)} />
                    <Tab label="Youtube" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <AppTextField label="Direct video link" onValueChange={(newValue: string) => {
                    onVideoSelect({ url: newValue, source: VideoSource.DIRECT_VIDEO_URL });
                    setDirectVideoUrl(newValue);
                }} value={directVideoUrl}
                    newVariableTemplate={{ type: VariableType.STRING, value: 'https://your-video-url' }}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <MediaUploader accept='video/*' onValueChange={(newValue: string) => {
                    onVideoSelect({ url: newValue, source: VideoSource.UPLOADED });
                    onSaveAndClose();
                }} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <AppTextField label="Youtube video URL" onValueChange={(newValue: string) => {
                    onVideoSelect({ url: newValue, source: VideoSource.YOUTUBE });
                    setYoutubeVideoUrl(newValue);
                }} value={youtubeVideoUrl} />
            </CustomTabPanel>
        </Box>
    )
}
