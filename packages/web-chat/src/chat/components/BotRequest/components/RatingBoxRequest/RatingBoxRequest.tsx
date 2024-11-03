import { RatingRequestElement, RequestDescriptionWebRuntime, WebRatingView } from '@kickoffbot.com/types';
import React, { useCallback, useMemo } from 'react'
import { useRatingBoxRequestStyles } from './RatingBoxRequest.style';
import { Box, Rating, Typography } from '@mui/material';
import { SendResponseButton } from '../SendResponseButton';
import { isNil } from 'lodash';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import { throwIfNil } from '../../../../utils/guard';

interface Props {
    request: RequestDescriptionWebRuntime;
}

export const RatingBoxRequest = ({ request }: Props) => {
    const ratingRequest = request.element as RatingRequestElement;
    const { classes } = useRatingBoxRequestStyles();
    const [currentValue, setCurrentValue] = React.useState<number | undefined>(ratingRequest.defaultAnswer);
    const [hoverOption, setHoverOption] = React.useState<number | undefined>(undefined);


    const handleValueChange = useCallback((event: React.ChangeEvent<unknown>, newValue: number | null) => {
        setCurrentValue(newValue ?? undefined);
    }, []);

    const handleSendResponse = useCallback(() => {
        throwIfNil(request.onResponse);


        request.onResponse({ data: currentValue })
    }, [currentValue, request]);

    const eachOptionLabelString = useMemo(() => {

        if (!ratingRequest.showLabels) {
            return null;
        }

        if (ratingRequest.eachOptionLabel && hoverOption) {
            return <Typography color='primary'>{ratingRequest.eachOptionLabel[hoverOption] ?? ""}</Typography>;
        }

        if (ratingRequest.eachOptionLabel && currentValue && ratingRequest.eachOptionLabel[currentValue]) {
            return <Typography fontWeight={"bold"} color='primary'>{ratingRequest.eachOptionLabel[currentValue]}</Typography>;
        }

        return <Typography color='primary' sx={{ visibility: 'hidden' }}>{'☀️'}</Typography>;
    }, [currentValue, hoverOption, ratingRequest.eachOptionLabel, ratingRequest.showLabels]);

    return (

        <Box className={classes.root} data-test-id="rating-box-request">
            <Box className={classes.ratingBox}>
                <Rating size="large" value={currentValue}
                    sx={{ mr: 1 }}
                    onChange={handleValueChange}
                    onChangeActive={(event, newHover) => {
                        setHoverOption(newHover === -1 ? undefined : newHover);
                    }}
                    {...(ratingRequest.view === WebRatingView.Heart ? {
                        icon: <FavoriteIcon fontSize="inherit" />,
                        emptyIcon: <FavoriteBorderIcon fontSize="inherit" />
                    } : {})}
                    {...(ratingRequest.view === WebRatingView.Smile ? {
                        icon: <SentimentSatisfiedAltIcon fontSize="inherit" />,
                        emptyIcon: <SentimentSatisfiedAltIcon fontSize="inherit" />
                    } : {})}
                    defaultValue={ratingRequest.defaultAnswer} max={ratingRequest.elementCount} precision={ratingRequest.precision} />
                <SendResponseButton onSendResponse={handleSendResponse} disabled={isNil(currentValue)} />
            </Box>
            {ratingRequest.showLabels && <Box>
                {eachOptionLabelString}
            </Box>}
        </Box>

    )
}
