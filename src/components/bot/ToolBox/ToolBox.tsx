import { Box } from '@mui/material'
import React from 'react'
import { Colors } from '~/themes/Colors'
import { type ToolBoxGroup } from './types'
import MessageIcon from '@mui/icons-material/Message';
import ImageIcon from '@mui/icons-material/Image';
import { ToolBoxGroupComp } from './ToolBoxGroup';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideocamIcon from '@mui/icons-material/Videocam';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { ElementType } from '../types';

export const ToolBox = () => {

    const toolBoxGroups: ToolBoxGroup[] =
        [
            {
                title: 'Content',
                items: [
                    { type: ElementType.CONTENT_TEXT, title: 'Text', icon: <MessageIcon /> },
                    { type: ElementType.CONTENT_IMAGE, title: 'Image', icon: <ImageIcon /> },
                    { type: ElementType.CONTENT_AUDIO, title: 'Audio', icon: <AudiotrackIcon /> },
                    { type: ElementType.CONTENT_VIDEO, title: 'Video', icon: <VideocamIcon /> },
                ]
            },
            {
                title: 'User Input',
                items: [
                    { type: ElementType.INPUT_TEXT, title: 'Text', icon: <TextFieldsIcon /> },
                    { type: ElementType.INPUT_NUMBER, title: 'Number', icon: <NumbersIcon /> },
                    { type: ElementType.INPUT_EMAIL, title: 'Email', icon: <AlternateEmailIcon /> },
                    { type: ElementType.INPUT_DATE, title: 'Date', icon: <DateRangeIcon /> },
                    { type: ElementType.INPUT_PHONE, title: 'Phone', icon: <LocalPhoneIcon /> },
                ]
            },
        ]

    return (
        <Box sx={{
            height: '100%',
            minWidth: 300,
            maxWidth: 300,
            backgroundColor: Colors.WHITE,
            boxShadow: '0px 1px 6px hsla(245, 50%, 17%, 0.1)',
            marginRight: ({ spacing }) => spacing(2),
        }}>
            {toolBoxGroups.map(group => <ToolBoxGroupComp key={group.title} group={group} />)}
        </Box>
    )
}
