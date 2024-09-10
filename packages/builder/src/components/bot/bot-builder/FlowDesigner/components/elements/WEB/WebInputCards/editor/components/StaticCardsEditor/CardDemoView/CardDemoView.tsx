import { WebCardDescriptionClassic } from '@kickoffbot.com/types';
import React from 'react'
import { Card1 } from './Card1';
import { Box } from '@mui/material';

interface Props {
    card: WebCardDescriptionClassic;
    isLast: boolean;
}

export const CardDemoView = ({ card, isLast }: Props) => {
    return (
        <Box sx={{ marginRight: isLast ? 0 : 1, cursor: 'pointer' }}>
            <Card1 card={card} />
        </Box>
    )
}
