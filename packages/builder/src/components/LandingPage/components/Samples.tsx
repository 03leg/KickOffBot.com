import React from 'react';
import { alpha, Box, Chip, Container } from '@mui/material';
import styles from './css/Samples.module.css';
import DemoBotSection from './DemoBotSection/DemoBotSection';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import PublicIcon from '@mui/icons-material/Public';
import Script from 'next/script';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DemoBotSectionShadowDom from './DemoBotSectionShadowDom/DemobotSectionShadowDom';

type CurrentBotDemo = 'pizza-market' | 'country-history-quiz' | 'barber-shop';

export const Samples = () => {
    const [currentBot, setCurrentBot] = React.useState<CurrentBotDemo>('pizza-market');

    console.log(currentBot);

    return <>
        {/* <Script src={`${env.NEXT_PUBLIC_APP_URL}/dist/kickoffbot-web-starter.js`} /> */}
        <Script src={`https://www.kickoffbot.com/dist/kickoffbot-web-starter.js`} />
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

                <Box sx={{ mt: 4, mb: 5, textAlign: 'center' }}>
                    <Chip variant={currentBot === 'pizza-market' ? 'filled' : 'outlined'}
                        color="warning"
                        sx={{ fontSize: '1rem', mt: 1 }}
                        onClick={() => { setCurrentBot('pizza-market') }}
                        clickable
                        icon={<LocalPizzaIcon />}
                        label="Pizza Market" >
                    </Chip>
                    <Chip variant={currentBot === 'country-history-quiz' ? 'filled' : 'outlined'}
                        color="default"
                        sx={{ fontSize: '1rem', ml: 1, mt: 1 }}
                        onClick={() => { setCurrentBot('country-history-quiz') }}
                        clickable
                        icon={<PublicIcon />}
                        label="Country History Quiz" >
                    </Chip>
                    <Chip variant={currentBot === 'barber-shop' ? 'filled' : 'outlined'}
                        color="info"
                        sx={{ fontSize: '1rem', ml: 1, mt: 1 }}
                        onClick={() => { setCurrentBot('barber-shop') }}
                        clickable
                        icon={<CalendarMonthIcon />}
                        label="Schedule Your Trim" >
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
                {currentBot === 'barber-shop' && <DemoBotSectionShadowDom header={"In this bot, you'll find a demo for booking appointments at a barbershop. The booking results are displayed in a Google Spreadsheet. Please note that already booked time slots will not be available for reservation."}
                    googleSpreadsheetUrl={'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlgrIz9FiMHpsWuXyY2-5I0dwbiLo3n_zPHxdjSk90HDM1BGhfoV20P2FXBq86bKvZE2sLGIaqYvpJ/pubhtml?gid=13501546&single=true&widget=true&headers=false'}
                    botId={'cm3x2eh6k00019n5e0718tyng'}
                    botUrl={'https://www.kickoffbot.com/r/cm3x2eh6k00019n5e0718tyng'} />}

            </Container>

        </Box>
    </>
}