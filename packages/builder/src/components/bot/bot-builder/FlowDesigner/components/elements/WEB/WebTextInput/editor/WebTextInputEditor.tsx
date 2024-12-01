import { BotVariable, VariableType, WebInputTextUIElement } from '@kickoffbot.com/types';
import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { VariableSelector } from '../../../../VariableSelector';

interface Props {
  element: WebInputTextUIElement;
}

export const WebTextInputEditor = ({ element }: Props) => {
  const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');
  const [placeholder, setPlaceholder] = useState<string>(element.placeholder ?? '');
  const [multiline, setMultiline] = useState<boolean>(element.multiline ?? false);

  const handleVariableChange = useCallback((newVariable: BotVariable) => {
    setSelectedVariableId(newVariable.id);
    element.variableId = newVariable.id;
  }, [element]);

  const handlePlaceHolderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaceholder(event.target.value);
    element.placeholder = event.target.value;
  }, [element]);

  const handleMultilineChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMultiline(event.target.checked);
    element.multiline = event.target.checked
  }, [element]);

  return (
    <Box>
      <FormControlLabel control={<Checkbox checked={multiline} onChange={handleMultilineChange} />} label="Multiline" />
      <Typography>Placeholder:</Typography>
      <TextField sx={{ marginTop: 1, marginBottom: 3 }} fullWidth variant="outlined" value={placeholder} onChange={handlePlaceHolderChange} />

      <Typography>Select variable to save user input:</Typography>
      <Box sx={{ marginTop: 1 }}>
        <VariableSelector valueId={selectedVariableId} variableTypes={[VariableType.STRING]} onVariableChange={handleVariableChange} />
      </Box>
    </Box>
  )
}
