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

export function showSuccessMessage(message: string) {
  enqueueSnackbar(message, {
    variant: "success",
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
  });
}
