import React, { useCallback } from 'react'
import { useNewBotWizardComponentStyles } from '../../NewBotWizardComponent.style';
import { Box, Button, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link, IconButton } from '@mui/material';
import AppDialog from '~/components/commons/Dialog/AppDialog';
import PublicIcon from '@mui/icons-material/Public';
import TelegramIcon from '@mui/icons-material/Telegram';



import countryHistory from '~/botTemplate/telegram/countryHistoryQuiz.json'
import { TelegramTemplateDescription, TemplateDescription } from '../../NewBotWizardComponent.types';

interface Props {
    onClose: () => void;
    onSelectTemplate: (template: TemplateDescription | null) => void;
}

const telegramTemplates: TelegramTemplateDescription[] = [
    {
        title: 'Country History Quiz',
        icon: <PublicIcon />,
        description: 'Test your knowledge of world history with interactive quiz bot',
        telegramLink: 'https://t.me/Country_History_Quiz_KickoffBot',
        template: JSON.stringify(countryHistory)
    }
]

export const Step2Telegram = ({ onClose, onSelectTemplate }: Props) => {
    const { classes } = useNewBotWizardComponentStyles();
    const [selectedTemplate, setSelectedTemplate] = React.useState<TelegramTemplateDescription>(telegramTemplates[0]!);

    const handleSelectTemplate = useCallback((template: TelegramTemplateDescription) => {
        setSelectedTemplate(template);
    }, []);


    return (
        <AppDialog
            onClose={onClose}
            maxWidth={'lg'}
            open={true} title={"Do you want to create a new bot or import one from a template?"} buttons={[]}>
            <Box className={classes.step2Root}>
                <Button variant="outlined" className={classes.step2Button} onClick={() => onSelectTemplate(null)}>
                    <Box className={classes.step2ButtonContent}>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Start From Scratch</Typography>
                        <Typography sx={{}}>design your bot yourself</Typography>
                    </Box>
                </Button>
                <Box sx={{ width: '100%', height: '650px', marginTop: 2, marginBottom: 2, display: 'flex' }}>
                    <List sx={{ width: '300px', mr: 2 }} dense={true}>
                        {telegramTemplates.map(template => (
                            <ListItem disablePadding key={template.title} selected={selectedTemplate.telegramLink === template.telegramLink}>
                                <ListItemButton onClick={() => handleSelectTemplate(template)}>
                                    <ListItemIcon sx={{ minWidth: '36px' }}>
                                        {template.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={template.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Box sx={{ border: `1px solid #ccc`, width: 'calc(100% - 316px)', position: 'relative' }}>
                        <Typography sx={{ mt: 2, ml: 2, fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedTemplate.title}</Typography>
                        <Typography sx={{ mt: 2, ml: 2 }}>{selectedTemplate.description}</Typography>
                        <Box sx={{ margin: 2 }}>
                            <Link href={selectedTemplate.telegramLink} target="_blank">
                                <Button variant="contained" color='info' sx={{ textTransform: 'none' }} startIcon={<TelegramIcon />}>Open in Telegram</Button>
                            </Link>
                        </Box>

                        <Button sx={{ position: 'absolute', top: 0, right: 0, margin: 2 }} variant="contained" onClick={() => onSelectTemplate(selectedTemplate)}>Use template</Button>
                    </Box>
                </Box>
            </Box>
        </AppDialog>
    )
}
