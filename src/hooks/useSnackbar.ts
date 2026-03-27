import { useState } from "react";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message: string,
    severity: SnackbarState["severity"] = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return { snackbar, showSnackbar, closeSnackbar };
}
