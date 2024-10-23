import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';

interface Props {
    onSendResponse: () => void;
    disabled?: boolean;
}

export const SendResponseButton = ({ onSendResponse, disabled }: Props) => {
    return (
        <IconButton disabled={disabled} onClick={onSendResponse} color='primary'>
            <SendIcon />
        </IconButton>
    )
}
