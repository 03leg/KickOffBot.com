/* eslint-disable @next/next/no-img-element */
'use client'
import { ButtonElement, UnsplashPhoto } from '@kickoffbot.com/types';
import React from 'react';
import { useCard1Styles } from './Card1.style';
import { Box, Button, Card, CardActions, CardContent, CardProps, styled } from '@mui/material';
import { CardSelectionMark } from './CardSelectionMark';
import { Card1Image } from './Card1Image';


interface Props {
    card: { image?: string | UnsplashPhoto, htmlDescription?: string };
    selected?: boolean;
    onSelectedChange?: (newValue: boolean) => void;
    isLast: boolean;
    selectableCard: boolean;
    useCardButtons?: boolean;
    cardButtons?: ButtonElement[];
    onButtonClick?: (button: ButtonElement) => void;
}

const SelectableChatCard1 = styled(Card)<CardProps>(({ theme }) => ({
    position: 'relative',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    '&:hover': {
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25), 0px 5px 10px rgba(0, 0, 0, 0.15)'
    },
    '&.Mui-selected': {
        '& img': {
            // border: '2px solid #1976d2',
            // borderBottom: '0px',
            // borderTopLeftRadius: theme.spacing(0.5),
            // boxShadow: '0px 0px 0px 2px #1976d2 inset'

        },
        // boxShadow: '0px 0px 0px 2px #1976d2 inset'
        border: '3px solid #1976d2'
    }
}));

const NotSelectableChatCard1 = styled(Card)<CardProps>(() => ({
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
}));

const ChatCardContent = styled(CardContent)(({ theme }) => ({
    flex: 1,
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    }
}))



export const Card1 = ({ card, selected, onSelectedChange, isLast, selectableCard, cardButtons, onButtonClick }: Props) => {
    const { classes, cx } = useCard1Styles();

    return (
        <Box sx={{ marginRight: isLast ? 0 : 1 }}>
            {selectableCard &&
                <SelectableChatCard1 className={cx(classes.root, selected ? 'Mui-selected' : '')} onClick={() => onSelectedChange?.(!selected)}>
                    {selected && <CardSelectionMark />}
                    <Card1Image image={card.image} />

                    {card.htmlDescription && <ChatCardContent>
                        <div dangerouslySetInnerHTML={{ __html: card.htmlDescription }}>
                        </div>
                    </ChatCardContent>}
                </SelectableChatCard1>
            }
            {!selectableCard &&
                <NotSelectableChatCard1 className={cx(classes.root)}>
                    <Card1Image image={card.image} />

                    {card.htmlDescription && <ChatCardContent>
                        <div dangerouslySetInnerHTML={{ __html: card.htmlDescription }}>
                        </div>
                    </ChatCardContent>}
                    {cardButtons && cardButtons.length > 0 &&
                        <CardActions sx={{
                            display: 'flex', flexDirection: 'column', '&>:not(style)~:not(style)': {
                                marginLeft: 0,
                                marginTop: 1
                            }
                        }}>
                            {cardButtons?.map((button) => (
                                <Button key={button.id} fullWidth variant='outlined' sx={{ textTransform: 'none' }} onClick={() => onButtonClick?.(button)}>{button.content}</Button>
                            ))}
                        </CardActions>
                    }
                </NotSelectableChatCard1>
            }
        </Box>

    )
}
