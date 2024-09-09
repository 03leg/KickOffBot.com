/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentState } from 'draft-js';
import React, { useEffect } from 'react';

interface Props {
    contentState: ContentState;
    entityKey: string;
    children: React.ReactNode;
}

export const Link = (props: Props) => {
    const entity = props.contentState.getEntity(props.entityKey);
    const { linkUrl } = entity.getData();
    const linkRef = React.useRef<HTMLAnchorElement | null>(null);
    const [linkTextColor, setLinkTextColor] = React.useState<string>('');

    useEffect(() => {

        if (linkRef.current) {
            const child = linkRef.current?.children[0] as any;
            if (child?.style.color) {
                setLinkTextColor(child.style.color);

                (entity as any).data.linkTextColor = child.style.color;
            }
        }
    }, [entity, linkUrl, props.children]);

    return (
        <a target="_blank" style={{ textDecorationColor: linkTextColor }} ref={linkRef} href={linkUrl} title={linkUrl} className="link">
            {props.children}
        </a>
    );
};