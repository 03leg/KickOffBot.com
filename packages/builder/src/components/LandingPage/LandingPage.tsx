import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from './components/AppAppBar';
import { Hero } from './components/Hero';
import Footer from './components/Footer';
import Head from 'next/head';
import { GoogleAnalytics } from '@next/third-parties/google';
import { env } from '~/env.mjs';
import { Samples } from './components/Samples';

export function LandingPage() {

  return (
    <>
      <Head>
        <title>Bot builder platform (WEB, telegram)</title>
      </Head>
      <AppAppBar />
      <Hero />
      <Samples />
      <Box sx={{ bgcolor: 'background.default' }}>
        {/* <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ /> */}
        <Divider />
        <Footer />
      </Box>
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
    </>
  );
}