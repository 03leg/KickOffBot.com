import { Box, Link } from '@mui/material'
import React from 'react'
import { useLogoStyles } from './Logo.style';

export const Logo = () => {
    const { classes } = useLogoStyles();
    return (
        <Box className={classes.root}>
            <Box className={classes.container}>
                <Box className={classes.logo}>
                    Made with <Link className={classes.link} href={'https://kickOffBot.com'} target="_blank" >💬 kickOffBot.com</Link>
                </Box>
            </Box>
        </Box>
    )
}
