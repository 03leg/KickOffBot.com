import React from 'react';
import dynamic from 'next/dynamic'
import { customScrollbarStyle } from '~/components/bot/bot-builder/WebBotDemo/theme/customScrollbarStyle';

const MainWindowComponent = dynamic(() => import('./components/MainWindow/MainWindow').then(mod => mod.default), {
  ssr: false,
});


export default function RuntimeBotPage() {
  return <>
    <style jsx global>{`
        #__next{
         height: 100%;
        }
      html {
        height: 100%;
      }
      body {
        height: 100%;
      }
    `}
      {customScrollbarStyle}
    </style>
    <MainWindowComponent />
  </>
}