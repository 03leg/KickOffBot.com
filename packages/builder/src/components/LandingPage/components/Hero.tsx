import React from 'react';
import styles from './css/Hero.module.css';
import { signIn } from 'next-auth/react';
import { alpha, Box, Button, Container, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export const Hero = () => {
   
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
            </Container>
        </Box>
    );
};