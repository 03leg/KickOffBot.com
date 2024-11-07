import React, { useCallback } from 'react'
import { useUrlViewerStyles } from './UrlViewer.style';
import { Box, TextField, Button } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface Props {
    text: string;
}

export const UrlViewer = ({ text }: Props) => {
    const { classes } = useUrlViewerStyles();
    const [showSuccessCopy, setShowSuccessCopy] = React.useState(false);


    const handleCopyButtonClick = useCallback(async () => {
        await navigator.clipboard.writeText(text);
        setShowSuccessCopy(true);

        setTimeout(() => {
            setShowSuccessCopy(false);
        }, 2000);

    }, [text]);


    return (
        <Box className={classes.link}>
            <TextField value={text} fullWidth />
            <Button className={classes.copyButton} onClick={handleCopyButtonClick}>
                {showSuccessCopy && <CheckBoxIcon />}
                {!showSuccessCopy && 'Copy'}
            </Button>
        </Box>
    )
}
