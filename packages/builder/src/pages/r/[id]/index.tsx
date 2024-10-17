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
        height: 100%;
      }

.chat-box-root::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.chat-box-root::-webkit-scrollbar-track {
  background: transparent; 
}

.chat-box-root::-webkit-scrollbar-track:hover {
  background: #f1f1f1; 
}
 
.chat-box-root::-webkit-scrollbar-thumb {
  background: #8080807a; 
}

.chat-box-root::-webkit-scrollbar-thumb:hover {
  background: #808080c9; 
}

    `}</style>
        <MainWindowComponent />
    </>
}