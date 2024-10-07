import { Box } from '@mui/material'
import React from 'react'
import { useUnsplashAuthorBoxStyles } from './UnsplashAuthorBox.style';
import { env } from '~/env.mjs';
import { UnsplashPhoto } from '@kickoffbot.com/types';

interface Props {
    image: UnsplashPhoto;
}

export const UnsplashAuthorBox = ({ image }: Props) => {
    const { classes } = useUnsplashAuthorBoxStyles();
    return (
        <Box className={classes.unsplashImageContainer}>
            Photo by <a target='_blank' href={`https://unsplash.com/${image.authorNickname}?utm_source=${env.NEXT_PUBLIC_UNSPLASH_APP_NAME}&utm_medium=referral`}>{image.authorName}</a> on <a target='_blank' href={`https://unsplash.com/?utm_source=${env.NEXT_PUBLIC_UNSPLASH_APP_NAME}&utm_medium=referral`}>Unsplash</a>
        </Box>
    )
}
