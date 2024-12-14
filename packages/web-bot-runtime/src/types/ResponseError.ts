import { ResponseErrorCode } from './ResponseErrorCode';

export interface RuntimeResponseError {
  errorCode: ResponseErrorCode;
  message: string;
}
