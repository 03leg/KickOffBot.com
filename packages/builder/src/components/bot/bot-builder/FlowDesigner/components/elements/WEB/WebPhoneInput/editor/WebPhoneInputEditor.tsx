import { BotVariable, VariableType, WebInputPhoneUIElement } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { VariableSelector } from '../../../../VariableSelector';
import { useWebPhoneInputEditorStyles } from './WebPhoneInputEditor.style';
import { MenuTextField } from '~/components/commons/MenuTextField';
import { throwIfNil } from '~/utils/guard';

interface Props {
    element: WebInputPhoneUIElement;
}


export const WebPhoneInputEditor = ({ element }: Props) => {
    const [selectedVariableId, setSelectedVariableId] = useState<string>(element.variableId ?? '');
    const { classes } = useWebPhoneInputEditorStyles();
    const [defaultCountry, setDefaultCountry] = React.useState<string | undefined>(element.defaultCountry ?? 'us');

    const handleDefaultCountryChange = useCallback((value: string) => {
        const newValue = value === '' ? undefined : value;
        
        setDefaultCountry(newValue);
        element.defaultCountry = newValue;
    }, [element]);

    const countryCodes = useMemo(() => {
        return [
            { "label": "Afghanistan", "value": "af" },
            { "label": "Albania", "value": "al" },
            { "label": "Algeria", "value": "dz" },
            { "label": "Andorra", "value": "ad" },
            { "label": "Angola", "value": "ao" },
            { "label": "Antigua and Barbuda", "value": "ag" },
            { "label": "Argentina", "value": "ar" },
            { "label": "Armenia", "value": "am" },
            { "label": "Aruba", "value": "aw" },
            { "label": "Australia", "value": "au" },
            { "label": "Austria", "value": "at" },
            { "label": "Azerbaijan", "value": "az" },
            { "label": "Bahamas", "value": "bs" },
            { "label": "Bahrain", "value": "bh" },
            { "label": "Bangladesh", "value": "bd" },
            { "label": "Barbados", "value": "bb" },
            { "label": "Belarus", "value": "by" },
            { "label": "Belgium", "value": "be" },
            { "label": "Belize", "value": "bz" },
            { "label": "Benin", "value": "bj" },
            { "label": "Bhutan", "value": "bt" },
            { "label": "Bolivia", "value": "bo" },
            { "label": "Bosnia and Herzegovina", "value": "ba" },
            { "label": "Botswana", "value": "bw" },
            { "label": "Brazil", "value": "br" },
            { "label": "British Indian Ocean Territory", "value": "io" },
            { "label": "Brunei Darussalam", "value": "bn" },
            { "label": "Bulgaria", "value": "bg" },
            { "label": "Burkina Faso", "value": "bf" },
            { "label": "Burundi", "value": "bi" },
            { "label": "Cambodia", "value": "kh" },
            { "label": "Cameroon", "value": "cm" },
            { "label": "Canada", "value": "ca" },
            { "label": "Cape Verde", "value": "cv" },
            { "label": "Caribbean Netherlands", "value": "bq" },
            { "label": "Central African Republic", "value": "cf" },
            { "label": "Chad", "value": "td" },
            { "label": "Chile", "value": "cl" },
            { "label": "China", "value": "cn" },
            { "label": "Colombia", "value": "co" },
            { "label": "Comoros", "value": "km" },
            { "label": "Congo, Democratic Republic of the", "value": "cd" },
            { "label": "Congo, Republic of the", "value": "cg" },
            { "label": "Costa Rica", "value": "cr" },
            { "label": "Côte d'Ivoire", "value": "ci" },
            { "label": "Croatia", "value": "hr" },
            { "label": "Cuba", "value": "cu" },
            { "label": "Curaçao", "value": "cw" },
            { "label": "Cyprus", "value": "cy" },
            { "label": "Czech Republic", "value": "cz" },
            { "label": "Denmark", "value": "dk" },
            { "label": "Djibouti", "value": "dj" },
            { "label": "Dominica", "value": "dm" },
            { "label": "Dominican Republic", "value": "do" },
            { "label": "Ecuador", "value": "ec" },
            { "label": "Egypt", "value": "eg" },
            { "label": "El Salvador", "value": "sv" },
            { "label": "Equatorial Guinea", "value": "gq" },
            { "label": "Eritrea", "value": "er" },
            { "label": "Estonia", "value": "ee" },
            { "label": "Eswatini", "value": "sz" },
            { "label": "Fiji", "value": "fj" },
            { "label": "Finland", "value": "fi" },
            { "label": "France", "value": "fr" },
            { "label": "French Guiana", "value": "gf" },
            { "label": "French Polynesia", "value": "pf" },
            { "label": "Gabon", "value": "ga" },
            { "label": "Gambia", "value": "gm" },
            { "label": "Georgia", "value": "ge" },
            { "label": "Germany", "value": "de" },
            { "label": "Ghana", "value": "gh" },
            { "label": "Greece", "value": "gr" },
            { "label": "Grenada", "value": "gd" },
            { "label": "Guadeloupe", "value": "gp" },
            { "label": "Guam", "value": "gu" },
            { "label": "Guatemala", "value": "gt" },
            { "label": "Guinea", "value": "gn" },
            { "label": "Guinea-Bissau", "value": "gw" },
            { "label": "Guyana", "value": "gy" },
            { "label": "Haiti", "value": "ht" },
            { "label": "Honduras", "value": "hn" },
            { "label": "Hong Kong", "value": "hk" },
            { "label": "Hungary", "value": "hu" },
            { "label": "Iceland", "value": "is" },
            { "label": "India", "value": "in" },
            { "label": "Indonesia", "value": "id" },
            { "label": "Iran", "value": "ir" },
            { "label": "Iraq", "value": "iq" },
            { "label": "Ireland", "value": "ie" },
            { "label": "Israel", "value": "il" },
            { "label": "Italy", "value": "it" },
            { "label": "Jamaica", "value": "jm" },
            { "label": "Japan", "value": "jp" },
            { "label": "Jordan", "value": "jo" },
            { "label": "Kazakhstan", "value": "kz" },
            { "label": "Kenya", "value": "ke" },
            { "label": "Kiribati", "value": "ki" },
            { "label": "Kosovo", "value": "xk" },
            { "label": "Kuwait", "value": "kw" },
            { "label": "Kyrgyzstan", "value": "kg" },
            { "label": "Laos", "value": "la" },
            { "label": "Latvia", "value": "lv" },
            { "label": "Lebanon", "value": "lb" },
            { "label": "Lesotho", "value": "ls" },
            { "label": "Liberia", "value": "lr" },
            { "label": "Libya", "value": "ly" },
            { "label": "Liechtenstein", "value": "li" },
            { "label": "Lithuania", "value": "lt" },
            { "label": "Luxembourg", "value": "lu" },
            { "label": "Macao", "value": "mo" },
            { "label": "North Macedonia", "value": "mk" },
            { "label": "Madagascar", "value": "mg" },
            { "label": "Malawi", "value": "mw" },
            { "label": "Malaysia", "value": "my" },
            { "label": "Maldives", "value": "mv" },
            { "label": "Mali", "value": "ml" },
            { "label": "Malta", "value": "mt" },
            { "label": "Marshall Islands", "value": "mh" },
            { "label": "Martinique", "value": "mq" },
            { "label": "Mauritania", "value": "mr" },
            { "label": "Mauritius", "value": "mu" },
            { "label": "Mexico", "value": "mx" },
            { "label": "Micronesia", "value": "fm" },
            { "label": "Moldova", "value": "md" },
            { "label": "Monaco", "value": "mc" },
            { "label": "Mongolia", "value": "mn" },
            { "label": "Montenegro", "value": "me" },
            { "label": "Morocco", "value": "ma" },
            { "label": "Mozambique", "value": "mz" },
            { "label": "Myanmar", "value": "mm" },
            { "label": "Namibia", "value": "na" },
            { "label": "Nauru", "value": "nr" },
            { "label": "Nepal", "value": "np" },
            { "label": "Netherlands", "value": "nl" },
            { "label": "New Caledonia", "value": "nc" },
            { "label": "New Zealand", "value": "nz" },
            { "label": "Nicaragua", "value": "ni" },
            { "label": "Niger", "value": "ne" },
            { "label": "Nigeria", "value": "ng" },
            { "label": "North Korea", "value": "kp" },
            { "label": "Norway", "value": "no" },
            { "label": "Oman", "value": "om" },
            { "label": "Pakistan", "value": "pk" },
            { "label": "Palau", "value": "pw" },
            { "label": "Palestine", "value": "ps" },
            { "label": "Panama", "value": "pa" },
            { "label": "Papua New Guinea", "value": "pg" },
            { "label": "Paraguay", "value": "py" },
            { "label": "Peru", "value": "pe" },
            { "label": "Philippines", "value": "ph" },
            { "label": "Poland", "value": "pl" },
            { "label": "Portugal", "value": "pt" },
            { "label": "Puerto Rico", "value": "pr" },
            { "label": "Qatar", "value": "qa" },
            { "label": "Réunion", "value": "re" },
            { "label": "Romania", "value": "ro" },
            { "label": "Russia", "value": "ru" },
            { "label": "Rwanda", "value": "rw" },
            { "label": "Saint Kitts and Nevis", "value": "kn" },
            { "label": "Saint Lucia", "value": "lc" },
            { "label": "Saint Vincent and the Grenadines", "value": "vc" },
            { "label": "Samoa", "value": "ws" },
            { "label": "San Marino", "value": "sm" },
            { "label": "Sao Tome and Principe", "value": "st" },
            { "label": "Saudi Arabia", "value": "sa" },
            { "label": "Senegal", "value": "sn" },
            { "label": "Serbia", "value": "rs" },
            { "label": "Seychelles", "value": "sc" },
            { "label": "Sierra Leone", "value": "sl" },
            { "label": "Singapore", "value": "sg" },
            { "label": "Slovakia", "value": "sk" },
            { "label": "Slovenia", "value": "si" },
            { "label": "Solomon Islands", "value": "sb" },
            { "label": "Somalia", "value": "so" },
            { "label": "South Africa", "value": "za" },
            { "label": "South Korea", "value": "kr" },
            { "label": "South Sudan", "value": "ss" },
            { "label": "Spain", "value": "es" },
            { "label": "Sri Lanka", "value": "lk" },
            { "label": "Sudan", "value": "sd" },
            { "label": "Suriname", "value": "sr" },
            { "label": "Sweden", "value": "se" },
            { "label": "Switzerland", "value": "ch" },
            { "label": "Syria", "value": "sy" },
            { "label": "Taiwan", "value": "tw" },
            { "label": "Tajikistan", "value": "tj" },
            { "label": "Tanzania", "value": "tz" },
            { "label": "Thailand", "value": "th" },
            { "label": "Timor-Leste", "value": "tl" },
            { "label": "Togo", "value": "tg" },
            { "label": "Tonga", "value": "to" },
            { "label": "Trinidad and Tobago", "value": "tt" },
            { "label": "Tunisia", "value": "tn" },
            { "label": "Turkey", "value": "tr" },
            { "label": "Turkmenistan", "value": "tm" },
            { "label": "Tuvalu", "value": "tv" },
            { "label": "Uganda", "value": "ug" },
            { "label": "Ukraine", "value": "ua" },
            { "label": "United Arab Emirates", "value": "ae" },
            { "label": "United Kingdom", "value": "gb" },
            { "label": "United States", "value": "us" },
            { "label": "Uruguay", "value": "uy" },
            { "label": "Uzbekistan", "value": "uz" },
            { "label": "Vanuatu", "value": "vu" },
            { "label": "Vatican City", "value": "va" },
            { "label": "Venezuela", "value": "ve" },
            { "label": "Vietnam", "value": "vn" },
            { "label": "Yemen", "value": "ye" },
            { "label": "Zambia", "value": "zm" },
            { "label": "Zimbabwe", "value": "zw" }
        ];
    }, []);


    const handleVariableChange = useCallback((newVariable?: BotVariable) => {
        throwIfNil(newVariable);
        
        setSelectedVariableId(newVariable.id);
        element.variableId = newVariable.id;
    }, [element]);

    return (
        <Box>
            <Typography className={classes.editorTitle}>Country code:</Typography>
            <MenuTextField value={defaultCountry ?? ''} onChange={handleDefaultCountryChange} dataSource={countryCodes} />
            <Typography className={classes.editorTitle}>Select variable to save user input:</Typography>
            <Box className={classes.variableSelector}>
                <VariableSelector
                newVariableTemplate={{ type: VariableType.STRING, value: 'phone number' }}
                valueId={selectedVariableId} variableTypes={[VariableType.STRING]} onVariableChange={handleVariableChange} />
            </Box>
        </Box>
    )
}
