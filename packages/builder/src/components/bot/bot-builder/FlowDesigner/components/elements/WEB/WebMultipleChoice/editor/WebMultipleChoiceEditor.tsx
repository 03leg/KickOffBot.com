import { BotVariable, DataSourceType, VariableType, WebMultipleChoiceUIElement } from "@kickoffbot.com/types";
import { Box, RadioGroup, FormControlLabel, Radio, Checkbox, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { WebMultipleChoiceStaticEditor } from "./components/WebMultipleChoiceStaticEditor";
import { VariableSelector } from "../../../../VariableSelector";
import { WebMultipleChoiceDynamicEditor } from "./components/WebMultipleChoiceDynamicEditor";

interface Props {
  element: WebMultipleChoiceUIElement;
}

export const WebMultipleChoiceEditor = ({ element }: Props) => {
  const [dataSourceType, setDataSourceType] = React.useState(element.dataSourceType);
  const [shuffleOptions, setShuffleOptions] = React.useState(element.shuffleOptions);
  const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');

  const handleDataSourceTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDataSourceType(event.target.value as DataSourceType);
    element.dataSourceType = event.target.value as DataSourceType;
  }, [element]);

  const handleShuffleOptionsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setShuffleOptions(event.target.checked);
    element.shuffleOptions = event.target.checked;
  }, [element]);

  const handleVariableChange = useCallback((newVariable: BotVariable) => {
    setSelectedVariableId(newVariable.id);
    element.variableId = newVariable.id;
  }, [element]);

  return <Box>
    <RadioGroup sx={{ flex: 1 }} row value={dataSourceType} onChange={handleDataSourceTypeChange}>
      <FormControlLabel value={DataSourceType.Static} control={<Radio />} label="Static options" />
      <FormControlLabel value={DataSourceType.Dynamic} control={<Radio />} label="Dynamic options" />
    </RadioGroup>
    {dataSourceType === DataSourceType.Static && <WebMultipleChoiceStaticEditor element={element} />}
    {dataSourceType === DataSourceType.Dynamic && <WebMultipleChoiceDynamicEditor element={element} />}

    <FormControlLabel control={<Checkbox checked={shuffleOptions} onChange={handleShuffleOptionsChange} />} label="Shuffle options" />
    <Typography>Select variable to save user input:</Typography>
    <Box sx={{ marginTop: 1 }}>
      <VariableSelector valueId={selectedVariableId} variableTypes={[VariableType.ARRAY]} onVariableChange={handleVariableChange} />
    </Box>
  </Box>;
};
