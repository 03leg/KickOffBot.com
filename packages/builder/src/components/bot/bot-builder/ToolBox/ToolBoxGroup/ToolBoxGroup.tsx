import { Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { type ToolBoxGroup } from '../types';
import { ToolBoxItemComponent } from './ToolBoxItem';

interface Props {
    group: ToolBoxGroup;
}

export const ToolBoxGroupComp = ({ group }: Props) => {
    return (
        <Stack>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, margin: 1, marginBottom: 0 }}>
                {group.title}
            </Typography>
            <Grid container>
                {group.items.map(item => <Grid key={item.title} item xs={item.size ?? 6} sm={item.size ?? 6}><ToolBoxItemComponent item={item} /></Grid>)}
            </Grid>
        </Stack>
    )
}
