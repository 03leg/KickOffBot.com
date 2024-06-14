import { HTTPMethod, HTTPRequestIntegrationUIElement, HttpHeader } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React, { useCallback, useEffect } from 'react'
import { HttpMethodSelector } from './HttpMethodSelector';
import { UrlEditor } from './UrlEditor';
import { CustomHeadersEditor } from './CustomHeadersEditor';
import { HttpBodyEditor } from './HttpBodyEditor';
import { SaveResponseDataEditor } from './SaveResponseDataEditor';
import { TestRequestButton } from './TestRequestButton';


interface Props {
    element: HTTPRequestIntegrationUIElement;
}

export const IntegrationHttpRequestEditor = ({ element }: Props) => {
    const [httpMethod, setHttpMethod] = React.useState<HTTPMethod>(element.httpMethod);
    const [url, setUrl] = React.useState<string>(element.url);
    const [customHeaders, setCustomHeaders] = React.useState<HttpHeader[]>(element.customHeaders);
    const [useRequestBody, setUseRequestBody] = React.useState<boolean>(element.useRequestBody);
    const [requestBody, setRequestBody] = React.useState<string>(element.requestBody);
    const [saveResponseData, setSaveResponseData] = React.useState<boolean>(element.saveResponseData);
    const [responseDataVariableId, setResponseDataVariableId] = React.useState<string | undefined>(element.responseDataVariableId);

    const handleHttpMethodChange = useCallback((httpMethod: HTTPMethod) => {
        setHttpMethod(httpMethod);
    }, []);

    const handleUrlChange = useCallback((url: string) => {
        setUrl(url);
    }, []);

    const handleUseRequestBodyChange = useCallback((useRequestBody: boolean) => {
        setUseRequestBody(useRequestBody);
    }, []);

    const handleRequestBodyChange = useCallback((requestBody: string) => {
        setRequestBody(requestBody);
    }, []);

    useEffect(() => {
        element.httpMethod = httpMethod;
        element.url = url;
        element.customHeaders = customHeaders;
        element.useRequestBody = useRequestBody;
        element.requestBody = requestBody;

        element.saveResponseData = saveResponseData;
        element.responseDataVariableId = responseDataVariableId;
    }, [httpMethod, url, element, customHeaders, useRequestBody, requestBody, saveResponseData, responseDataVariableId]);


    const handleSaveResponseDataChange = useCallback((saveResponseData: boolean) => {
        setSaveResponseData(saveResponseData);
    }, []);


    const handleResponseDataVariableChange = useCallback((responseDataVariableId: string | undefined) => {
        setResponseDataVariableId(responseDataVariableId);
    }, [])

    return (
        <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex' }}>
                <HttpMethodSelector value={httpMethod} onHttpMethodChange={handleHttpMethodChange} />
                <UrlEditor url={url} onUrlChange={handleUrlChange} />
            </Box>
            <CustomHeadersEditor headers={customHeaders} onHeadersChange={setCustomHeaders} />
            <HttpBodyEditor useRequestBody={useRequestBody} useRequestBodyChange={handleUseRequestBodyChange} requestBody={requestBody} requestBodyChange={handleRequestBodyChange} />
            <SaveResponseDataEditor saveResponseData={saveResponseData} onSaveResponseDataChange={handleSaveResponseDataChange} responseDataVariableId={responseDataVariableId} onResponseDataVariableChange={handleResponseDataVariableChange} />
            {/* <TestRequestButton element={element} /> */}
        </Box>
    )
}
