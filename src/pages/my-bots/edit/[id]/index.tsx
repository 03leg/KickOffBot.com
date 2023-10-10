import * as React from 'react';
import Layout from '~/pages/Layout';
import dynamic from 'next/dynamic'

const EditBotContent = dynamic(() => import('./EditBotContent').then(mod => mod.EditBotContent), {
    ssr: false,
});

export default function EditPage() {
    return (
        <Layout>
            <EditBotContent />
        </Layout>
    );
}