import { Button } from '@mui/material';
import router from 'next/router';
import React, { useCallback } from 'react'
import PaletteIcon from '@mui/icons-material/Palette';
import { useConfirm } from 'material-ui-confirm';

interface Props {
    botProjectId: string
}

export const EditThemeToolbarButton = ({ botProjectId }: Props) => {
    const confirm = useConfirm();

    const handleEditBotTheme = useCallback(() => {

        void confirm({ description: "Unsaved changes will be lost.", title: 'Are you sure?' })
            .then(() => {
                void router.push(`/theme-editor/${botProjectId}`);
            }).catch();

    }, [botProjectId, confirm]);

    return (
        <Button variant="outlined" sx={{ textTransform: 'none', ml: 1 }} startIcon={<PaletteIcon />} onClick={handleEditBotTheme}>
            Chat theme
        </Button>
    )
}
