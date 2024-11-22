import { WebLogicBrowserCodeUIElement } from '@kickoffbot.com/types';
import React from 'react';

interface Props {
    element: WebLogicBrowserCodeUIElement;
}

export const WebLogicBrowserCode = ({ element }: Props) => {
    return (
        <div>
            {element.code && <>Execute javascript code in the browser</>}
            {!element.code && <>Configure &quot;Client code&quot; element...</>}
        </div>
    )
}
