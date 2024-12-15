import * as axios from "axios";

// source file: packages\web-bot-runtime\src\types\ResponseErrorCode.ts
enum ResponseErrorCode {
  NO_FOUND_RUNTIME_CONTEXT = 1000,
  UNKNOWN_APP_ERROR = 1001,
  NO_FOUND_BOT_PROJECT = 1002,
}

export function getResponseErrorConfig(error: unknown, defaultMessage: string) {
  if (axios.isAxiosError(error) && Object.hasOwnProperty.call(error.response?.data ?? {}, "errorCode")) {
    switch (error.response?.data.errorCode) {
      case ResponseErrorCode.NO_FOUND_RUNTIME_CONTEXT:
        return {
          message: "No found runtime context for your session. Please, try to restart the bot to start a new session...",
          showRestartButton: true,
        };
      case ResponseErrorCode.UNKNOWN_APP_ERROR:
        return { message: "Sorry, something went wrong... Please, try to restart the bot may be it will help...", showRestartButton: true };
      case ResponseErrorCode.NO_FOUND_BOT_PROJECT:
        return { message: "No found bot project. Please contact with bot owner...", showRestartButton: false };
    }
  }

  return { message: defaultMessage, showRestartButton: true };
}
