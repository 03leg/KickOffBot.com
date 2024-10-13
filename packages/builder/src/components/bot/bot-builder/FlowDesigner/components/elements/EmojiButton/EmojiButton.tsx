import React, { useCallback } from 'react'
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { ClickAwayListener, IconButton } from '@mui/material';
import { createPortal } from 'react-dom';

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


            {showEmojiPicker && createPortal(
                <div style={{
                    position: 'absolute', zIndex: 9999,
                    top: 0,
                    height: '100%',
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#8080807d'
                }}>
                    <ClickAwayListener
                        onClickAway={() => {
                            setShowEmojiPicker(false);
                        }}
                    >
                        <div>
                            <EmojiPicker emojiVersion={'3.0'} onEmojiClick={(data) => { handleInsertEmoji(data.emoji); setShowEmojiPicker(false); }} />
                        </div>
                    </ClickAwayListener >
                </div>,
                document.body
            )}
        </>
    )
}
