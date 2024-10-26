import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useCallback } from 'react';
import ImageUrlEditor from '../ImageUrlEditor/ImageUrlEditor';
import ThemeFieldEditor from '../ThemeFieldEditor/ThemeFieldEditor';
import { AvatarView } from '@kickoffbot.com/types';
import ColorPicker from '../ColorPicker/ColorPicker';

interface Props {
    showAvatar: boolean;
    onShowAvatarChange: (showAvatar: boolean) => void;
    avatarImageUrl: string;
    onAvatarImageUrlChange: (imageUrl?: string) => void;
    size: "small" | "medium" | "large";
    onSizeChange: (size: "small" | "medium" | "large") => void;
    avatarView?: AvatarView;
    onAvatarViewChange: (view: AvatarView) => void;
    avatarColor?: string;
    onAvatarColorChange: (color?: string) => void;
    avatarText?: string;
    onAvatarTextChange: (text?: string) => void;
}

export default function AvatarSettingsEditor({
    showAvatar, onShowAvatarChange,
    avatarImageUrl, onAvatarImageUrlChange,
    size, onSizeChange,
    avatarView, onAvatarViewChange,
    avatarColor, onAvatarColorChange,
    avatarText, onAvatarTextChange
}: Props) {

    const handleShowAvatarChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        onShowAvatarChange(checked);
    }, [onShowAvatarChange]);


    const handleSizeChange = useCallback((event: SelectChangeEvent) => {
        const size = event.target.value as "small" | "medium" | "large";
        onSizeChange(size);
    }, [onSizeChange])

    const handleAvatarViewChange = useCallback((event: SelectChangeEvent) => {
        const view = event.target.value as AvatarView;
        onAvatarViewChange(view);
    }, [onAvatarViewChange])

    return (
        <>
            <ThemeFieldEditor label=""><FormControlLabel control={<Checkbox checked={showAvatar} onChange={handleShowAvatarChange} />} label="Show avatar" /></ThemeFieldEditor>
            {showAvatar && <>
                <ThemeFieldEditor label="Size">
                    <FormControl fullWidth >
                        <InputLabel>Size</InputLabel>
                        <Select
                            value={size ?? 'medium'}
                            label='Size'
                            onChange={handleSizeChange}
                        >
                            (<MenuItem key={'small'} value={'small'}>Small</MenuItem>)
                            (<MenuItem key={'medium'} value={'medium'}>Medium</MenuItem>)
                            (<MenuItem key={'large'} value={'large'}>Large</MenuItem>)
                        </Select>
                    </FormControl>
                </ThemeFieldEditor>
                <ThemeFieldEditor label="View">
                    <FormControl fullWidth >
                        <InputLabel>View</InputLabel>
                        <Select
                            value={avatarView ?? AvatarView.ColorInitials}
                            label='View'
                            onChange={handleAvatarViewChange}
                        >
                            (<MenuItem key={AvatarView.ColorInitials} value={AvatarView.ColorInitials}>Color+Initials</MenuItem>)
                            (<MenuItem key={AvatarView.Image} value={AvatarView.Image}>Image</MenuItem>)
                        </Select>
                    </FormControl>
                </ThemeFieldEditor>
                {avatarView === AvatarView.Image && <ThemeFieldEditor label="Avatar Image"><ImageUrlEditor url={avatarImageUrl} onChangeUrl={(url) => onAvatarImageUrlChange(url)} label='Avatar Image' /></ThemeFieldEditor>}
                {avatarView === AvatarView.ColorInitials && <>
                    <ThemeFieldEditor label="Avatar Color">
                        <ColorPicker color={avatarColor} onColorChange={(color) => onAvatarColorChange(color)} />
                    </ThemeFieldEditor>
                    <ThemeFieldEditor label="Initials">
                        <TextField fullWidth label="Initials (optional)" value={avatarText} onChange={(event) => onAvatarTextChange(event.target.value)} />
                    </ThemeFieldEditor>
                </>}
            </>}

        </>
    )
}
