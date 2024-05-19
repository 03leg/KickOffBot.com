import * as React from 'react';
import Layout from '~/pages/Layout';
import dynamic from 'next/dynamic'
import { useRedirectUnauthorizedUser } from '~/utils/useRedirectUnauthorizedUser';

const EditBotContent = dynamic(() => import('./EditBotContent').then(mod => mod.EditBotContent), {
    ssr: false,
});

export default function EditPage() {

    useRedirectUnauthorizedUser();


    return (
        <Layout>
            <EditBotContent />
        </Layout>
    );
}