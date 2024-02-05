import { Box } from '@mui/material'
import dynamic from 'next/dynamic'
import React, { useCallback, useState } from 'react'
import { AttachEditor } from '../AttachEditor'
import { type FileDescription, type PostDescription } from '~/types/ContentEditor';

const TextEditor = dynamic(() => import('../TextEditor').then(mod => mod.TextEditor), {
    ssr: false,
});

interface PostEditorProps {
    onPostChange: (post: PostDescription) => void;
}

export const PostEditor = ({ onPostChange }: PostEditorProps) => {

    const [postDescription, setPostDescription] = useState<PostDescription>({ content: '', attachments: [] });

    const handleAttachmentsChange = useCallback((files: FileDescription[]) => {
        const newPostDescription: PostDescription = { ...postDescription, attachments: files };
        setPostDescription(newPostDescription);
        onPostChange(newPostDescription);
    }, [onPostChange, postDescription]);

    const handleContentChange = useCallback((jsonContent: string) => {
        const newPostDescription: PostDescription = { ...postDescription, content: jsonContent };
        setPostDescription(newPostDescription);
        onPostChange(newPostDescription);
    }, [onPostChange, postDescription]);

    return (
        <Box sx={{ flex: 1, padding: ({ spacing }) => spacing(2) }}>
            <TextEditor onContentChange={handleContentChange} />
        </Box>
    )
}
