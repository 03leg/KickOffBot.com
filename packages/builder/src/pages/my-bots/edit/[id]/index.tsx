import * as React from 'react';
import Layout from '~/pages/Layout';
import dynamic from 'next/dynamic'
import { useRedirectUnauthorizedUser } from '~/utils/useRedirectUnauthorizedUser';
import Script from 'next/script';

const EditBotContent = dynamic(() => import('./EditBotContent').then(mod => mod.default), {
    ssr: false,
});

export default function EditPage() {

    useRedirectUnauthorizedUser();


    return (
        <Layout>
            <Script
                src="https://apis.google.com/js/api.js"
                strategy="lazyOnload"
                onLoad={() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (window as any).gapi.load('picker', () => { 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        // console.log(`script loaded correctly`, (window as any).google.picker.PickerBuilder)
                    })
                }
                }
            />
            <EditBotContent />
        </Layout>
    );
}