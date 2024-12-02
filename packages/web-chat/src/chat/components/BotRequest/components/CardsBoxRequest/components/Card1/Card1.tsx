/* eslint-disable @next/next/no-img-element */
'use client'
import { ButtonElement, UnsplashPhoto } from '@kickoffbot.com/types';
import React from 'react';
import { useCard1Styles } from './Card1.style';
import { alpha, Box, Button, Card, CardActions, CardContent, CardProps, styled } from '@mui/material';
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
    onContentHeightChange?: () => void;
}

const SelectableChatCard1 = styled(Card)<CardProps>(({ theme }) => {
    return {
        position: 'relative',
        boxShadow: `0px 4px 6px ${alpha(theme.palette.text.primary, 0.1)}, 0px 1px 3px ${alpha(theme.palette.text.primary, 0.08)}`,
        cursor: 'pointer',
        '&:hover': {
            boxShadow: `0px 4px 6px ${alpha(theme.palette.text.primary, 0.25)}, 0px 1px 3px ${alpha(theme.palette.text.primary, 0.15)}`,

        },
        '&.Mui-selected': {
            border: `3px solid ${theme.palette.primary.main}`
        }
    };
});

const NotSelectableChatCard1 = styled(Card)<CardProps>(({ theme }) => ({
    boxShadow: `0px 4px 6px ${alpha(theme.palette.text.primary, 0.1)}, 0px 1px 3px ${alpha(theme.palette.text.primary, 0.08)}`,
}));

const ChatCardContent = styled(CardContent)(({ theme }) => ({
    flex: 1,
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    }
}))



export const Card1 = ({ card, selected, onSelectedChange, isLast, selectableCard, cardButtons, onButtonClick, onContentHeightChange }: Props) => {
    const { classes, cx } = useCard1Styles();

    return (
        <Box sx={{ marginRight: isLast ? 0 : 1 }}>
            {selectableCard &&
                <SelectableChatCard1 className={cx(classes.root, selected ? 'Mui-selected' : '')} onClick={() => onSelectedChange?.(!selected)}>
                    {selected && <CardSelectionMark />}
                    <Card1Image image={card.image} onImageLoaded={onContentHeightChange ?? (() => { })} />

                    {card.htmlDescription && <ChatCardContent>
                        <div data-testid="Card1-description" dangerouslySetInnerHTML={{ __html: card.htmlDescription }}>
                        </div>
                    </ChatCardContent>}
                </SelectableChatCard1>
            }
            {!selectableCard &&
                <NotSelectableChatCard1 className={cx(classes.root)}>
                    <Card1Image image={card.image} onImageLoaded={onContentHeightChange ?? (() => { })} />

                    {card.htmlDescription && <ChatCardContent>
                        <div data-testid="Card1-description" dangerouslySetInnerHTML={{ __html: card.htmlDescription }}>
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
                                <Button key={button.id} fullWidth variant='outlined' onClick={() => onButtonClick?.(button)}>{button.content}</Button>
                            ))}
                        </CardActions>
                    }
                </NotSelectableChatCard1>
            }
        </Box>

    )
}
