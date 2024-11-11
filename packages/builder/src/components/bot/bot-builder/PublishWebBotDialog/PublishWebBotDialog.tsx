import { Button, Box, Typography, Tabs, Tab } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { useFlowDesignerStore } from '../store';
import { env } from '~/env.mjs';
import { usePublishWebBotDialogStyles } from './PublishWebBotDialog.style';
import { IframeInfo } from './components/IframeInfo';
import { NotionInfo } from './components/NotionInfo';
import { UrlViewer } from './components/UrlViewer';
import { WordpressInfo } from './components/WordpressInfo';
import { a11yProps, CustomTabPanel } from './components/CustomTabs/CustomTabs';
import { HtmlJavascriptInfo } from './components/HtmlJavascriptInfo';

interface Props {
    projectId: string;
}

export const PublishWebBotDialog = ({ projectId }: Props) => {
    const [value, setValue] = React.useState(0);
    const { classes } = usePublishWebBotDialogStyles();
    const { togglePublishWebBotDialog, showPublishWebBotDialog } = useFlowDesignerStore((state) => ({
        togglePublishWebBotDialog: state.togglePublishWebBotDialog,
        showPublishWebBotDialog: state.showPublishWebBotDialog
    }));
    const appUrl = `${env.NEXT_PUBLIC_APP_URL}/r/${projectId}`;
    const starterUrl = `${env.NEXT_PUBLIC_WEB_STARTER_JS_URL}`;

    const handleClose = useCallback(() => {
        togglePublishWebBotDialog();
    }, [togglePublishWebBotDialog]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const uniqueId = useMemo(() => {
        return Math.random().toString(36).slice(-6);
    }, []);


    if (!showPublishWebBotDialog) {
        return null;
    }

  
    return (
        <AppDialog
            onClose={handleClose}
            maxWidth={'md'}
            buttons={[
                <Button key={'close'} onClick={handleClose}>Close</Button>
            ]}
            open={true} title={'Share your bot'}>
            <Box className={classes.root} >
                <Typography variant='h5'>This is your saved bot link:</Typography>
                <UrlViewer text={appUrl} showOpenButton />

                <Box className={classes.info}>
                    <Typography variant='h5'>Bot integration:</Typography>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="iFrame" className={classes.integrationTab} {...a11yProps(0)} />
                            <Tab label="Notion" className={classes.integrationTab} {...a11yProps(1)} />
                            <Tab label="Wordpress" className={classes.integrationTab} {...a11yProps(2)} />
                            <Tab label="HTML+Javascript" className={classes.integrationTab} {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <IframeInfo src={appUrl} />
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={1}>
                        <NotionInfo url={appUrl} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <WordpressInfo botId={projectId} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        <HtmlJavascriptInfo botId={projectId} starterUrl={starterUrl} uniqueId={uniqueId} />
                    </CustomTabPanel>
                </Box>
            </Box>
        </AppDialog>
    )
}
