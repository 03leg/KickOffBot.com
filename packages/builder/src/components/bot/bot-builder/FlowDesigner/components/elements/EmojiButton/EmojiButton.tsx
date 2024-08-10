import React, { useCallback } from 'react'
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { ClickAwayListener, IconButton } from '@mui/material';

interface Props {
    onInsertEmoji: (emoji: string) => void;
}

export const EmojiButton = ({ onInsertEmoji }: Props) => {
    const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false);

    const handleShowEmojiPicker = useCallback(() => {
        setShowEmojiPicker(true);
    }, []);

    const handleInsertEmoji = useCallback((emoji: string) => {
        onInsertEmoji(emoji);
    }, [onInsertEmoji]);

    return (
        <>
            <IconButton aria-label="italic" onClick={handleShowEmojiPicker}>
                <InsertEmoticonIcon />
            </IconButton>

            {showEmojiPicker &&
                <ClickAwayListener
                    onClickAway={() => {
                        setShowEmojiPicker(false);
                    }}
                >
                    <div style={{ position: 'fixed', zIndex: 1 }}><EmojiPicker emojiVersion={'3.0'} onEmojiClick={(data) => handleInsertEmoji(data.emoji)} /></div>
                </ClickAwayListener>
            }
        </>
    )
}
