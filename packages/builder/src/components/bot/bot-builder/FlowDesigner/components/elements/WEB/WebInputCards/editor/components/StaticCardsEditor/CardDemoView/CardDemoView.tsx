import { WebCardDescriptionClassic } from '@kickoffbot.com/types';
import React from 'react'
import { Card1 } from './Card1';

interface Props {
    card: WebCardDescriptionClassic;
}

export const CardDemoView = ({ card }: Props) => {
    return (
        <>
            <Card1 card={card} />
        </>
    )
}
