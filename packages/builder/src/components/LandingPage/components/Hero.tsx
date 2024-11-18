import React from 'react';
import styles from './css/Hero.module.css';
import { signIn } from 'next-auth/react';
import { alpha, Box, Button, Container, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export const Hero = () => {
    const [googleSheetKey, setGoogleSheetKey] = React.useState('initial-key');
    return (
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
                    pt: { xs: 14, sm: 20 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                <section className={styles.section}>
                    <div className={styles.wrapper}>
                        <div className={styles.textCenter}>
                            <h1 className={`${styles.heading}`} data-aos="zoom-y-out">
                                Create your <span className={styles.gradientText}>WEB</span> <Typography component="span" sx={(theme) => ({
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    [theme.breakpoints.down("md")]: {
                                        fontSize: "2rem",
                                    },
                                })}>(or</Typography> <Typography component="span" className={styles.gradientText} sx={(theme) => ({
                                    fontSize: '3rem',
                                    fontWeight: 800,

                                    [theme.breakpoints.down("md")]: {
                                        fontSize: "2rem",
                                    }
                                })}>telegram</Typography>) bot without coding
                            </h1>
                            <div className={styles.paragraph}>
                                <p data-aos="zoom-y-out" data-aos-delay="150">
                                    Easily create chatbot conversations without coding. Build smart chatbots quickly with our simple bot builder.
                                </p>
                                <div className={styles.buttonContainer} data-aos-delay="300">
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => { void signIn(); }}
                                        style={{ textTransform: 'none' }}
                                    >
                                        Get started
                                    </Button>
                                    <Button
                                        color="primary"
                                        variant="text"
                                        component={'a'} href="/docs"
                                        className={styles.link}
                                        style={{ textTransform: 'none' }}
                                    >
                                        Learn more <span aria-hidden="true">→</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Box sx={{ width: "100%", }}>
                    <Box sx={(theme) => ({
                        textAlign: "center",
                        fontSize: "1.7rem",
                        color: "#4b5563",
                        marginBottom: 2,
                        [theme.breakpoints.down("md")]: {
                            fontSize: "1.2rem",
                        },
                    })}>Order pizza 🍕 and more with chatbot, and easily track your orders 📊 in a Google Spreadsheet. Place an order now and see how everything works seamlessly!😊</Box>
                    <Box sx={(theme) => ({
                        width: "100%",
                        display: "flex",
                        [theme.breakpoints.down("md")]: {
                            display: "block"
                        },
                    })}>
                        <Box sx={(theme) => ({
                            width: '50%',
                            height: "750px",
                            // marginRight: "10px",
                            [theme.breakpoints.down("md")]: {
                                width: '100%',
                                marginRight: "0px",
                                paddingTop: "10px"
                            },
                        })}>
                            <Box sx={(theme) => ({
                                border: "1px solid #d5d9df",
                                height: "100%",
                                // [theme.breakpoints.down("md")]: {
                                //     height: "calc(100% - 12px)"
                                // },
                            })}>
                                <iframe
                                    src="https://www.kickoffbot.com/r/cm24gqih90001pc2sbjyfjr06"
                                    style={{ width: "100%", height: "calc(100% - 1px)", border: "none" }}
                                ></iframe>
                            </Box>
                        </Box>
                        <Box sx={{ width: "10px", height: "10px" }}></Box>
                        <Box sx={(theme) => ({
                            width: 'calc(50% - 10px)',
                            position: "relative",
                            [theme.breakpoints.down("md")]: {
                                width: '100%',
                            },
                            height: "750px"
                        })}>
                            <Button
                                color="success"
                                variant="contained"
                                size='small'
                                onClick={() => { setGoogleSheetKey(new Date().getTime().toString()) }}
                                startIcon={<RefreshIcon />}
                                style={{ textTransform: 'none', position: "absolute", top: "5px", right: "3px" }}
                            >Update</Button>

                            <Box sx={{ height: "100%", border: "1px solid #d5d9df", padding: "5px" }}>
                                <iframe key={googleSheetKey} style={{ width: "100%", height: "100%", border: "none" }} src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTlgrIz9FiMHpsWuXyY2-5I0dwbiLo3n_zPHxdjSk90HDM1BGhfoV20P2FXBq86bKvZE2sLGIaqYvpJ/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"></iframe>
                            </Box>
                        </Box>
                    </Box>
                </Box>


            </Container>
        </Box>
    );
};