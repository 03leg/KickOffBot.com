import React, { useEffect, useLayoutEffect } from 'react'
import { Hero } from './Hero'
import { Header } from './Header'
import { Features } from './Features'
import { Footer } from './Footer'
import { LoadingIndicator } from '../commons/LoadingIndicator'
// import "tailwindcss/tailwind.css";

export const LandingPage = () => {
  const [loadedTailwind, setLoadedTailwind] = React.useState(false);

  useLayoutEffect(() => {
    const script = document.createElement('script');
    const scriptId = 'tailwind-script';
    if (!document.getElementById(scriptId)) {
      const head = document.getElementsByTagName('head')[0];

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => {
        setLoadedTailwind(true);
      }

      head?.appendChild(script);
    }
    return () => {
      script.remove();
    }
  }, []);

  if (loadedTailwind === false) {
    return <LoadingIndicator />;
  }


  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Footer />
    </>
  )
}
