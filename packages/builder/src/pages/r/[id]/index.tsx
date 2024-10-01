import React from 'react';
import dynamic from 'next/dynamic'

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
        background-color: red;
        height: 100%;
      }
    `}</style>
        <MainWindowComponent />
    </>
}