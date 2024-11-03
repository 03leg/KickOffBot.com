import { OpinionScaleRequestElement, RequestDescriptionWebRuntime } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { OpinionScale } from './components/OpinionScale';
import { SendResponseButton } from '../SendResponseButton';
import { isNil } from 'lodash';
import { useOpinionScaleRequestStyles } from './OpinionScaleRequest.style';
import { throwIfNil } from '../../../../utils/guard';

interface Props {
    request: RequestDescriptionWebRuntime;
}

export const OpinionScaleRequest = ({ request }: Props) => {
    const { classes } = useOpinionScaleRequestStyles();
    const opinionScaleRequest = request.element as OpinionScaleRequestElement;
    const [currentValue, setCurrentValue] = useState<number | undefined>(opinionScaleRequest.defaultAnswer);
    const handleSendResponse = useCallback(() => {
        throwIfNil(request.onResponse);

        request.onResponse({ data: currentValue })
    }, [currentValue, request]);

    return (
        <Box className={classes.root}>
            <OpinionScale min={opinionScaleRequest.min}
                showLabels={opinionScaleRequest.showLabels}
                minLabel={opinionScaleRequest.minLabel}
                maxLabel={opinionScaleRequest.maxLabel}
                max={opinionScaleRequest.max}
                value={currentValue}
                showLabelsMode={opinionScaleRequest.showLabelsMode}
                eachOptionLabel={opinionScaleRequest.eachOptionLabel}
                button={<SendResponseButton onSendResponse={handleSendResponse} disabled={isNil(currentValue)} />}
                onValueChange={setCurrentValue} />
        </Box>
    )
}
