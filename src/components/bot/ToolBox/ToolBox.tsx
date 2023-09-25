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

export const ToolBox = () => {

    const toolBoxGroups: ToolBoxGroup[] =
        [
            {
                title: 'Content',
                items: [
                    { title: 'Text', icon: <MessageIcon /> },
                    { title: 'Image', icon: <ImageIcon /> },
                    { title: 'Audio', icon: <AudiotrackIcon /> },
                    { title: 'Video', icon: <VideocamIcon /> },
                ]
            },
            {
                title: 'User Input',
                items: [
                    { title: 'Text', icon: <TextFieldsIcon /> },
                    { title: 'Number', icon: <NumbersIcon /> },
                    { title: 'Email', icon: <AlternateEmailIcon /> },
                    { title: 'Date', icon: <DateRangeIcon /> },
                    { title: 'Phone', icon: <LocalPhoneIcon /> },
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
