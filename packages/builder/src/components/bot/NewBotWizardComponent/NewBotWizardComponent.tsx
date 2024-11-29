import React, { useCallback } from 'react'
import { Step1 } from './components/Step1';
import { BotPlatform } from '@kickoffbot.com/types';
import { Step2Web } from './components/Step2Web';
import { Step3 } from './components/Step3';
import { NewBotWizardDescription, TemplateDescription } from './NewBotWizardComponent.types';
import { Step4 } from './components/Step4';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { EDIT_BOT_PATH } from '~/constants';
import Script from 'next/script';
import { Step2Telegram } from './components/Step2Telegram';
import { getUniqueBotName } from './NewBotWizardComponent.utils';


const DEFAULT_BOT_NAME = 'My Bot';

interface Props {
    onClose: () => void;
    botNames?: string[];
}


export const NewBotWizardComponent = ({ onClose, botNames = [] }: Props) => {
    const [step, setStep] = React.useState(0);
    const [platform, setPlatform] = React.useState<BotPlatform>(BotPlatform.WEB);
    const [template, setTemplate] = React.useState<TemplateDescription | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { mutateAsync } = api.botManagement.saveBot.useMutation();
    const [createBotServerError, setCreateBotServerError] = React.useState<string>();
    const router = useRouter();

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleSelectPlatform = useCallback((platform: BotPlatform) => {
        setStep(1);
        setPlatform(platform);
    }, []);

    const handleSelectTemplate = useCallback((template: TemplateDescription | null) => {
        setStep(2);
        setTemplate(template);
    }, []);

    const handleCreateNewBot = useCallback(async (description: NewBotWizardDescription) => {
        setStep(3);
        setIsLoading(true);

        try {
            const newBotId: string = await mutateAsync({
                name: description.name,
                template: template?.template ?? undefined,
                botType: platform
            });

            handleClose();

            void router.push(EDIT_BOT_PATH + newBotId);
        }
        catch (e) {
            setCreateBotServerError('Failed to create bot. Please try again.');
        }
        finally {
            setIsLoading(false);
        }

    }, [handleClose, mutateAsync, platform, router, template?.template]);

    return (
        <>
            <Script src={`https://www.kickoffbot.com/dist/kickoffbot-web-starter.js`} />
            {step === 0 && <Step1 onClose={handleClose} onSelectPlatform={handleSelectPlatform} />}
            {step === 1 && platform === BotPlatform.WEB && <Step2Web onClose={handleClose} onSelectTemplate={handleSelectTemplate} />}
            {step === 1 && platform === BotPlatform.Telegram && <Step2Telegram onClose={handleClose} onSelectTemplate={handleSelectTemplate} />}
            {step === 2 && <Step3 onClose={handleClose} onCreateNewBot={handleCreateNewBot} botNames={botNames} initialBotName={getUniqueBotName((template?.title ?? DEFAULT_BOT_NAME) + " #", botNames ?? [])} />}
            {step === 3 && <Step4 onClose={handleClose} isLoading={isLoading} serverError={createBotServerError} />}
        </>
    )
}
