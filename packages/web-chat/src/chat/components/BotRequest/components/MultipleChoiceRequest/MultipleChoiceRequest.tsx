import { MultipleChoiceOptionDescription, MultipleChoiceRequestElement, RequestDescriptionWebRuntime } from '@kickoffbot.com/types';
import React, { useCallback } from 'react'
import { MultipleChoiceButton } from './MultipleChoiceButton';
import { useMultipleChoiceRequestStyles } from './MultipleChoiceRequest.style';
import { Box } from '@mui/material';
import { SendResponseButton } from '../SendResponseButton';
import { throwIfNil } from '../../../../utils/guard';

interface Props {
    request: RequestDescriptionWebRuntime;
}

function getInitialSelectedOptions(options: MultipleChoiceOptionDescription[], selectedOptions?: string[]) {
    if (!selectedOptions) {
        return [];
    }
    return options.filter(opt => selectedOptions.includes(opt.value));
}

export const MultipleChoiceRequest = ({ request }: Props) => {
    const { classes } = useMultipleChoiceRequestStyles();
    const multipleChoiceRequest = request.element as MultipleChoiceRequestElement;
    const [checkedOptions, setCheckedOptions] = React.useState<MultipleChoiceOptionDescription[]>(getInitialSelectedOptions(multipleChoiceRequest.options, multipleChoiceRequest.selectedOptions));

    const handleSendResponse = useCallback(() => {
        throwIfNil(request.onResponse);

        request.onResponse({ data: checkedOptions, message: checkedOptions.map(opt => opt.title).join(', ') });
    }, [checkedOptions, request]);

    const handleChange = useCallback((option: MultipleChoiceOptionDescription, isChecked: boolean) => {
        if (isChecked) {
            setCheckedOptions([...checkedOptions, option]);
        }
        else {
            setCheckedOptions(checkedOptions.filter(opt => opt !== option));
        }
    }, [checkedOptions]);

    return (
        <div className={classes.root}>
            <Box className={classes.items}>
                {multipleChoiceRequest.options?.map(option => <MultipleChoiceButton key={option.value} value={option.title}
                    onChange={(value) => handleChange(option, value)}
                    isChecked={checkedOptions.includes(option)}></MultipleChoiceButton>)}
            </Box>
            <Box className={classes.sendResponse}>
                <SendResponseButton onSendResponse={handleSendResponse} disabled={checkedOptions.length === 0} />
            </Box>
        </div>
    )
}
