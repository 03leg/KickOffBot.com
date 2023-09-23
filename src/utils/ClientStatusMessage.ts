import { enqueueSnackbar } from "notistack";

export function showError(message: string) {
  enqueueSnackbar(message, {
    variant: "error",
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
  });
}
