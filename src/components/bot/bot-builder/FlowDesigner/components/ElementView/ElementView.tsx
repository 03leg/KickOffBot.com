import { Box } from '@mui/material'
import React, { useMemo } from 'react'
import { TextContent } from '../elements/TextContent';
import { Colors } from '~/themes/Colors';
import { ElementType, type UIElement } from '../../../types';
import { getIconByType } from '../../../utils';

interface Props {
    element: UIElement;
}

export const ElementView = ({ element }: Props) => {
    const child = useMemo(() => {
        let result: React.JSX.Element | null = null;

        switch (element.type) {
            case ElementType.CONTENT_TEXT: {
                result = (<TextContent element={element} />);
                break;
            }
        }

        return result;

    }, [element]);

    const icon = useMemo(() => {
        return getIconByType(element.type);
    }, [element.type]);


    return (
        <Box sx={{ display: 'flex', backgroundColor: Colors.BACKGROUND_COLOR, border: Colors.BORDER, borderRadius: 1, mb: 1, alignItems: 'flex-start', padding: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>{icon}</Box>
            <Box>{child}</Box>
        </Box>
    )
}
