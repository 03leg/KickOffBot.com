import React, { useCallback, useLayoutEffect, useMemo } from 'react'
import { useOpinionScaleStyles } from './OpinionScale.style';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { OpinionScaleShowLabelsMode } from '@kickoffbot.com/types';

interface Props {
    min: number;
    max: number;
    value?: number;
    onValueChange: (value?: number) => void;
    showLabels: boolean;
    minLabel?: string;
    maxLabel?: string;
    button: React.ReactNode

    showLabelsMode: OpinionScaleShowLabelsMode;
    eachOptionLabel?: Record<number, string>;
}

export const OpinionScale = ({ min, max, value, onValueChange, showLabels, minLabel, maxLabel, button, showLabelsMode, eachOptionLabel }: Props) => {
    const { classes } = useOpinionScaleStyles();
    const toggleButtonGroupRef = React.useRef<HTMLDivElement>(null);
    const [toggleButtonGroupWidth, setToggleButtonGroupWidth] = React.useState(0);
    const [hoverOption, setHoverOption] = React.useState<number | undefined>(undefined);

    const handleChange = useCallback((event: React.MouseEvent<HTMLElement>,
        newValue: [undefined, number]) => {
        onValueChange(newValue[1])
    }, [onValueChange]);

    const maxValue = useMemo(() => {
        if (max <= min) {
            return min + 1;
        }

        if (max - min >= 10) {
            return min + 9;
        }

        return max;

    }, [max, min]);

    useLayoutEffect(() => {
        if (toggleButtonGroupRef.current && showLabels) {
            setToggleButtonGroupWidth(toggleButtonGroupRef.current.offsetWidth);
        }
    }, [showLabels]);


    const eachOptionLabelString = useMemo(() => {

        if (showLabelsMode !== OpinionScaleShowLabelsMode.EachOption) {
            return null;
        }

        if (eachOptionLabel && hoverOption) {
            return <Typography color='primary'>{eachOptionLabel[hoverOption] ?? ""}</Typography>;
        }

        if (eachOptionLabel && value && eachOptionLabel[value]) {
            return <Typography fontWeight={"bold"} color='primary'>{eachOptionLabel[value]}</Typography>;
        }

        return <Typography color='primary' sx={{ visibility: 'hidden'}}>{'☀️'}</Typography>;
    }, [eachOptionLabel, hoverOption, showLabelsMode, value]);

    return (
        <Box >
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
            }}>
                <ToggleButtonGroup className={classes.toggleButtonGroup} ref={toggleButtonGroupRef} color='primary' onChange={handleChange} value={[value]}>
                    {Array.from({ length: maxValue - min + 1 }, (_, i) => <ToggleButton className={classes.toggleButton}

                        onMouseEnter={() => setHoverOption(i + min)}
                        onMouseLeave={() => setHoverOption(undefined)}

                        key={i} value={i + min}>{i + min}</ToggleButton>)}
                </ToggleButtonGroup>
                {button}
            </Box>
            {showLabels && showLabelsMode === OpinionScaleShowLabelsMode.MaxAndMin && <Box className={classes.maxMinLabels} sx={{ width: toggleButtonGroupWidth }}>
                {<>
                    {minLabel && <Typography color='primary' className={classes.labelLeft}>{minLabel}</Typography>}
                    {maxLabel && <Typography color='primary' className={classes.labelRight}>{maxLabel}</Typography>}
                </>}
            </Box>}

            {showLabels && showLabelsMode === OpinionScaleShowLabelsMode.EachOption && <Box className={classes.eachOptionLabels}>
                {eachOptionLabelString}
            </Box>}
        </Box>
    )
}
