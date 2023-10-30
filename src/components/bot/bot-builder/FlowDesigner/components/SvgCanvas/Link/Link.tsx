import React, { useCallback, useState } from 'react'
import { keyframes } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { Colors } from '~/themes/Colors';


interface Props {
    d: string;
}

export const useStyles = makeStyles()(() => ({
    link: {
        pointerEvents: 'auto',
    },
    linkAnimation: {
        strokeDasharray: '10, 2',
        animation: `1s linear 0s infinite normal none running ${keyframes`0% { stroke-dashoffset: 32 } 100% { stroke-dashoffset: 0 }`}`,
        stroke: Colors.OUTPUT
    }
}));

export const Link = ({ d }: Props) => {
    const { classes, cx } = useStyles();
    const [showAnimation, setShowAnimation] = useState(false);

    const handleClick = useCallback(() => {
        setShowAnimation(!showAnimation);
    }, [showAnimation]);

    return (
        <g>
            <path className={cx(classes.link, showAnimation ? classes.linkAnimation : undefined)} stroke={Colors.LINK} fill='none' strokeWidth="3" d={d} ></path >
            <path className={cx(classes.link, showAnimation ? classes.linkAnimation : undefined)} onClick={handleClick} stroke={Colors.LINK} fill="none" strokeWidth="32" d={d} strokeLinecap="round" strokeOpacity="0" ></path>
        </g>
    )
}
