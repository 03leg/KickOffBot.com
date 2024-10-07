import { WebVideoMediaDescription } from '@kickoffbot.com/types';
import React from 'react';

interface Props {
    video: WebVideoMediaDescription;
    onDelete?: (image: WebVideoMediaDescription) => void;
}

export const VideoMedia = ({ video, onDelete }: Props) => {
    return (
        <div>VideoMedia</div>
    )
}
