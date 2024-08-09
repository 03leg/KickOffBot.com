import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from './components/AppAppBar';
import { Hero } from './components/Hero';
import Footer from './components/Footer';
import Head from 'next/head';

export function LandingPage() {

  return (
    <>
      <Head>
        <title>Create telegram bot</title>
      </Head>
      <AppAppBar />
      <Hero />
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
    </>
  );
}