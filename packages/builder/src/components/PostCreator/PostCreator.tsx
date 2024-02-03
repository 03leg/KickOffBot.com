import { Box, Divider } from '@mui/material'
import React, { useCallback, useRef } from 'react'
import { Colors } from '~/themes/Colors'
import { PostEditor } from './components/PostEditor'
import { PostEditorToolBar } from './components/PostEditorToolBar'
import { type ClientFileDescription, type PostDescription } from '~/types/ContentEditor'
import { isNil } from 'lodash'
import { uploadAttachments } from './utils'
import { showError } from '~/utils/ClientStatusMessage'
import { type UploadAttachmentFileDescription } from '~/types/UploadAttachments'

export const PostCreator = () => {
    const currentPost = useRef<PostDescription>();

    const handlePublish = useCallback(async () => {
        let attachments: UploadAttachmentFileDescription[] = [];

        if (!isNil(currentPost.current) && currentPost.current.attachments.length > 0) {
            try {
                attachments = await uploadAttachments(currentPost.current.attachments.map((f) => (f as ClientFileDescription).browserFile));
            }
            catch {
                showError('Failed to save your post... Sorry 😔');
                return;
            }
        }

        console.log('Save post', attachments);

        // void submitImage(formData)
    }, []);


    const handlePostChange = useCallback((post: PostDescription) => {
        currentPost.current = post;
        console.log('post', post);
    }, []);


    return (
        <Box sx={{
            backgroundColor: Colors.WHITE,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            maxWidth: 500,
            width: '100%',
            boxShadow: '0px 1px 6px hsla(245, 50%, 17%, 0.1)',
        }}>
            <PostEditor onPostChange={handlePostChange} />
            <Divider />
            <PostEditorToolBar onPublish={() => void handlePublish()} />
        </Box>
    )
}
