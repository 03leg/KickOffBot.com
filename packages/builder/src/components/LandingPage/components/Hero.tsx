import React from 'react';
import styles from './css/Hero.module.css';
import VideoThumb from 'public/images/video-preview.png';
import { signIn } from 'next-auth/react';
import { alpha, Box, Button, Container } from '@mui/material';

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
        >
            <Container
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
                                    Create your {/* <span className={styles.gradientText}>WEB</span> or*/} <span className={styles.gradientText}>Telegram</span> bot without coding
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

                <Box
                    id="image"
                    sx={(theme) => ({
                        mt: { xs: 8, sm: 10 },
                        alignSelf: 'center',
                        height: { xs: 200, sm: 700 },
                        width: '100%',
                        backgroundImage: 'url("'+VideoThumb.src+'")',
                        backgroundSize: 'cover',
                        borderRadius: '10px',
                        outline: '1px solid',
                        outlineColor:
                            theme.palette.mode === 'light'
                                ? alpha('#BFCCD9', 0.5)
                                : alpha('#9CCCFC', 0.1),
                        boxShadow:
                            theme.palette.mode === 'light'
                                ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
                                : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
                    })}
                />
            </Container>
        </Box>
    );
};