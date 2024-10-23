import React, { useMemo } from 'react'
import { useBotAvatarStyles } from './BotAvatar.style';
import { AvatarSettings, AvatarView } from '@kickoffbot.com/types';
import { Avatar, Box } from '@mui/material';
import { isNil } from 'lodash';

interface Props {
    avatarSettings?: AvatarSettings;
    role: 'user' | 'bot';
}

export const BotAvatar = ({ avatarSettings, role }: Props) => {
    const { classes } = useBotAvatarStyles({ settings: avatarSettings, role });

    const imageSrc = useMemo(() => {

        if (avatarSettings?.avatarView !== AvatarView.Image || !avatarSettings?.avatarImageUrl) {
            return undefined;
        }

        return avatarSettings?.avatarImageUrl;

    }, [avatarSettings?.avatarImageUrl, avatarSettings?.avatarView]);

    const fontSize = useMemo(() => {
        if (avatarSettings?.avatarView !== AvatarView.ColorInitials || isNil(avatarSettings?.avatarText) || avatarSettings.avatarText.length <= 4) {
            return undefined;
        }

        if (avatarSettings.avatarText.length <= 5) {
            return '1rem';
        }

        if (avatarSettings.avatarText.length <= 6) {
            return '0.9rem';
        }

        return '0.6rem';

    }, [avatarSettings?.avatarText, avatarSettings?.avatarView])

    return (
        <Box className={classes.root}>
            <Avatar
                sx={{ fontSize: fontSize }}
                src={imageSrc}
                className={classes.avatar}>
                {(avatarSettings?.avatarView === AvatarView.ColorInitials && avatarSettings?.avatarText) ? avatarSettings?.avatarText : undefined}
            </Avatar>
        </Box>
    )
}
