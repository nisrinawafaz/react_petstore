import { Alert, Snackbar } from "@mui/material";

interface Props {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

export default function SnackbarAlert({
  open,
  message,
  severity,
  onClose,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
