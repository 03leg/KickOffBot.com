import { Box, Button, Card, CardActions, CardContent, IconButton, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { TemplateDescription } from './types';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { makeStyles } from 'tss-react/mui';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Link from 'next/link';

interface Props {
    template: TemplateDescription;
    isSelected: boolean;
    onSelect: (template: TemplateDescription) => void;
}

export const useStyles = makeStyles()(() => ({
    selectedCard: {
        boxShadow: '0px 2px 1px -1px #2e7d32, 0px 1px 1px 0px #2e7d32, 0px 1px 3px 0px #2e7d32'
    },
}));

export const TemplateCard = ({ template, isSelected = false, onSelect }: Props) => {
    const { classes } = useStyles();

    const handleSelectTemplate = useCallback(() => {
        onSelect(template);
    }, [onSelect, template]);

    return (
        <Card sx={{
            width: 260,
            display: "flex",
            flexDirection: "column",
        }}
            classes={{
                root: isSelected ? classes.selectedCard : undefined,
            }}
        >
            <CardContent>
                <Typography variant="h6" component="div">
                    {isSelected && <DoneOutlineIcon color="success" fontSize='inherit' />} {template.title}
                </Typography>
                <Typography sx={{ mt: 1 }} color="text.secondary">
                    {template.description}
                </Typography>
            </CardContent>
            <CardActions sx={{ mt: "auto", display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    {!isSelected && <Button size="small" onClick={handleSelectTemplate}>Select</Button>}
                </Box>
                <Box>
                    {template.telegramLink &&
                        <Link href={template.telegramLink} target="_blank">
                            <IconButton >
                                <TelegramIcon />
                            </IconButton>
                        </Link>
                    }
                    {template.youtubeLink &&
                        <Link href={template.youtubeLink} target="_blank">
                            <IconButton >
                                <YouTubeIcon />
                            </IconButton>
                        </Link>
                    }
                </Box>
            </CardActions>
        </Card>
    )
}
