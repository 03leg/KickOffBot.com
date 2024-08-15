import { Box, Stack } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { TemplateCard } from './TemplateCard';
import { TemplateDescription } from './types';
import countryHistory from '../../../botTemplate/telegram/countryHistoryQuiz.json'
import { BotPlatform } from '@kickoffbot.com/types';

const fromScratchTemplate =
    {
        title: 'Start from scratch',
        description: 'You design your bot from scratch',
    } as TemplateDescription;


const availableTelegramTemplates: TemplateDescription[] = [
    fromScratchTemplate,
    {
        title: 'Country History Quiz',
        description: 'Test your knowledge of world history with our interactive quiz bot',
        telegramLink: 'https://t.me/Country_History_Quiz_KickoffBot',
        youtubeLink: 'https://github.com/03leg/KickOffBot.com?tab=readme-ov-file#sample-1-history-quiz-bot',
        template: JSON.stringify(countryHistory)
    },
] as const;

interface Props {
    platform: BotPlatform;
    onTemplateChange: (template: TemplateDescription) => void
}


export const TemplatesViewer = ({ onTemplateChange, platform }: Props) => {
    const availableTemplates = useMemo(() => {
        if (platform === BotPlatform.Telegram) {
            return availableTelegramTemplates
        }
        if (platform === BotPlatform.WEB) {
            return [fromScratchTemplate];
        }

        throw new Error('InvalidOperationError');
    }, [platform])

    const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateDescription>(availableTemplates[0]!);


    const handleTemplateChange = useCallback((template: TemplateDescription) => {
        setSelectedTemplate(template);

        onTemplateChange(template);
    }, [onTemplateChange]);



    return (
        <Box sx={{ maxHeight: '500px', overflow: 'auto', padding: 1 }}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap={true}>
                {availableTemplates.map((template) => (<TemplateCard
                    key={template.title}
                    onSelect={handleTemplateChange}
                    template={template}
                    isSelected={selectedTemplate === template} />))}
            </Stack>
        </Box>
    )
}
