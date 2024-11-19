import React from 'react';
import { alpha, Box, Chip, Container } from '@mui/material';
import styles from './css/Samples.module.css';
import DemoBotSection from './DemoBotSection/DemoBotSection';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import PublicIcon from '@mui/icons-material/Public';
import Script from 'next/script';
import { env } from '~/env.mjs';

type CurrentBotDemo = 'pizza-market' | 'country-history-quiz';

export const Samples = () => {
    const [currentBot, setCurrentBot] = React.useState<CurrentBotDemo>('pizza-market');

    return <>
        <Script src={`${env.NEXT_PUBLIC_APP_URL}/dist/kickoffbot-web-starter.js`} />
        {/* <Script src={`https://www.kickoffbot.com/dist/kickoffbot-web-starter.js`} /> */}
        <Box
            sx={(theme) => ({
                width: '100%',
                backgroundImage:
                    theme.palette.mode === 'light'
                        ? 'linear-gradient(180deg, #3985f21f, #FFF)'
                        : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
                backgroundSize: '100% 20%',
                backgroundRepeat: 'no-repeat',
            })}
            data-testid="hero"
        >
            <Container
                data-testid="hero-container"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 6, sm: 16 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                <span className={styles.header}>From Idea to Reality: Build a Bot That Solves Your Needs!</span>
                <div className={styles.description}>
                    Bring your bot ideas to life! Check out these demo bots that reflect the endless possibilities of our bot builder.
                </div>

                <Box sx={{ mt: 4, mb: 5 }}>
                    <Chip variant={currentBot === 'pizza-market' ? 'filled' : 'outlined'}
                        color="warning"
                        sx={{ fontSize: '1rem' }}
                        onClick={() => { setCurrentBot('pizza-market') }}
                        clickable
                        icon={<LocalPizzaIcon />}
                        label="Pizza Market" >
                    </Chip>
                    <Chip variant={currentBot === 'country-history-quiz' ? 'filled' : 'outlined'}
                        color="default"
                        sx={{ fontSize: '1rem', ml: 1 }}
                        onClick={() => { setCurrentBot('country-history-quiz') }}
                        clickable
                        icon={<PublicIcon />}
                        label="Country History Quiz" >
                    </Chip>
                </Box>


                {currentBot === 'pizza-market' && <DemoBotSection
                    botId='cm24gqih90001pc2sbjyfjr06'
                    googleSpreadsheetUrl='https://docs.google.com/spreadsheets/d/e/2PACX-1vTlgrIz9FiMHpsWuXyY2-5I0dwbiLo3n_zPHxdjSk90HDM1BGhfoV20P2FXBq86bKvZE2sLGIaqYvpJ/pubhtml?gid=0&single=true&widget=true&headers=false'
                    botUrl='https://www.kickoffbot.com/r/cm24gqih90001pc2sbjyfjr06'
                    header='Order pizza 🍕 and more with chatbot, and easily track your orders 📊 in a Google Spreadsheet. Place an order now and see how everything works seamlessly!😊'
                />}
                {currentBot === 'country-history-quiz' && <DemoBotSection
                    telegramUrl='https://t.me/Country_History_Quiz_KickoffBot'
                    botId='cm1qksete0001spc2voeaj28v'
                    googleSpreadsheetUrl='https://docs.google.com/spreadsheets/d/e/2PACX-1vTlgrIz9FiMHpsWuXyY2-5I0dwbiLo3n_zPHxdjSk90HDM1BGhfoV20P2FXBq86bKvZE2sLGIaqYvpJ/pubhtml?gid=1143898715&single=true&widget=true&headers=false'
                    botUrl='https://www.kickoffbot.com/r/cm1qksete0001spc2voeaj28v'
                    header='Highly interactive quiz that tests your knowledge about world history and save your progress in a Google Spreadsheet. Try it now and see how it works!😊'
                />}
            </Container>

        </Box>
    </>
}