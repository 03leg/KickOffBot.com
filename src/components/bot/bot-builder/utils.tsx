import { ElementType } from "./types";
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideocamIcon from '@mui/icons-material/Videocam';
import MessageIcon from '@mui/icons-material/Message';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { isNil } from "lodash";

export function getContentElements() {
    return [
        { type: ElementType.CONTENT_TEXT, title: 'Text', icon: <MessageIcon /> },
        { type: ElementType.CONTENT_IMAGE, title: 'Image', icon: <ImageIcon /> },
        { type: ElementType.CONTENT_AUDIO, title: 'Audio', icon: <AudiotrackIcon /> },
        { type: ElementType.CONTENT_VIDEO, title: 'Video', icon: <VideocamIcon /> },
    ]
}

export function getInputElements() {
    return [
        { type: ElementType.INPUT_TEXT, title: 'Text', icon: <TextFieldsIcon /> },
        { type: ElementType.INPUT_NUMBER, title: 'Number', icon: <NumbersIcon /> },
        { type: ElementType.INPUT_EMAIL, title: 'Email', icon: <AlternateEmailIcon /> },
        { type: ElementType.INPUT_DATE, title: 'Date', icon: <DateRangeIcon /> },
        { type: ElementType.INPUT_PHONE, title: 'Phone', icon: <LocalPhoneIcon /> },
    ];
}

export function getIconByType(type: ElementType) {
    const description = [...getInputElements(), ...getContentElements()].find(d => d.type === type);

    if (isNil(description)) {
        throw new Error('Property "description" can not be null here');
    }

    return description.icon;
}