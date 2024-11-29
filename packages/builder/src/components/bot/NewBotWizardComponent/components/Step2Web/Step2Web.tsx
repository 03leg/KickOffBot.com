import React, { useCallback } from 'react';
import { useNewBotWizardComponentStyles } from '../../NewBotWizardComponent.style';
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { Box, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import PublicIcon from '@mui/icons-material/Public';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { WebTemplateDemo } from '../WebTemplateDemo';
import pizzaMarket from '~/botTemplate/web/pizzaMarket.json';
import barberShop from '~/botTemplate/web/barbershop.json';
import countryHistoryQuiz from '~/botTemplate/web/countryHistoryQuiz.json';
import { TemplateDescription, WebTemplateDescription } from '../../NewBotWizardComponent.types';


interface Props {
    onClose: () => void;
    onSelectTemplate: (template: TemplateDescription | null) => void;
}

const webTemplates: WebTemplateDescription[] = [
    { botId: "cm24gqih90001pc2sbjyfjr06", title: "Pizza Market", icon: <LocalPizzaIcon />, template: JSON.stringify(pizzaMarket) },
    { botId: "cm1qksete0001spc2voeaj28v", title: "Country History Quiz", icon: <PublicIcon />, template: JSON.stringify(countryHistoryQuiz) },
    { botId: "cm3x2eh6k00019n5e0718tyng", title: "Barber Shop", icon: <CalendarMonthIcon />, template: JSON.stringify(barberShop) },
];


export const Step2Web = ({ onClose, onSelectTemplate }: Props) => {
    const { classes } = useNewBotWizardComponentStyles();
    const [selectedTemplate, setSelectedTemplate] = React.useState<WebTemplateDescription>(webTemplates[0]!);

    const handleSelectTemplate = useCallback((template: WebTemplateDescription) => {
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
                        {webTemplates.map(template => (
                            <ListItem disablePadding key={template.botId} selected={selectedTemplate.botId === template.botId}>
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
                        <WebTemplateDemo botId={selectedTemplate.botId} />
                        <Button sx={{ position: 'absolute', top: 0, right: 0, margin: 2 }} variant="contained" onClick={() => onSelectTemplate(selectedTemplate)}>Use template</Button>
                    </Box>
                </Box>
            </Box>
        </AppDialog>
    )
}
