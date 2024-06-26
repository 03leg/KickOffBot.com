import { Box, Divider } from '@mui/material';
import { isNil } from 'lodash';
import React, { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui';
import { ElementType, MessageContentDescription } from '@kickoffbot.com/types';
import { AttachmentsViewer } from '~/components/PostCreator/components/AttachmentsViewer/AttachmentsViewer';
import { AttachmentViewer } from '../../AttachmentViewer';
import { ButtonsInput } from '../ButtonsInput/ButtonsInput';

interface Props {
    element: MessageContentDescription;
    elementId: string;
}

export const useStyles = makeStyles()(() => ({
    root: {
        '& p': {
            margin: 0
        }
    },
    variable: {
        backgroundColor: '#FF5722',
        borderRadius: '5px',
        color: 'white',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingBottom: '1px',
        paddingTop: '1px',
    },
    template: {
        backgroundColor: '#4CAF50',
        borderRadius: '5px',
        color: 'white',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingBottom: '1px',
        paddingTop: '1px',
    }
}));


export const TextContent = ({ element, elementId }: Props) => {
    const contentTextElement = element;
    const { classes } = useStyles();

    const textContent = useMemo(() => {
        let html = contentTextElement.htmlContent;
        if (isNil(html)) {
            return html;
        }

        const variableMatches = html.matchAll(/&lt;%variables.(.*?)%&gt;/g);

        for (const m of variableMatches) {
            const value = m[1];
            html = isNil(value) ? html : html.replace(m[0], `<span class="${classes.variable}">${value}</span>`);
        }

        const templateMatches = html.matchAll(/&lt;%templates.(.*?)%&gt;/g);

        for (const m of templateMatches) {
            const value = m[1];
            html = isNil(value) ? html : html.replace(m[0], `<span class="${classes.template}">${value}</span>`);
        }

        return html;
    }, [classes.template, classes.variable, contentTextElement.htmlContent]);

    return (
        <Box className={classes.root}>
            <div dangerouslySetInnerHTML={{ __html: textContent ?? 'Message...' }}></div>
            {contentTextElement.attachments?.length > 1 && <AttachmentsViewer files={contentTextElement.attachments} />}
            {contentTextElement.attachments?.length === 1 && <AttachmentViewer file={contentTextElement.attachments[0]} />}
            {contentTextElement.showButtons &&
                <>
                    <Divider sx={{ marginTop: 2 }} />
                    <Box sx={{ marginTop: 2 }}>
                        <ButtonsInput element={{ ...contentTextElement.buttonsDescription, id: elementId, type: ElementType.INPUT_BUTTONS }} />
                    </Box>
                </>
            }
        </Box>
    )
}
