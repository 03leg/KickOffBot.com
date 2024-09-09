import { createContext } from "react";
import { DialogOptions } from "./types";

export default createContext({
  openDialog(dialogId: string, options: DialogOptions) {
  },
  closeDialog(dialogId: string) {
  },
});
