import { Button, Box, Typography, Tabs, Tab } from '@mui/material';
import React, { useCallback } from 'react';
import AppDialog from '~/components/commons/Dialog/AppDialog';
import { useFlowDesignerStore } from '../store';
import { env } from '~/env.mjs';
import { usePublishWebBotDialogStyles } from './PublishWebBotDialog.style';
import { IframeInfo } from './components/IframeInfo';
import { NotionInfo } from './components/NotionInfo';
import { UrlViewer } from './components/UrlViewer';
import { WordpressInfo } from './components/WordpressInfo';

interface Props {
    projectId: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 2, pb: 2 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const PublishWebBotDialog = ({ projectId }: Props) => {
    const [value, setValue] = React.useState(0);
    const { classes } = usePublishWebBotDialogStyles();
    const { togglePublishWebBotDialog, showPublishWebBotDialog } = useFlowDesignerStore((state) => ({
        togglePublishWebBotDialog: state.togglePublishWebBotDialog,
        showPublishWebBotDialog: state.showPublishWebBotDialog
    }));
    const appUrl = `${env.NEXT_PUBLIC_APP_URL}/r/${projectId}`;

    const handleClose = useCallback(() => {
        togglePublishWebBotDialog();
    }, [togglePublishWebBotDialog]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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
                <UrlViewer text={appUrl} />

                <Box className={classes.info}>
                    <Typography variant='h5'>Bot integration:</Typography>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="iFrame" className={classes.integrationTab} {...a11yProps(0)} />
                            {/* <Tab label="Wordpress" className={classes.integrationTab} {...a11yProps(1)} /> */}
                            <Tab label="Notion" className={classes.integrationTab} {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <IframeInfo src={appUrl} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <WordpressInfo botId={projectId} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <NotionInfo url={appUrl} />
                    </CustomTabPanel>
                </Box>
            </Box>
        </AppDialog>
    )
}
