import React from 'react';
import dynamic from 'next/dynamic'
import { customScrollbarStyle } from '@kickoffbot.com/web-chat';


const MainWindowComponent = dynamic(() => import('./components/MainWindow/MainWindow').then(mod => mod.default), {
  ssr: false,
});

const customStyle = `
#__next{
 height: 100%;
}
html {
height: 100%;
}
body {
height: 100%;
}
${customScrollbarStyle}
`;

export default function RuntimeBotPage() {
  return <>
    <style jsx global>
      {customStyle}
    </style>
    <MainWindowComponent />
  </>
}