import { Box, Button } from '@mui/material';
import React from 'react'
import AppDialog from '~/components/commons/Dialog/AppDialog';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useNewBotWizardComponentStyles } from '../../NewBotWizardComponent.style';
import { BotPlatform } from '@kickoffbot.com/types';

interface Props {
    onSelectPlatform: (platform: BotPlatform) => void;
    onClose: () => void;
}

export const Step1 = ({ onClose, onSelectPlatform }: Props) => {
    const { classes } = useNewBotWizardComponentStyles();


    return (
        <AppDialog
            onClose={onClose}
            maxWidth={'sm'}
            open={true} title={"What platform do you want to create a bot for?"} buttons={[]}>
            <Box className={classes.step1Root}>
                <Button color='success' variant="outlined" className={classes.step1ButtonPlatform} onClick={() => onSelectPlatform(BotPlatform.WEB)}>
                    <Box className={classes.step1ButtonPlatformContent}>
                        <LanguageIcon />  web
                    </Box>
                </Button>
                <Button variant="outlined" className={classes.step1ButtonPlatform} onClick={() => onSelectPlatform(BotPlatform.Telegram)}>
                    <Box className={classes.step1ButtonPlatformContent}>
                        <TelegramIcon /> telegram
                    </Box>
                </Button>
            </Box>
        </AppDialog>
    )
}
