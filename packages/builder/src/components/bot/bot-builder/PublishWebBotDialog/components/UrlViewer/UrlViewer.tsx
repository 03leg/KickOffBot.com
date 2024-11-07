import React, { useCallback } from 'react'
import { useUrlViewerStyles } from './UrlViewer.style';
import { Box, TextField, Button } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface Props {
    text: string;
    showOpenButton?: boolean
}

export const UrlViewer = ({ text, showOpenButton = false }: Props) => {
    const { classes } = useUrlViewerStyles();
    const [showSuccessCopy, setShowSuccessCopy] = React.useState(false);


    const handleCopyButtonClick = useCallback(async () => {
        await navigator.clipboard.writeText(text);
        setShowSuccessCopy(true);

        setTimeout(() => {
            setShowSuccessCopy(false);
        }, 2000);

    }, [text]);

    const handleOpenUrlClick = useCallback(() => {
        window.open(text);
    }, [text])

    return (
        <Box className={classes.link}>
            <TextField value={text} fullWidth />
            <Box className={classes.buttonContainer}>
                {showOpenButton && <Button className={classes.actionButton} onClick={handleOpenUrlClick}>
                    Open
                </Button>}
                <Button className={classes.actionButton} onClick={handleCopyButtonClick}>
                    {showSuccessCopy && <CheckBoxIcon />}
                    {!showSuccessCopy && 'Copy'}
                </Button>
            </Box>
        </Box>
    )
}
