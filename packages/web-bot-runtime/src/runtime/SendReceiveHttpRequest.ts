/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HTTPRequestIntegrationUIElement,
  HttpHeader,
} from '@kickoffbot.com/types';
import axios from 'axios';
import { isEmpty } from 'lodash';

export interface IParsedTextStrategy {
  parse(text: string): string;
}

export class SendReceiveHttpRequest {
  private responseData: any;

  public get lastResponseData() {
    return this.responseData;
  }

  constructor(
    private element: HTTPRequestIntegrationUIElement,
    private parseTextStrategy?: IParsedTextStrategy,
  ) {}

  async send(): Promise<void> {
    if (isEmpty(this.element.url)) {
      throw new Error('Property "url" can not be null here');
    }

    const url = this.getParsedValue(this.element.url);
    const headers = this.getAxiosHeaders(this.element.customHeaders);
    const data = this.getBody();

    switch (this.element.httpMethod) {
      case 'GET': {
        const response = await axios.get(url, {
          headers,
        });

        this.responseData = response.data;
        break;
      }
      case 'POST':
        const response = await axios.post(url, {
          headers,
          data,
        });

        this.responseData = response.data;
        break;
      case 'PUT': {
        const response = await axios.put(url, {
          headers,
          data,
        });

        this.responseData = response.data;
        break;
      }
      case 'PATCH': {
        const response = await axios.patch(url, {
          headers,
          data,
        });

        this.responseData = response.data;
        break;
      }
      case 'DELETE': {
        const response = await axios.delete(
          this.getParsedValue(this.element.url),
          {
            headers,
          },
        );

        this.responseData = response.data;
        break;
      }
      default:
        throw new Error('Property "httpMethod" can not be null here');
    }
  }

  private getBody() {
    if (this.element.useRequestBody) {
      let body = this.getParsedValue(this.element.requestBody);

      try {
        body = JSON.parse(body);
      } catch {}

      return body;
    }

    return undefined;
  }

  private getAxiosHeaders(headers: HttpHeader[]) {
    const axiosHeaders: Record<string, string> = {};
    headers.forEach((header) => {
      axiosHeaders[header.header] = this.getParsedValue(header.value);
    });

    return axiosHeaders;
  }

  private getParsedValue(text: string): string {
    if (this.parseTextStrategy) {
      return this.parseTextStrategy.parse(text);
    }
    return text;
  }
}
