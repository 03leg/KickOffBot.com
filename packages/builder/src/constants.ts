export const MY_BOTS_PATH = '/my-bots' as const;
export const EDIT_BOT_PATH = `${MY_BOTS_PATH}/edit/` as const;

export const google_spreadsheets_scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
];