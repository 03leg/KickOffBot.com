import React, { useCallback, useMemo, useState } from 'react';
import { NOW_DATE_TIME_VARIABLE_NAME, VariableType, type BotVariable } from '@kickoffbot.com/types';
import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent, TextField, FormLabel, RadioGroup, FormControlLabel, Radio, Link, Typography } from '@mui/material';
import { Editor } from '@monaco-editor/react';
import { MenuTextField } from '~/components/commons/MenuTextField';

interface Props {
    variable: BotVariable;
    onVariableChange: (variable: BotVariable) => void;
}

const JSON_ARRAY_OBJECT_VALUE = '[\n    {\n        \"productId\": 123,\n        \"productName\": \"Product #123\",\n        \"price\": 123\n    },\n    {\n        \"productId\": 2,\n        \"productName\": \"Product #321\",\n        \"price\": 321\n    }\n]' as const;
const JSON_OBJECT_VALUE = '{\n    \"productId\": 1,\n    \"productName\": \"Product #123\",\n    \"price\": 123\n}' as const;
const formats = [
    { "label": "YYYY-MM-DD HH:MM:SS, Example: 2024-08-20 14:30:00", "value": "YYYY-MM-DD HH:mm:ss" },
    { "label": "MM/DD/YYYY HH:MM AM/PM, Example: 08/20/2024 2:30 PM", "value": "MM/DD/YYYY h:mm A" },
    { "label": "DD/MM/YYYY HH:mm, Example: 20/08/2024 14:30", "value": "DD/MM/YYYY HH:mm" },
    { "label": "YYYY/MM/DD HH:mm, Example: 2024/08/20 14:30", "value": "YYYY/MM/DD HH:mm" },
    { "label": "YYYY.MM.DD HH:mm, Example: 2024.08.20 14:30", "value": "YYYY.MM.DD HH:mm" },
    { "label": "Month DD, YYYY HH:MM AM/PM, Example: August 20, 2024 2:30 PM", "value": "MMMM DD, YYYY h:mm A" },
    { "label": "DD-MM-YYYY HH:MM, Example: 20-08-2024 14:30", "value": "DD-MM-YYYY HH:mm" },
    { "label": "YYYY Month DD HH:MM AM/PM, Example: 2024 August 20 2:30 PM", "value": "YYYY MMMM DD h:mm A" },
    { "label": "Day Month YYYY HH:MM AM/PM, Example: 20 August 2024 2:30 PM", "value": "DD MMMM YYYY h:mm A" },
    { "label": "YYYY-MM-DD, Example: 2024-08-20", "value": "YYYY-MM-DD" },
    { "label": "MM/DD/YYYY, Example: 08/20/2024", "value": "MM/DD/YYYY" },
    { "label": "DD/MM/YYYY, Example: 20/08/2024", "value": "DD/MM/YYYY" },
    { "label": "YYYY/MM/DD, Example: 2024/08/20", "value": "YYYY/MM/DD" },
    { "label": "YYYY.MM.DD, Example: 2024.08.20", "value": "YYYY.MM.DD" },
    { "label": "Month DD, YYYY, Example: August 20, 2024", "value": "MMMM DD, YYYY" },
    { "label": "DD-MM-YYYY, Example: 20-08-2024", "value": "DD-MM-YYYY" },
    { "label": "YYYY Month DD, Example: 2024 August 20", "value": "YYYY MMMM DD" },
    { "label": "Day Month YYYY, Example: 20 August 2024", "value": "DD MMMM YYYY" },
];


export const VariableEditor = ({ variable, onVariableChange }: Props) => {

    const [name, setName] = useState<string>(variable.name);
    const [type, setType] = useState<string>(variable.type);
    const [value, setValue] = useState<string | number | boolean>(variable.value as never);
    const [arrayItemtype, setArrayItemType] = useState<string | undefined>(variable.type === VariableType.ARRAY ? variable.arrayItemType?.toString() : undefined);
    const [dateTimeFormat, setDateTimeFormat] = React.useState(variable.dateTimeFormat ?? '');


    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        variable.name = event.target.value;
        onVariableChange(variable);
    }, [onVariableChange, variable]);

    const setVariableValue = useCallback((newValue: number | string | boolean) => {
        setValue(newValue);
        variable.value = newValue;
    }, [setValue, variable])

    const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {

        if (variable.id === NOW_DATE_TIME_VARIABLE_NAME) {
            return;
        }

        setVariableValue(event.target.value);
        onVariableChange(variable);
    }, [onVariableChange, setVariableValue, variable]);

    const handleTypeChange = useCallback((event: SelectChangeEvent<string>) => {
        setType(event.target.value);
        variable.type = event.target.value as VariableType;


        switch (variable.type) {
            case VariableType.DATE_TIME: {
                setVariableValue('');
                break;
            }
            case VariableType.STRING: {
                setVariableValue('')
                break;
            }
            case VariableType.NUMBER: {
                setVariableValue(0)
                break;
            }
            case VariableType.BOOLEAN: {
                setVariableValue(true)
                break;
            }
            case VariableType.OBJECT: {
                setVariableValue(JSON_OBJECT_VALUE)
                break;
            }
            case VariableType.ARRAY: {
                setArrayItemType(VariableType.OBJECT);
                variable.arrayItemType = VariableType.OBJECT;
                setVariableValue(JSON_ARRAY_OBJECT_VALUE)
                break;
            }
        }

        onVariableChange(variable);

    }, [onVariableChange, setVariableValue, variable]);

    const handleArrayItemTypeChange = useCallback((event: SelectChangeEvent<string>) => {
        setArrayItemType(event.target.value);
        variable.arrayItemType = event.target.value as VariableType;


        switch (variable.arrayItemType) {
            case VariableType.DATE_TIME: {
                setVariableValue('[]')
                break;
            }
            case VariableType.STRING: {
                setVariableValue('["item1", "item2", "item3"]')
                break;
            }
            case VariableType.NUMBER: {
                setVariableValue("[1, 2, 6, 7, 8]")
                break;
            }
            case VariableType.BOOLEAN: {
                setVariableValue("[true, false, false, true, true]")
                break;
            }
            case VariableType.OBJECT: {
                setVariableValue(JSON_ARRAY_OBJECT_VALUE)
                break;
            }
        }

        onVariableChange(variable);

    }, [onVariableChange, setVariableValue, variable]);


    const handleMonacoEditorChange = useCallback((value?: string) => {
        setVariableValue(value ?? '');
        onVariableChange(variable);
    }, [onVariableChange, setVariableValue, variable]);

    const handleDateTimeFormatChange = useCallback((value: string) => {
        setDateTimeFormat(value);
        variable.dateTimeFormat = value;
        onVariableChange(variable);
    }, [onVariableChange, variable])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
            <TextField disabled={variable.isPlatformVariable} fullWidth label='Name' variant="outlined" value={name} onChange={handleNameChange} />
            <FormControl fullWidth sx={{ marginTop: 2 }} disabled={variable.isPlatformVariable}>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                    labelId="type-select-label"
                    value={type}
                    label="Type"
                    onChange={handleTypeChange}
                >
                    <MenuItem value={VariableType.STRING.toString()}>string</MenuItem>
                    <MenuItem value={VariableType.NUMBER.toString()}>number</MenuItem>
                    <MenuItem value={VariableType.BOOLEAN.toString()}>boolean</MenuItem>
                    <MenuItem value={VariableType.OBJECT.toString()}>object</MenuItem>
                    <MenuItem value={VariableType.ARRAY.toString()}>array</MenuItem>
                    <MenuItem value={VariableType.DATE_TIME.toString()}>date+time</MenuItem>

                </Select>
            </FormControl>

            {type === VariableType.ARRAY.toString() && <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="type-array-item-select-label">Type of array items</InputLabel>
                <Select
                    labelId="type-array-item-select-label"
                    value={arrayItemtype}
                    label="Type of array items"
                    onChange={handleArrayItemTypeChange}
                >
                    <MenuItem value={VariableType.STRING.toString()}>string</MenuItem>
                    <MenuItem value={VariableType.NUMBER.toString()}>number</MenuItem>
                    <MenuItem value={VariableType.BOOLEAN.toString()}>boolean</MenuItem>
                    <MenuItem value={VariableType.OBJECT.toString()}>object</MenuItem>
                    <MenuItem value={VariableType.DATE_TIME.toString()}>date+time</MenuItem>

                </Select>
            </FormControl>}


            {(type === VariableType.OBJECT.toString() || type === VariableType.ARRAY.toString()) &&
                <Box sx={{ marginTop: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href="https://www.digitalocean.com/community/tutorials/an-introduction-to-json" target="_blank">An Introduction to JSON</Link>
                </Box>
            }

            {((type === VariableType.DATE_TIME.toString() && variable.name !== NOW_DATE_TIME_VARIABLE_NAME) ||
                (type === VariableType.ARRAY.toString() && arrayItemtype === VariableType.DATE_TIME)) &&
                <Box>
                    <Typography sx={{ marginTop: 1 }}>Format:</Typography>
                    <MenuTextField value={dateTimeFormat} onChange={handleDateTimeFormatChange} dataSource={formats} />
                </Box>
            }


            {(type === VariableType.STRING.toString() || type === VariableType.DATE_TIME.toString()) &&
                (<TextField
                    sx={{ marginTop: 2 }}
                    id="string-value"
                    label="Initial Value"
                    multiline
                    fullWidth
                    rows={8}
                    value={value}
                    onChange={handleValueChange}
                />)}

            {(type === VariableType.OBJECT.toString() || type === VariableType.ARRAY.toString()) &&
                <Box sx={{ marginTop: 2 }}>
                    <InputLabel sx={{ marginBottom: 1, fontSize: '0.75rem' }}>Initial value</InputLabel>

                    <Editor height="250px"
                        defaultLanguage="json"
                        value={value as string}
                        options={{ minimap: { enabled: false } }}
                        onChange={handleMonacoEditorChange} />
                </Box>
            }

            {type === VariableType.NUMBER.toString() &&
                (<TextField
                    type="number"
                    sx={{ marginTop: 2 }}
                    label="Initial value"
                    value={value}
                    onChange={handleValueChange}
                />)}

            {type === VariableType.BOOLEAN.toString() &&
                (<FormControl sx={{ marginTop: 2 }}>
                    <FormLabel id="default-value-boolean-editor">Initial value</FormLabel>

                    <RadioGroup value={value} onChange={handleValueChange}>
                        <FormControlLabel value={true} control={<Radio />} label="True" />
                        <FormControlLabel value={false} control={<Radio />} label="False" />
                    </RadioGroup>
                </FormControl>)}
        </Box>
    )
}
