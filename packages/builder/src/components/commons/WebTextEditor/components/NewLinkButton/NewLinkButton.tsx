import { Box, Button, IconButton, Popover, TextField, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import AddIcon from '@mui/icons-material/Add';


interface Props {
    showTitleEditor?: boolean;
    onAddLink: (url: string, title?: string) => void
}

export const NewLinkButton = ({ onAddLink, showTitleEditor }: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [url, setUrl] = React.useState('');
    const [linkTitle, setLinkTitle] = React.useState('');

    const handleAddLink = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setUrl('');
        setLinkTitle('');
    };

    const openLinkSettingsPopover = Boolean(anchorEl);

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    }
    const handleLinkTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLinkTitle(event.target.value);
    };

    const disabledButton = useMemo(() => {
        if (showTitleEditor) {
            return url === '' || linkTitle === '';
        }

        return url === '';
    }, [linkTitle, showTitleEditor, url]);

    return (
        <>
            <IconButton title='Add link' aria-label="font-size" onClick={handleAddLink}>
                <InsertLinkIcon />
            </IconButton>
            <Popover
                open={openLinkSettingsPopover}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
                    {showTitleEditor &&
                        <>
                            <Typography>Link Title</Typography>
                            <TextField sx={{ marginBottom: 1 }} fullWidth variant="outlined" required value={linkTitle} onChange={handleLinkTitle} />
                        </>}

                    <Typography >URL</Typography>
                    <TextField fullWidth variant="outlined" required value={url} onChange={handleUrlChange} />

                    <Button sx={{ marginTop: 1 }} disabled={disabledButton} variant="outlined" startIcon={<AddIcon />} onClick={() => {
                        onAddLink(url, linkTitle);
                        handleClose();

                    }}>Add link</Button>
                </Box>

            </Popover>
        </>
    )
}
