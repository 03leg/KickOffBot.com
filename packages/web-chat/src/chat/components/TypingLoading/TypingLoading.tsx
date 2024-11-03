import React from 'react';
import { useTypingLoadingStyles } from './TypingLoading.style';

export const TypingLoading = () => {
    const { classes } = useTypingLoadingStyles();
    return (
        <div className={classes.typing}>
            <span className={classes.dot} />
            <span className={`${classes.dot} ${classes.dotSecond}`} />
            <span className={`${classes.dot} ${classes.dotThird}`} />
        </div>
    )
}
