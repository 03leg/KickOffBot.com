import React from 'react'
import { useBotAvatarStyles } from './BotAvatar.style';

export const BotAvatar = () => {
    const { classes } = useBotAvatarStyles();
    return (
        <div className={classes.root}></div>
    )
}
