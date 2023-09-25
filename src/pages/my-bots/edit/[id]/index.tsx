import * as React from 'react';
import { Box } from '@mui/material';
import Layout from '~/pages/Layout';
import { ToolBox } from '~/components/bot/ToolBox';
import { FlowDesigner } from '~/components/bot/FlowDesigner';

export default function EditPage() {
    return (
        <Layout>
            <Box sx={{ padding: (theme) => theme.spacing(2), height: '100%', display: 'flex', flexDirection: 'row' }}>
                <ToolBox />
                <Box sx={{ flex: 1 }}>
                  <FlowDesigner/>
                </Box>
            </Box>
        </Layout>
    );
}