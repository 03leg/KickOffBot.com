/* eslint-disable @next/next/no-img-element */
'use client'
import { WebCardDescriptionClassic } from '@kickoffbot.com/types';
import React from 'react';
import { useCard1Styles } from './Card1.style';
import { Card, CardContent } from '@mui/material';


interface Props {
    card: WebCardDescriptionClassic;
}

export const Card1 = ({ card }: Props) => {
    const { classes } = useCard1Styles();

    return (
        <Card className={classes.root}>
            {card.imgUrl && <img
                className={classes.img}
                src={card.imgUrl}
                srcSet={card.imgUrl}
                loading="lazy"
                alt=""
            />}

            {card.htmlDescription && <CardContent >
                <div dangerouslySetInnerHTML={{ __html: card.htmlDescription }}>
                </div>
            </CardContent>}
        </Card>

    )
}
